import axios from 'axios';

export const getErrorDetail = (error: unknown) =>
  axios.isAxiosError(error) ? (error.response?.data ?? error.message) : error;
