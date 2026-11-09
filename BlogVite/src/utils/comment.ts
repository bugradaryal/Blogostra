import axios from 'axios';

export const COMMENT_MAX = 720;

export const getCommentError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.data?.message
    ? String(error.response.data.message)
    : 'Yorum eklenemedi.';