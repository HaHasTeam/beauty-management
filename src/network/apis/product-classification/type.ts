export type IUpdateProductClassificationQuantity = {
  classificationId: string
  quantity: number
}

export type IUpdateProductClassificationQuantitySchema = {
  classifications: IUpdateProductClassificationQuantity[]
}
