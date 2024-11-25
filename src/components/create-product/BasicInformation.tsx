import { useState } from 'react'
import { Toaster } from 'sonner'

import { PlateEditor } from '@/components/editor/plate-editor'
import { SettingsProvider } from '@/components/editor/settings'

import { Input } from '../ui/input'
import { Label } from '../ui/label'

const BasicInformation = () => {
  const [countName, setCountName] = useState(0)
  const [name, setName] = useState('')

  const handleCountName = (productName: string) => {
    setName(productName)
    setCountName(productName?.length)
  }
  return (
    <div className='bg-white rounded-xl shadow-md p-4 space-y-4'>
      <h3 className='font-bold text-xl'>Thông tin cơ bản</h3>
      <div>
        <Label htmlFor='product-image'>Hình ảnh sản phẩm</Label>
      </div>
      <div className='space-y-2 w-full'>
        <div className='flex w-full'>
          <div className='w-[12%]'>
            <span className='text-destructive mr-1'>*</span>
            <Label htmlFor='product-name'>Tên sản phẩm</Label>
          </div>
          <Input
            id='product-name'
            value={name}
            placeholder='Tên sản phẩm + Thương hiệu + Model + Thông số kỹ thuật'
            className='w-[88%] border-secondary'
            onChange={(e) => handleCountName(e.target.value)}
          />
        </div>
        <div className='text-sm text-muted-foreground text-right'>{countName}/120</div>
      </div>
      <div className='space-y-2 w-full'>
        <div className='flex w-full'>
          <div className='w-[12%]'>
            <span className='text-destructive mr-1'>*</span>
            <Label>Mô tả sản phẩm</Label>
          </div>
          <div className='h-screen w-full' data-registry='plate'>
            {/* <SettingsProvider> */}
            <PlateEditor />
            {/* </SettingsProvider> */}

            {/* <Toaster /> */}
          </div>
        </div>
        <div className='text-sm text-muted-foreground text-right'>0/3000</div>
      </div>
    </div>
  )
}

export default BasicInformation
