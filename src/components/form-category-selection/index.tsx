/* eslint-disable react-hooks/exhaustive-deps */
import { Check, ChevronDown, ChevronRight, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Path, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { SystemServiceSchema } from '@/schemas/system-service.schema'
import { ICategory } from '@/types/category'
import { FormProductSchema } from '@/variables/productFormDetailFields'

import { Button } from '../ui/button'
import { FormControl } from '../ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ScrollArea } from '../ui/scroll-area'

type FormSchemaType = z.infer<typeof FormProductSchema> | z.infer<typeof SystemServiceSchema>
interface FormCategorySelectionProps<T extends FormSchemaType> {
  categories: ICategory[]
  onSelect?: (selectedCategories: string) => void
  resetSignal?: boolean
  defineFormSignal?: boolean
  form: UseFormReturn<T>
}
export default function FormCategorySelection<T extends FormSchemaType>({
  categories,
  onSelect,
  resetSignal,
  defineFormSignal,
  form
}: FormCategorySelectionProps<T>) {
  const { t } = useTranslation()
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([])
  const [chosenCategories, setChosenCategories] = useState<ICategory[]>([])
  const [open, setOpen] = useState(false)
  const [categoryError, setCategoryError] = useState<string>('')
  const currentSelectedCategory = form.watch('category' as Path<T>)

  // Get root level categories (those with no parent)
  const rootCategories = categories

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
  const getSubCategories = (category: ICategory): ICategory[] => {
    return category.subCategories || []
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
    const hasSubCategories = lastSelectedCategory ? (lastSelectedCategory.subCategories?.length || 0) > 0 : false

    if (hasSubCategories) {
      // If the last selected category has children, show an error or notification
      setCategoryError(t('createProduct.pleaseChooseLastLevelCategory'))
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
  useEffect(() => {
    // Helper to find the category object by ID
    const findCategoryById = (id: string): ICategory | undefined => {
      const findInCategories = (cats: ICategory[]): ICategory | undefined => {
        for (const cat of cats) {
          if (cat?.id === id) return cat
          if (cat?.subCategories) {
            const found = findInCategories(cat?.subCategories)
            if (found) return found
          }
        }
        return undefined
      }
      return findInCategories(categories)
    }

    // Function to build the path from leaf to root
    const buildCategoryPath = (categoryId: string): ICategory[] => {
      const path: ICategory[] = []
      let currentCategory = findCategoryById(categoryId)

      while (currentCategory) {
        path.unshift(currentCategory)
        currentCategory = currentCategory.parentCategory
          ? findCategoryById(currentCategory.parentCategory.id)
          : undefined
      }

      return path
    }
    if (currentSelectedCategory && typeof currentSelectedCategory === 'string' && currentSelectedCategory) {
      const categoryPath = buildCategoryPath(currentSelectedCategory)
      if (
        categoryPath.length !== selectedCategories.length ||
        categoryPath.some((cat, index) => cat.id !== selectedCategories[index]?.id)
      ) {
        setSelectedCategories(categoryPath)
        setChosenCategories(categoryPath)
      }
    } else {
      setSelectedCategories([])
      setChosenCategories([])
    }
  }, [defineFormSignal, form, categories, currentSelectedCategory])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className='w-full space-y-2'>
        <PopoverTrigger asChild>
          <FormControl>
            <div
              onClick={handleShowCategorySelect}
              className={`${!open ? 'outline-none' : 'ring-1 ring-ring'} relative border-primary/40 hover:cursor-pointer flex text-sm items-center justify-between py-2 px-3 shadow-sm rounded-md w-full border bg-transparent transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {!chosenCategories || chosenCategories?.length === 0 ? (
                <span className='text-muted-foreground line-clamp-1'>{t('createProduct.pleaseChooseCategory')}</span>
              ) : (
                <div className='flex items-center justify-between gap-1 w-full'>
                  <span>
                    {chosenCategories.map((cat) => cat.name).join(' > ') || t('createProduct.pleaseChooseCategory')}
                  </span>
                </div>
              )}
              <ChevronDown className='w-5 h-5 text-muted-foreground' />
            </div>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className='w-[100%] p-0' align='start'>
          <div className='w-full flex flex-col bg-white p-3 rounded-lg shadow-md'>
            <div className='flex text-sm p-2 bg-yellow-50 items-center gap-2 rounded-md'>
              <Info className='w-4 h-4' /> {t('createProduct.pleaseChooseLastLevelCategory')}
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
                const subCategories = getSubCategories(category)
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
              <span className='text-sm font-semibold'>{t('createProduct.beingChoosing')}: </span>
              {selectedCategories && selectedCategories?.length > 0 && (
                <span className='text-blue-500'>
                  {selectedCategories.map((cat) => cat.name).join(' > ') || t('createProduct.pleaseChooseCategory')}
                </span>
              )}
              {categoryError && categoryError.length > 0 && (
                <div className='text-destructive font-semibold text-sm'>{categoryError}</div>
              )}
              <div className='flex space-x-2'>
                <Button
                  type='button'
                  variant='outline'
                  className='border hover:border-primary hover:bg-primary/10 hover:text-primary'
                  onClick={handleCancelCategorySelect}
                >
                  {t('button.deselect')}
                </Button>
                <Button type='button' onClick={handleConfirmSelectCategory}>
                  {t('button.select')}
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </div>
    </Popover>
  )
}
