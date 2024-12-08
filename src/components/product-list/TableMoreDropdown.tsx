import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { AiOutlineShop, AiOutlineUser } from 'react-icons/ai'
import { BsThreeDots } from 'react-icons/bs'
import { TiLightbulb } from 'react-icons/ti'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { productFormMessage } from '@/constants/message'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getAllProductApi, updateProductApi } from '@/network/product'
import { IServerCreateProduct, ProductEnum } from '@/types/product'

import { Button } from '../ui/button'

function TableMoreDropDown(props: { transparent?: boolean; vertical?: boolean; id: string; currentStatus: string }) {
  const { transparent, vertical, id, currentStatus } = props
  const [open, setOpen] = useState(false)
  const { successToast } = useToast()
  const queryClient = useQueryClient()
  const handleServerError = useHandleServerError()

  const { mutateAsync: updateProductFn } = useMutation({
    mutationKey: [updateProductApi.mutationKey],
    mutationFn: updateProductApi.fn,
    onSuccess: () => {
      successToast({
        message: productFormMessage.successStatusMessage
      })
      queryClient.invalidateQueries({
        queryKey: [getAllProductApi.queryKey]
      })
    }
  })

  async function onSubmit(status: string) {
    try {
      const transformedData: IServerCreateProduct = {
        status: status
      }
      await updateProductFn({ productId: id ?? '', data: transformedData })
    } catch (error) {
      handleServerError({
        error
      })
    }
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={() => setOpen(!open)}
            className={`flex items-center text-xl hover:cursor-pointer ${
              transparent
                ? 'bg-transparent text-white hover:bg-transparent active:bg-transparent'
                : vertical
                  ? 'bg-transparent text-zinc-950 hover:bg-transparent active:bg-transparent dark:text-white dark:hover:bg-transparent dark:active:bg-transparent'
                  : 'bg-lightPrimary text-brand-500 p-2 hover:bg-gray-100 dark:bg-zinc-950 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10'
            } justify-center rounded-lg font-bold transition duration-200`}
          >
            {vertical ? (
              <p className='text-2xl hover:cursor-pointer'>
                <BsThreeDots />
              </p>
            ) : (
              <BsThreeDots className='h-6 w-6' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='z-[80] w-40 border-zinc-200 dark:border-zinc-800'>
          <DropdownMenuGroup>
            {currentStatus === ProductEnum.OFFICIAL && (
              <DropdownMenuItem onClick={() => onSubmit(ProductEnum.INACTIVE)}>
                <p className='flex cursor-pointer items-center gap-2 text-zinc-800 hover:font-medium hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white'>
                  <span>
                    <AiOutlineUser />
                  </span>
                  Hide
                </p>
              </DropdownMenuItem>
            )}
            {currentStatus === ProductEnum.INACTIVE && (
              <DropdownMenuItem onClick={() => onSubmit(ProductEnum.OFFICIAL)}>
                <p className='mt-2 flex cursor-pointer items-center gap-2 pt-1 text-zinc-950 hover:font-medium hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white'>
                  <span>
                    <AiOutlineShop />
                  </span>
                  Show
                </p>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <p className='mt-2 flex cursor-pointer items-center gap-2 pt-1 text-zinc-950 hover:font-medium hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white'>
                <span>
                  <TiLightbulb />
                </span>
                Copy
              </p>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default TableMoreDropDown
