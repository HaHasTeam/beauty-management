import axios, { AxiosRequestConfig } from 'axios'

const BASE_URL = 'http://localhost:3000/allure'

export const privateRequest = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await axios({
    ...config,
    url: `${BASE_URL}${url}`,
    headers: {
      ...config?.headers,
      'Content-Type': 'application/json'
    }
  })

  return response.data.data
}
