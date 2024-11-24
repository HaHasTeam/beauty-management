import type { RawAxiosRequestConfig } from 'axios'

export const axiosBaseOptions: RawAxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    Accept: 'application/json'
  }
}
