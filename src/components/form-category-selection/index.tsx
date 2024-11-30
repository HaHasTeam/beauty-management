import { Check, ChevronDown, ChevronRight, Info } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ICategory } from '@/types/category'

import { Button } from '../ui/button'
import { FormControl } from '../ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ScrollArea } from '../ui/scroll-area'

interface FormCategorySelectionProps {
  categories: ICategory[]
  onSelect?: (selectedCategories: string) => void
  resetSignal?: boolean
}
export default function FormCategorySelection({ categories, onSelect, resetSignal }: FormCategorySelectionProps) {
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([])
  const [chosenCategories, setChosenCategories] = useState<ICategory[]>([])
  const [open, setOpen] = useState(false)
  const [categoryError, setCategoryError] = useState<string>('')

  // Get root level categories (those with no parent)
  const rootCategories = categories.filter((cat) => !cat.parentCategory)

  // Handle selection at a specific level
  const handleSelect = (category: ICategory | null, level: number) => {
    if (!category) {
      setSelectedCategories((prev) => prev.slice(0, level))
      return
    }

    setSelectedCategories((prev) => {
      const newSelected = prev.slice(0, level)
      newSelected[level] = category
      return newSelected
    })
  }

  // Helper function to fetch subcategories of the current category
  const getSubCategories = (parentId: string): ICategory[] => {
    return categories.filter((cat) => cat.parentCategory?.id === parentId)
  }
  const handleShowCategorySelect = () => {
    setOpen((prev) => !prev)
  }

  const handleCancelCategorySelect = () => {
    setSelectedCategories([])
    setChosenCategories([])
    onSelect?.('')
    setCategoryError('')
    setOpen(false)
  }
  const handleConfirmSelectCategory = () => {
    // Get the last selected category
    const lastSelectedCategory = selectedCategories[selectedCategories.length - 1]

    // Check if the last selected category has subcategories
    const hasSubCategories = lastSelectedCategory
      ? categories.some((cat) => cat.parentCategory?.id === lastSelectedCategory.id)
      : false

    if (hasSubCategories) {
      // If the last selected category has children, show an error or notification
      setCategoryError('Please select the last-level category.')
      return
    }

    // If validation passes, update the chosen categories and close the popover
    setChosenCategories(selectedCategories)
    setCategoryError('')
    setOpen(false)
    if (lastSelectedCategory) {
      onSelect?.(lastSelectedCategory.id)
    }
  }

  useEffect(() => {
    setSelectedCategories([])
    setChosenCategories([])
    setCategoryError('')
  }, [resetSignal])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className='w-full space-y-2'>
        <PopoverTrigger asChild>
          <FormControl>
            <div
              onClick={handleShowCategorySelect}
              className={`${!open && 'outline-none ring-1 ring-ring'} relative border-primary/40 hover:cursor-pointer flex text-sm items-center justify-between py-2 px-3 shadow-sm rounded-md w-full border bg-transparent transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {!chosenCategories || chosenCategories?.length === 0 ? (
                <span className='text-muted-foreground line-clamp-1'>Vui lòng chọn ngành hàng</span>
              ) : (
                <div className='flex items-center justify-between gap-1 w-full'>
                  <span>{chosenCategories.map((cat) => cat.name).join(' > ') || 'Vui lòng chọn ngành hàng'}</span>
                </div>
              )}
              <ChevronDown className='w-5 h-5 text-muted-foreground' />
            </div>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className='w-[100%] p-0' align='start'>
          <div className='w-full flex flex-col bg-white p-3 rounded-lg shadow-md'>
            <div className='flex text-sm p-2 bg-primary/10 items-center gap-2 rounded-md'>
              <Info className='w-4 h-4' /> Vui lòng chọn danh mục cuối cấp được in đậm.
            </div>
            <div className='w-full h-full flex'>
              <div className='w-full bg-white mt-1 border border-gray-300'>
                <ScrollArea className='h-full w-full'>
                  {rootCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`w-full flex justify-between p-2 cursor-pointer border-b border-gray-300 hover:bg-gray-200 ${
                        selectedCategories[0]?.id === category?.id ? 'bg-primary/10' : 'bg-white'
                      }`}
                      onClick={() => {
                        const newCategory = rootCategories.find((cat) => cat.id === category.id)
                        handleSelect(newCategory || null, 0)
                      }}
                    >
                      <div className='w-full flex justify-between'>
                        <span
                          className={`w-full ${category && (category?.subCategories ?? [])?.length === 0 && 'font-semibold'}`}
                        >
                          {category.name}
                        </span>
                        {selectedCategories[0]?.id === category?.id && (
                          <Check className='text-muted-foreground w-5 h-5' />
                        )}
                      </div>
                      {category && (category?.subCategories ?? [])?.length > 0 && (
                        <ChevronRight className='w-5 h-5 text-muted-foreground' />
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </div>
              {/* Render subsequent levels */}
              {selectedCategories.map((category, index) => {
                const subCategories = getSubCategories(category.id)
                if (subCategories.length === 0) return null

                return (
                  <ScrollArea key={`level-${index + 1}`} className='h-full w-full'>
                    <div className='w-full bg-white mt-1 border border-gray-300'>
                      {subCategories.map((subCategory) => (
                        <div
                          key={subCategory?.id}
                          className={`w-full flex justify-between p-2 cursor-pointer border-b border-gray-300 hover:bg-gray-200 ${
                            selectedCategories[index + 1]?.id === subCategory?.id ? 'bg-primary/10' : 'bg-white'
                          }`}
                          onClick={() => {
                            const nextCategory = subCategories.find((cat) => cat.id === subCategory.id)
                            handleSelect(nextCategory || null, index + 1)
                          }}
                        >
                          <div className='w-full flex justify-between'>
                            <span
                              className={`w-full ${subCategory && (subCategory?.subCategories ?? [])?.length === 0 && 'font-semibold'}`}
                            >
                              {subCategory.name}
                            </span>
                            {selectedCategories[index + 1]?.id === subCategory?.id && (
                              <Check className='text-muted-foreground w-5 h-5' />
                            )}
                          </div>
                          {subCategory && (subCategory?.subCategories ?? [])?.length > 0 && (
                            <ChevronRight className='w-5 h-5 text-muted-foreground' />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )
              })}
            </div>
            <div className='space-y-2'>
              <span className='text-sm font-semibold'>Đang chọn: </span>
              {selectedCategories && selectedCategories?.length > 0 && (
                <span className='text-blue-500'>
                  {selectedCategories.map((cat) => cat.name).join(' > ') || 'Vui lòng chọn ngành hàng'}
                </span>
              )}
              {categoryError && categoryError.length > 0 && (
                <div className='text-destructive font-semibold text-sm'>{categoryError}</div>
              )}
              <div className='flex space-x-2'>
                <Button type='button' onClick={handleConfirmSelectCategory}>
                  Xác nhận
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='border hover:border-primary hover:text-primary'
                  onClick={handleCancelCategorySelect}
                >
                  Bỏ chọn
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </div>
    </Popover>
  )
}
