import { getWithExpiry, logOutAction, refreshToken } from '@/lib/action';
import Axios from 'axios';
import { toast } from 'sonner';

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Default headers for all Axios requests
const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Channel: 'web',
};

// Creating an Axios instance with default configuration
const api = Axios.create({
  baseURL,
  headers: headers,
  timeout: 120000, // Setting request timeout to 120 seconds
});

// Queue to hold requests during token refresh
const refreshAndRetryQueue = [];
// Flag to prevent multiple token refresh requests
let isRefreshing = false;

// Request interceptor to add Authorization header with the token
api.interceptors.request.use(
  (config) => {
    const user = getWithExpiry('vendor-storage');
    // Get tokens from storage
    const token = user?.token;
    config.headers['Authorization'] = `Bearer ${token || ''}`; // Set Authorization header
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request error
  }
);

// Response interceptor to handle errors, including token expiration
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config; // Save original request

    // Check if error is due to token expiration (401 status)
    if (error.response && error.response.status === 401) {
      // If not already refreshing the token
      if (!isRefreshing) {
        isRefreshing = true; // Set refreshing flag

        try {
          const newAccessToken = await refreshToken(); // Refresh the token
          if (newAccessToken) {
            // Update the Authorization header with the new token
            originalRequest.headers[
              'Authorization'
            ] = `Bearer ${newAccessToken}`;

            // Optimized method using Promise.all with error handling
            try {
              await Promise.all(
                refreshAndRetryQueue.map(({ config, resolve, reject }) =>
                  api.request(config).then(resolve).catch(reject)
                )
              );
            } catch (batchError) {
              // eslint-disable-next-line
              console.error('Error processing queued requests:', batchError);
              // Optionally handle the error (e.g., show a notification to the user)
              toast.error(
                'Error processing queued requests. Please try again.'
              );
            }

            refreshAndRetryQueue.length = 0; // Clear the queue
            return api(originalRequest); // Retry the original request
          } else {
            throw new Error('Session expired. Please log in again.');
          }
        } catch (refreshError) {
          toast.error('Session expired. Please log in again.');
          logOutAction(true); // Log out user on refresh token failure
          return Promise.reject(refreshError); // Reject the promise with the refresh error
        } finally {
          isRefreshing = false; // Reset refreshing flag
        }
      }

      // If already refreshing, add the request to the queue
      return new Promise((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
      });
    } else if (error.response && error.response.status === 403) {
      toast.error('Access forbidden. Please log in again.'); // Handle forbidden access
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Please check your connection and try again.'); // Handle network error
    }
    else if (error.response && error.response.status === 413) {
        return Promise.reject(new Error('The file you uploaded is too large. Please upload a smaller file.'));
    }
    else if (error.response && error.response.status >= 500) {
        return Promise.reject(new Error('Sorry, an error occurred. Please try again later.'));
    } else {
      // Handle other errors
      // commenting this out as the error can be 404
      // toast.error('An error occurred. Please try again.');
    }

    return Promise.reject(error); // Reject other errors
  }
);

export default api; // Export the configured Axios instance
