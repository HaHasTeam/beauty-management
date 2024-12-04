export type TServerResponse<T> = {
  message: string
  data: T
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
