// src/auth/context/utils.js
import axiosInstance from 'src/utils/axios';

export function setSession(token) {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
}
