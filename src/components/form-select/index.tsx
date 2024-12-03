import { Check, ChevronDown, PlusCircle, X, XCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import EmptyInbox from '@/assets/images/EmptyInbox.png'
import { cn } from '@/lib/utils'
import { IOption } from '@/types/option'
import { FormProductSchema, IFormProductFieldId } from '@/variables/productFormDetailFields'

import Button from '../button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { FormControl } from '../ui/form'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'

interface FormSelectProps {
  fieldId: IFormProductFieldId
  placeholder: string
  inputPlaceholder: string
  buttonText: string
  emptyText: string
  items: IOption[]
  type?: 'select' | 'multiselect'
  maxMultiSelectItems?: number
  form: UseFormReturn<z.infer<typeof FormProductSchema>>
  resetSignal?: boolean
  defineFormSignal?: boolean
}
const FormSelect = ({
  fieldId,
  placeholder,
  inputPlaceholder,
  emptyText,
  items: initialItems,
  buttonText,
  type = 'select',
  maxMultiSelectItems,
  form,
  resetSignal,
  defineFormSignal
}: FormSelectProps) => {
  const [items, setItems] = useState(initialItems)
  const [hidden, setHidden] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [selectedItems, setSelectedItems] = useState<IOption[]>([])

  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const handleShowCommandDialog = () => {
    setHidden((prev) => !prev)
  }
  const handleSelectItem = (item: IOption) => {
    let updatedSelectedItems: IOption[]

    if (type === 'select') {
      updatedSelectedItems = [item]
      setHidden(true)
    } else {
      // For multiselect, toggle selection
      updatedSelectedItems = selectedItems.some((selected) => selected.value === item.value)
        ? selectedItems.filter((selected) => selected.value !== item.value)
        : [...selectedItems, item]
    }

    setSelectedItems(updatedSelectedItems)
    // handleChange(fieldId, updatedSelectedItems)
    form.setValue(
      `detail.${fieldId}`,
      updatedSelectedItems.map((item) => item.value)
    )
  }
  const handleRemoveSelectedItem = (value: string) => {
    setHidden(false)
    const updatedSelectedItems = selectedItems.filter((item) => item.value !== value)
    setSelectedItems((prev) => prev.filter((item) => item.value !== value))
    form.setValue(
      `detail.${fieldId}`,
      updatedSelectedItems.map((item) => item.value)
    )
  }
  const handleInputValueChange = (value: string) => {
    setInputValue(value)
  }

  const handleCancelSelectCustomItem = () => {
    setShowInput(false)
    setInputValue('')
  }
  const handleSelectCustomItem = () => {
    if (inputValue.trim()) {
      // Check if inputValue already exists in the items list
      const isDuplicate = items.some((item) => item.label.toLowerCase() === inputValue.trim().toLowerCase())

      if (isDuplicate) {
        setErrorText('This item already exists!')
      } else {
        // Proceed to add the new item if it's not a duplicate
        const newItem = { value: inputValue.trim(), label: inputValue.trim() }
        let updatedSelectedItems: IOption[]
        setItems((prevItems) => [...prevItems, newItem])
        if (type === 'select') {
          updatedSelectedItems = [newItem]
        } else {
          updatedSelectedItems = [...selectedItems, newItem]
        }
        setSelectedItems(updatedSelectedItems)
        form.setValue(
          `detail.${fieldId}`,
          updatedSelectedItems.map((item) => item.value)
        )
        setInputValue('')
        setShowInput(false)
        setHidden(true)
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setHidden(true)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setItems(initialItems)
    setHidden(true)
    setInputValue('')
    setShowInput(false)
    setErrorText('')
    setSelectedItems([])
  }, [resetSignal, initialItems])

  useEffect(() => {
    if (defineFormSignal) {
      const backendValues: string | string[] = form.getValues(`detail.${fieldId}`) || []

      // Map backend values to corresponding items in the `items` list
      const updatedSelectedItems = items.filter((item) => backendValues?.includes(item?.value))

      // Update the selectedItems state
      setSelectedItems(updatedSelectedItems)
    }
  }, [defineFormSignal, form, fieldId, items])
  return (
    <div className='relative' ref={dropdownRef}>
      <FormControl>
        <div
          onClick={handleShowCommandDialog}
          className={`${!hidden && 'outline-none ring-1 ring-ring'} border-primary/40 hover:cursor-pointer flex text-sm items-center justify-between py-2 px-3 shadow-sm rounded-md w-full border bg-transparent transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {type === 'select' ? (
            selectedItems[0]?.value === '' || selectedItems.length === 0 ? (
              <span className='text-muted-foreground line-clamp-1'>{placeholder}</span>
            ) : (
              <div className='flex items-center justify-between gap-1 w-full'>
                <span>{selectedItems[0]?.label}</span>
                <XCircle
                  className='cursor-pointer w-4 h-4 hover:text-primary/80 text-primary/70 bg-primary/10 hover:bg-primary/20 rounded-full'
                  onClick={() => handleRemoveSelectedItem(selectedItems[0]?.value)}
                />
              </div>
            )
          ) : (
            <div className='flex gap-1 flex-wrap'>
              {selectedItems.length === 0 ? (
                <span className='text-muted-foreground line-clamp-1'>{placeholder}</span>
              ) : (
                selectedItems.map((item) => (
                  <div
                    key={item.value}
                    className='flex items-center bg-primary/10 text-primary rounded-full px-2 py-1 text-xs gap-1'
                  >
                    <span>{item.label}</span>
                    <X
                      className='cursor-pointer w-4 h-4 text-primary'
                      onClick={() => handleRemoveSelectedItem(item.value)}
                    />
                  </div>
                ))
              )}
            </div>
          )}
          <ChevronDown className='w-5 h-5 text-muted-foreground' />
        </div>
      </FormControl>
      <div
        className={cn(
          'w-full absolute z-10 transition-all duration-300',
          hidden ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-screen'
        )}
      >
        {!hidden && (
          <div className='w-full shadow-sm p-3 rounded-lg bg-white mt-1 border border-gray-300'>
            <Command>
              <CommandInput placeholder={placeholder} />
              <CommandList>
                <CommandEmpty className='space-y-2 flex flex-col gap-2 items-center p-3'>
                  <div className='h-10 w-10'>
                    <img src={EmptyInbox} alt='No search result' className='w-full h-full object-cover' />
                  </div>
                  {emptyText}
                </CommandEmpty>
                <CommandGroup>
                  {items?.map((item) => (
                    <CommandItem
                      key={item?.value}
                      onSelect={() => handleSelectItem(item)}
                      className={cn('cursor-pointer px-3 py-2 rounded-md')}
                      disabled={
                        !!(
                          maxMultiSelectItems &&
                          selectedItems.length >= maxMultiSelectItems &&
                          !selectedItems.some((selected) => selected.value === item.value)
                        )
                      }
                    >
                      <div className='w-full flex justify-between items-center'>
                        <span>{item?.label}</span>
                        {type === 'select'
                          ? selectedItems[0]?.value === item.value && (
                              <Check className='text-muted-foreground w-5 h-5' />
                            )
                          : selectedItems.some((selected) => selected.value === item.value) && (
                              <Check className='text-muted-foreground w-5 h-5' />
                            )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <Separator className='my-1' />
            {showInput ? (
              <div className='flex gap-2 w-full px-3'>
                <div className='w-full'>
                  <Input
                    className='w-full border border-primary/40'
                    placeholder={inputPlaceholder}
                    value={inputValue}
                    onChange={(e) => handleInputValueChange(e.target.value)}
                  />
                  {errorText && <span className='text-destructive text-sm'>{errorText}</span>}
                </div>
                <Button
                  type='button'
                  variant='outline'
                  className='px-2 border border-destructive/40 text-destructive hover:text-destructive hover:bg-destructive/10'
                  onClick={handleCancelSelectCustomItem}
                >
                  <X />
                </Button>
                <Button
                  type='button'
                  variant='default'
                  className='px-2 border border-primary/40 text-primary-foreground hover:text-primary-foreground hover:bg-primary/80'
                  onClick={handleSelectCustomItem}
                  disabled={inputValue?.trim() === ''}
                >
                  <Check />
                </Button>
              </div>
            ) : (
              <div className='px-4'>
                <Button
                  className='border border-primary/40 text-primary hover:text-primary hover:bg-primary/10'
                  type='button'
                  variant='outline'
                  onClick={() => setShowInput(true)}
                >
                  <PlusCircle />
                  {buttonText}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FormSelect
