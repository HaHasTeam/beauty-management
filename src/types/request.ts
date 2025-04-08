type Paging = {
  page: number
  limit: number
  total: number
}

export type TServerResponse<T, TItems = undefined> = {
  message: string
  data: T & (TItems extends undefined ? object : { items: TItems })
}

export type TServerResponseWithPaging<TItems = undefined> = {
  message: string
  data: (TItems extends undefined ? object : { items: TItems }) & Paging
}

export type TPaginationResponse<T> = {
  total: number
  totalPages: number
  items: T[]
}

export type TMetaData = {
  id: string
  createdAt: string
  updatedAt: string
}

export type TServerError<TErrorResponse = unknown> = {
  message: string
  errors?: {
    [key in keyof TErrorResponse]: string
  }
}
export class ResponseError<TErrorResponse = unknown> extends Error {
  errors?: { [key in keyof TErrorResponse]: string }
  constructor(public response: TServerError<TErrorResponse>) {
    super(response.message)
    this.errors = response.errors
  }
}

export type BaseParams<T> = {
  page?: number
  limit?: number
  sortBy?: string
  order?: 'ASC' | 'DESC'
} & Partial<T>
