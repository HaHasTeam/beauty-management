import { StateCreator } from 'zustand'

import { BranchesState, BranchSlice } from './branch.type'

const initialState: BranchesState = {
  stepStore: [],
  branch: {
    name: '',
    logo: '',
    documents: [],
    description: '',
    email: '',
    phone: '',
    address: '',
    status: 'PENDING'
  }
} as BranchesState

export const createBranchSlice: StateCreator<BranchSlice, [['zustand/immer', never]], [], BranchSlice> = (set) => ({
  ...initialState,
  setStepStore: (data) =>
    set((state) => {
      const existStep = state.stepStore.find((item) => item.step === data.step)
      if (existStep) {
        existStep.data = data.data
      } else {
        state.stepStore.push(data)
      }
    }),
  setBranchState: ({ name, logo, documents, address, email }) => {
    return set((state) => {
      state.branch.name = name
      state.branch.address = address
      state.branch.logo = logo
      state.branch.documents = documents
      state.branch.email = email
    })
  },
  resetStepStore: () => set(initialState),
  resetBrach: () => set(initialState)
})
