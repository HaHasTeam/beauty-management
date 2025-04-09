import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import Button from '@/components/button'
import { createWalletApi, getMyWalletApi } from '@/network/apis/wallet'
import { useStore } from '@/stores/store'

const CreateWalletBtn = () => {
  const { t } = useTranslation()
  const user = useStore((state) => state.user)
  const { mutateAsync: createWalletFn, isPending } = useMutation({
    mutationKey: [createWalletApi.mutationKey],
    mutationFn: createWalletApi.fn
  })
  const queryClient = useQueryClient()
  const handleCreateWallet = async () => {
    if (!user) return
    await createWalletFn({ ownerId: user.id, balance: 0 })
    queryClient.invalidateQueries({
      queryKey: [getMyWalletApi.queryKey]
    })
  }

  return (
    <Button onClick={handleCreateWallet} loading={isPending}>
      {t('walletTerm.createWallet')}
    </Button>
  )
}

export default CreateWalletBtn
