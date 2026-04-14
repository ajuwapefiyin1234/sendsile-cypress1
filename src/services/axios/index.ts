import axios from 'axios';

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    channel: 'web',
    'Access-Control-Allow-Origin': '*',
  },
});
export const axiosPrivate = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    channel: 'web',
    'Access-Control-Allow-Origin': '*',
  },
});
