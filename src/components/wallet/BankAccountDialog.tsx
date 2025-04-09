import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/useToast'
import { createBankAccountApi, getBankAccountsApi } from '@/network/apis/bank-account'
import { TCreateBankAccountParams } from '@/network/apis/bank-account/type'

import BankAccountList from './BankAccountList'
import NewBankAccountForm from './NewBankAccountForm'

// Cập nhật lại kiểu dữ liệu cho props của NewBankAccountForm
type BankAccountFormData = {
  accountNumber: string
  accountName: string
  bankName: string
  isDefault?: boolean
}

const BankAccountDialog = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('list')
  const { successToast, errorToast } = useToast()

  // Sử dụng useQuery để lấy danh sách tài khoản ngân hàng
  const {
    data: bankAccountsResponse,
    isLoading: isLoadingAccounts,
    refetch,
    isFetching: isFetchingBankAccounts
  } = useQuery({
    queryKey: [getBankAccountsApi.queryKey],
    queryFn: getBankAccountsApi.fn,
    enabled: open // Chỉ fetch khi dialog mở
  })

  // Sử dụng useMutation để thêm tài khoản mới
  const { mutate: addBankAccount, isPending: isAddingAccount } = useMutation({
    mutationKey: [createBankAccountApi.mutationKey],
    mutationFn: createBankAccountApi.fn,
    onSuccess: () => {
      successToast({
        message: t('walletTerm.bankAccounts.addSuccess', 'Bank account added successfully')
      })
      // Invalidate query để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: [getBankAccountsApi.queryKey] })
      setActiveTab('list')
    },
    onError: () => {
      errorToast({
        message: t('walletTerm.bankAccounts.addError', 'Failed to add bank account')
      })
    }
  })

  // Tổng hợp trạng thái loading
  const isLoading = isLoadingAccounts || isAddingAccount

  // Danh sách tài khoản ngân hàng
  const bankAccounts = bankAccountsResponse?.data || []

  // Hàm xử lý submit từ form, trả về Promise để tương thích với NewBankAccountForm
  const handleAddBankAccount = async (data: BankAccountFormData) => {
    return new Promise<void>((resolve, reject) => {
      try {
        addBankAccount(data as TCreateBankAccountParams, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='text-primary border-primary/40 hover:bg-primary/5 w-fit'>
          {t('walletTerm.bankAccounts.manage', 'Manage Accounts')}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-xl max-h-[70%] overflow-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-gray-800'>
            {t('walletTerm.bankAccounts.title', 'Bank Accounts')}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full mt-4'>
          <TabsList className='grid grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg'>
            <TabsTrigger value='list' className='rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm'>
              {t('walletTerm.bankAccounts.viewAccounts', 'My Bank Accounts')}
            </TabsTrigger>
            <TabsTrigger value='add' className='rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm'>
              <Plus className='w-4 h-4 mr-2' />
              {t('walletTerm.bankAccounts.addAccount', 'Add New Account')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='list' className='mt-0'>
            <BankAccountList
              accounts={bankAccounts}
              isLoading={isLoading}
              isFetching={isFetchingBankAccounts}
              onRefresh={refetch}
            />
          </TabsContent>

          <TabsContent value='add' className='mt-0'>
            <NewBankAccountForm onSubmit={handleAddBankAccount} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default BankAccountDialog
