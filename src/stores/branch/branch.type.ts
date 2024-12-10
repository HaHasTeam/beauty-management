import { IBranch } from '@/types/Branch'

export type StoreStep = {
  step: number
  data: object
}
export type BranchesState = {
  branch: IBranch
  stepStore: StoreStep[]
}

export type BranchesActions = {
  setBranchState: (params: IBranch) => void
  resetBrach: () => void
  setStepStore: (data: StoreStep) => void
  resetStepStore: () => void
}

export type BranchSlice = BranchesState & BranchesActions
