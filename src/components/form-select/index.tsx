import { Check, ChevronDown, PlusCircle, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import EmptyInbox from '@/assets/images/EmptyInbox.png'
import { cn } from '@/lib/utils'

import Button from '../button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'

interface FormSelectProps {
  placeholder: string
  inputPlaceholder: string
  buttonText: string
  emptyText: string
  items: { value: string; label: string }[]
}
const FormSelect = ({ placeholder, inputPlaceholder, emptyText, items: initialItems, buttonText }: FormSelectProps) => {
  const [items, setItems] = useState(initialItems)
  const [selectedItem, setSelectedItem] = useState({ value: '', label: '' })
  const [hidden, setHidden] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [errorText, setErrorText] = useState('')

  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const handleShowCommandDialog = () => {
    setHidden(!hidden)
  }
  const handleSelectItem = (item: { value: string; label: string }) => {
    setSelectedItem(item)
    setHidden(true)
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
        setItems((prevItems) => [...prevItems, newItem])
        setSelectedItem(newItem)
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
  return (
    <div className='relative' ref={dropdownRef}>
      <div
        onClick={handleShowCommandDialog}
        className='hover:cursor-pointer flex text-sm items-center justify-between py-2 px-3 focus:border-primary shadow-sm rounded-md h-9 w-full border border-input bg-transparent transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
      >
        {selectedItem?.value === '' ? (
          <span className='text-muted-foreground'>{placeholder}</span>
        ) : (
          <span>{selectedItem?.label}</span>
        )}
        <ChevronDown className='w-5 h-5 text-muted-foreground' />
      </div>
      <div
        className={cn(
          'w-full absolute z-10 transition-all duration-300',
          hidden ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-screen'
        )}
      >
        {!hidden && (
          <div className='w-full shadow-sm p-3 rounded-lg bg-white mt-1'>
            <Command value={selectedItem?.label}>
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
                    >
                      <div className='w-full flex justify-between items-center'>
                        <span>{item?.label}</span>
                        {selectedItem?.value === item.value && <Check className='text-muted-foreground w-5 h-5' />}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <Separator className='my-1' />
            {showInput ? (
              <div className='flex gap-2 w-full px-3'>
                <div>
                  <Input
                    className='border border-primary/40'
                    placeholder={inputPlaceholder}
                    value={inputValue}
                    onChange={(e) => handleInputValueChange(e.target.value)}
                  />
                  {errorText && <span className='text-destructive'>{errorText}</span>}
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
