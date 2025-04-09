import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowRightLeft, Banknote, Coins, CreditCard, DollarSign, PiggyBank, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import Button from '@/components/button'
import { createWalletApi, getMyWalletApi } from '@/network/apis/wallet'
import { useStore } from '@/stores/store'

export default function NoWalletFound() {
  const { t } = useTranslation()
  const user = useStore((state) => state.user)
  const { mutateAsync: createWalletFn, isPending } = useMutation({
    mutationKey: [createWalletApi.mutationKey],
    mutationFn: createWalletApi.fn
  })
  const queryClient = useQueryClient()
  const handleCreateWallet = async () => {
    if (!user) return
    await createWalletFn({ ownerId: user.id, balance: 10000000 })
    queryClient.invalidateQueries({
      queryKey: [getMyWalletApi.queryKey]
    })
  }

  return (
    <div className='flex flex-col items-center justify-start bg-background p-8'>
      <div className='relative w-64 h-64 mb-8'>
        {/* Center icon */}
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <Wallet className='w-12 h-12 text-primary dark:text-white' />
        </div>

        {/* Circular icons */}
        <div className='absolute w-full h-full'>
          {/* Inner circle icons */}
          <CreditCard className='absolute top-1/4 left-1/4 w-6 h-6 text-primary/70' />
          <DollarSign className='absolute top-1/4 right-1/4 w-6 h-6 text-primary/70' />
          <Coins className='absolute bottom-1/4 left-1/4 w-6 h-6 text-primary/70' />
          <PiggyBank className='absolute bottom-1/4 right-1/4 w-6 h-6 text-primary/70' />

          {/* Outer circle icons */}
          <ArrowRightLeft className='absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 text-primary/40' />
          <Banknote className='absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/40' />
          <DollarSign className='absolute bottom-0 right-1/3 w-6 h-6 text-primary/40' />
          <Coins className='absolute bottom-1/4 left-0 w-6 h-6 text-primary/40' />
        </div>

        {/* Circular lines */}
        <div className='absolute inset-0'>
          <div className='w-full h-full rounded-full border-2 border-primary/20 dark:border-gray-800' />
          <div className='absolute top-1/2 left-1/2 w-3/4 h-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/20 dark:border-gray-800' />
          <div className='absolute top-1/2 left-1/2 w-1/2 h-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/20 dark:border-gray-800' />
        </div>
      </div>

      <h1 className='text-2xl font-semibold mb-4 text-primary'>{t('wallet.noWalletFound', 'No Wallet Found!')}</h1>
      <p className='text-muted-foreground text-center mb-8 max-w-md'>
        {t(
          'wallet.noWalletDescription',
          "You haven't created any wallet yet. Start managing your finances by creating a new wallet."
        )}
      </p>

      <div className='flex flex-wrap gap-4 justify-center'>
        <Button className='px-6 ' loading={isPending} onClick={handleCreateWallet}>
          {t('walletTerm.createWallet', 'Create Your Own Wallet')}
        </Button>
      </div>
    </div>
  )
}
