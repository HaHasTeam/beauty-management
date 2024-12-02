import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddressPopupProps {
  isOpen: boolean
  onClose: () => void
  onSave: (address: string) => void
}

export function AddressPopup({ isOpen, onClose, onSave }: AddressPopupProps) {
  const [address, setAddress] = useState('')

  const handleSave = () => {
    if (address.trim()) {
      onSave(address.trim())
      setAddress('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Thêm địa chỉ mới</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='address' className='text-right'>
              Địa chỉ
            </Label>
            <Input
              id='address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className='col-span-3'
              placeholder='Nhập địa chỉ mới'
            />
          </div>
        </div>
        <DialogFooter>
          <Button type='button' variant='secondary' onClick={onClose}>
            Hủy
          </Button>
          <Button type='button' onClick={handleSave} disabled={!address.trim()}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
