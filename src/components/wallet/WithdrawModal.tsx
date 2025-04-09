import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, ChevronRight, Info, PiggyBankIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import Button from '@/components/button'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { DialogClose } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/useToast'
import { getBanksApi } from '@/network/apis/bank'
import { getBankAccountsApi } from '@/network/apis/bank-account'
import { getMyWalletApi } from '@/network/apis/wallet'
import { createWithdrawalRequestApi, getWithdrawalRequestsApi } from '@/network/apis/wallet/withdrawal-requests'
import { formatCurrency } from '@/utils/number'

import { Input } from '../ui/input'

// Simple success content component
const SuccessContent = ({
  title = 'Success!',
  message = 'Your withdrawal request has been successfully submitted.'
}) => {
  return (
    <div className='w-full flex flex-col items-center justify-center p-4 py-10'>
      <div className='relative z-0 animate-pulse'>
        <div className='absolute -top-8 -left-8 w-32 h-32 bg-green-100 rounded-full blur-2xl' />
        <div className='absolute top-4 right-4 w-4 h-4 bg-green-200 rounded-full' />
        <div className='absolute -bottom-4 left-12 w-6 h-6 bg-green-200 rounded-full' />
        <div className='relative w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-8'>
          <Check className='w-12 h-12 text-green-500' />
        </div>
      </div>

      <h1 className='text-3xl font-bold text-gray-900 mb-4 z-20'>{title}</h1>

      <p className='text-center text-gray-500 max-w-md'>{message}</p>
    </div>
  )
}

type WithdrawalFormValues = {
  amount: number
  bankAccountId: string
}

const WithdrawModal = () => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false)
  const queryClient = useQueryClient()
  const successRef = useRef<HTMLDivElement>(null)

  // Get wallet balance
  const { data: walletData, isLoading: isLoadingWallet } = useQuery({
    queryKey: [getMyWalletApi.queryKey],
    queryFn: getMyWalletApi.fn
  })

  // Get bank accounts
  const { data: bankAccountsData, isLoading: isLoadingAccounts } = useQuery({
    queryKey: [getBankAccountsApi.queryKey],
    queryFn: getBankAccountsApi.fn
  })

  // Fetch banks to get logos
  const { data: banksData } = useQuery({
    queryKey: [getBanksApi.queryKey],
    queryFn: getBanksApi.fn,
    staleTime: 1000 * 60 * 60 // Cache for 1 hour
  })

  const defaultBankAccount = bankAccountsData?.data?.find((account) => account.isDefault)
  const bankAccounts = bankAccountsData?.data || []
  const banks = banksData?.data || []
  const walletBalance = walletData?.data?.balance || 0

  // Function to find bank logo
  const getBankLogo = (bankName: string): string | undefined => {
    // Try to find the bank by name (partial match)
    const bank = banks.find(
      (bank) =>
        bankName.toLowerCase().includes(bank.shortName.toLowerCase()) ||
        bank.name.toLowerCase().includes(bankName.toLowerCase())
    )
    return bank?.logo
  }

  // Predefined amounts for quick selection
  const predefinedAmounts = [
    { value: 50000, label: formatCurrency(50000) },
    { value: 100000, label: formatCurrency(100000) },
    { value: 200000, label: formatCurrency(200000) },
    { value: 500000, label: formatCurrency(500000) }
  ]

  // Validation schema with translations
  const withdrawalSchema = z.object({
    amount: z.coerce
      .number({
        required_error: t('validation.withdrawal.amountRequired', 'Please enter withdrawal amount')
      })
      .positive(t('validation.withdrawal.amountPositive', 'Amount must be positive'))
      .min(10000, t('validation.withdrawal.amountMinimum', 'Minimum withdrawal amount is 10,000')),
    bankAccountId: z.string({
      required_error: t('validation.withdrawal.bankAccountRequired', 'Please select a bank account')
    })
  })

  // Set up form
  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
      bankAccountId: ''
    }
  })

  useEffect(() => {
    if (defaultBankAccount) {
      form.setValue('bankAccountId', defaultBankAccount.id)
    }
  }, [defaultBankAccount, form])

  // Withdrawal mutation
  const withdrawalMutation = useMutation({
    mutationFn: createWithdrawalRequestApi.fn,
    onSuccess: () => {
      successToast({
        message: t('walletTerm.withdraw.success', 'Withdrawal Request Submitted'),
        description: t(
          'walletTerm.withdraw.successMessage',
          'Your withdrawal request has been successfully submitted and will be processed shortly.'
        )
      })

      // Update wallet balance and transaction list
      queryClient.invalidateQueries({
        queryKey: [getMyWalletApi.queryKey]
      })

      // Invalidate withdrawal requests query to refresh the list
      queryClient.invalidateQueries({
        queryKey: [getWithdrawalRequestsApi.queryKey]
      })

      setWithdrawalSuccess(true)
      setIsProcessing(false)
    },
    onError: (error) => {
      // eslint-disable-next-line
      console.error('Withdrawal error:', error)
      errorToast({
        message: t('walletTerm.withdraw.error', 'Withdrawal Failed'),
        description: t(
          'walletTerm.withdraw.errorMessage',
          "We couldn't process your withdrawal request at this time. Please try again later."
        )
      })
      setIsProcessing(false)
    }
  })

  const onSubmit = (values: WithdrawalFormValues) => {
    if (values.amount > walletBalance) {
      form.setError('amount', {
        message: t('validation.withdrawal.insufficientBalance')
      })
      return
    }

    setIsProcessing(true)
    withdrawalMutation.mutate({
      amount: values.amount,
      bankAccountId: values.bankAccountId
    })
  }

  // Scroll to success message when withdrawal is successful
  useEffect(() => {
    if (successRef.current && withdrawalSuccess) {
      successRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [withdrawalSuccess])

  const isLoading = isLoadingWallet || isLoadingAccounts || isProcessing

  return (
    <div className='w-full mx-auto p-4 space-y-6 relative'>
      {isLoading && <LoadingContentLayer />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          {!withdrawalSuccess && (
            <>
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <div className='bg-gray-50 p-4 rounded-lg shadow-sm border-2'>
                      <div className='flex justify-between mb-2'>
                        <span className='text-sm text-gray-600'>
                          {t('walletTerm.withdraw.amount', 'Amount')}
                          <Badge className='ml-2 text-white'>Withdraw</Badge>
                        </span>
                        <span className='text-sm text-gray-600 flex items-center gap-1'>
                          <span className='text-lg font-semibold'>VND</span>|{' '}
                          <span className='text-sm font-light'>Viet Nam Dong</span>
                        </span>
                      </div>
                      <Input
                        placeholder='0'
                        {...field}
                        type='number'
                        readOnly={isProcessing}
                        className='text-7xl font-normal mb-4 border-none h-fit bg-transparent focus-visible:ring-offset-0 focus-visible:border-none focus-visible::outline-none focus-visible:ring-0'
                      />
                      <div className='flex gap-2 flex-wrap'>
                        {predefinedAmounts.map((amt) => (
                          <Button
                            type='button'
                            onClick={() => {
                              if (isProcessing) return
                              field.onChange(amt.value)
                            }}
                            key={amt.value}
                            variant={field.value === amt.value ? 'destructive' : 'outline'}
                            className='rounded-full'
                          >
                            {amt.label}
                          </Button>
                        ))}
                      </div>
                      <div className='mt-2 flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200'>
                        <span className='text-sm text-gray-600'>
                          {t('walletTerm.withdraw.availableBalance', 'Available Balance')}
                        </span>
                        <span className='font-semibold'>{formatCurrency(walletBalance)}</span>
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {bankAccounts.length === 0 ? (
                <Alert>
                  <Info className='h-4 w-4' />
                  <AlertTitle>{t('walletTerm.withdraw.noBankAccount', 'No Bank Account Found')}</AlertTitle>
                  <AlertDescription>
                    {t(
                      'walletTerm.withdraw.addBankAccountFirst',
                      'Please add a bank account before making a withdrawal'
                    )}
                  </AlertDescription>
                </Alert>
              ) : (
                <FormField
                  control={form.control}
                  name='bankAccountId'
                  render={({ field }) => (
                    <FormItem>
                      <Label className='text-sm text-gray-600'>
                        {t('walletTerm.withdraw.selectBankAccount', 'Select Bank Account')}
                      </Label>
                      <RadioGroup
                        value={field.value}
                        className='space-y-2'
                        onValueChange={field.onChange}
                        disabled={isProcessing}
                      >
                        {bankAccounts.map((account) => {
                          const bankLogo = getBankLogo(account.bankName)

                          return (
                            <div
                              key={account.id}
                              className={`flex items-center justify-between border border-gray-200 rounded-lg p-3 ${
                                field.value === account.id ? 'border-primary bg-primary/5' : 'bg-white'
                              }`}
                            >
                              <div className='flex items-start gap-2'>
                                <RadioGroupItem value={account.id} id={account.id} />
                                <Label htmlFor={account.id} className='flex flex-col cursor-pointer'>
                                  <div className='flex items-center gap-2'>
                                    <div className='h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-1'>
                                      {bankLogo ? (
                                        <img src={bankLogo} alt={account.bankName} className='h-4 w-4 object-contain' />
                                      ) : (
                                        <PiggyBankIcon size={12} className='text-primary' />
                                      )}
                                    </div>
                                    <span className='font-medium'>{account.bankName}</span>
                                    {account.isDefault && (
                                      <div className='flex items-center text-xs text-primary bg-primary/10 px-2 py-1 rounded-full'>
                                        <Check className='h-3 w-3 mr-1' />
                                        {t('walletTerm.bankAccounts.default', 'Default')}
                                      </div>
                                    )}
                                  </div>
                                  <div className='flex items-center text-sm text-gray-600 mt-1'>
                                    <span>{account.accountNumber}</span>
                                    <span className='mx-2'>•</span>
                                    <span>{account.accountName}</span>
                                  </div>
                                </Label>
                              </div>
                              <ChevronRight className='h-4 w-4 text-gray-400' />
                            </div>
                          )
                        })}
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className='flex justify-end'>
                <Button
                  className='w-full'
                  variant='secondary'
                  type='submit'
                  disabled={isProcessing || bankAccounts.length === 0 || !form.watch('amount')}
                >
                  {t('walletTerm.withdraw.submitButton', 'Submit Withdrawal Request')}
                </Button>
              </div>

              <div className='text-xs text-gray-500 border rounded-md p-3 bg-gray-50'>
                <p>
                  {t(
                    'walletTerm.withdraw.withdrawalNote',
                    "Withdrawal requests are typically processed within 1-3 business days. The actual time when funds appear in your account may vary depending on your bank's processing schedule."
                  )}
                </p>
              </div>
            </>
          )}

          {withdrawalSuccess && (
            <>
              <div ref={successRef}>
                <SuccessContent
                  title={t('walletTerm.withdraw.success', 'Withdrawal Request Submitted')}
                  message={t(
                    'walletTerm.withdraw.successMessage',
                    'Your withdrawal request has been successfully submitted and will be processed shortly.'
                  )}
                />
              </div>
              <DialogClose className='w-full'>
                <Button className='w-full' variant='secondary' type='button'>
                  {t('common.close', 'Close')}
                </Button>
              </DialogClose>
            </>
          )}
        </form>
      </Form>
    </div>
  )
}

export default WithdrawModal
