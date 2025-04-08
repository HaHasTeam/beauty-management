export type TBank = {
  id: string
  name: string
  code: string
  logo: string
  shortName: string
  bin: string
  swiftCode: string
}

export type TBankResponse = {
  data: TBank[]
  meta: {
    total: number
    page: number
    limit: number
  }
}
