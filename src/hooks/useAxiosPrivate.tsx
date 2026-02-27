import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../services/axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const useAxiosPrivate = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        const accessToken = localStorage.getItem('__user_access');
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },

      (error) => {
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        return response;
      },

      async (error) => {
        if (error?.response.statusText === 'Unauthorized') {
          localStorage.clear();
          sessionStorage.clear();
          navigate('/');
          window.location.reload();
          return '';
        }
        if (error.code === 'ERR_NETWORK') {
          toast.error('Network Error, check network connection and try again');
          return '';
        } else if (error?.response?.status === 400 || error?.response?.status === 401) {
          return Promise.reject(error);
        } else if (error?.response?.status >= 500) {
          toast.error('An error occured, please try again');
          return '';
        } else {
          return error.response.data ? error.response.data : error.response;
        }
        // if (
        //   error?.response.status === 401 &&
        //   error?.response.statusText === "Unauthorized"
        // ) {
        //   localStorage.clear();
        //   sessionStorage.clear();
        //   navigate("/");
        //   window.location.reload();
        //   return Promise.reject(error);
        // }
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return axiosPrivate;
};

export default useAxiosPrivate;
