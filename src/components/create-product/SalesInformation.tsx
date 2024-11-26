import { ImageIcon, Plus, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Variant {
  name: string
  options: string[]
}

interface VariantCombination {
  id: string
  values: Record<string, string>
  price: string
  stock: string
  sku: string
  image?: string
}

export default function SalesInformation() {
  const [variants, setVariants] = useState<Variant[]>([])
  const [combinations, setCombinations] = useState<VariantCombination[]>([])
  const [newOption, setNewOption] = useState('')

  const addVariant = () => {
    setVariants([...variants, { name: '', options: [] }])
  }

  const removeVariant = (index: number) => {
    const newVariants = [...variants]
    newVariants.splice(index, 1)
    setVariants(newVariants)
  }

  const updateVariantName = (index: number, name: string) => {
    const newVariants = [...variants]
    newVariants[index].name = name
    setVariants(newVariants)
  }

  const addOption = (variantIndex: number) => {
    if (!newOption) return
    const newVariants = [...variants]
    newVariants[variantIndex].options.push(newOption)
    setVariants(newVariants)
    setNewOption('')
  }

  const removeOption = (variantIndex: number, optionIndex: number) => {
    const newVariants = [...variants]
    newVariants[variantIndex].options.splice(optionIndex, 1)
    setVariants(newVariants)
  }

  return (
    <div className='w-full p-4 lg:p-6 bg-white rounded-lg shadow-md space-y-4'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Thông tin bán hàng</h2>
        </div>

        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <div className='w-[12%]'>
              <span className='text-destructive mr-1'>*</span>
              <Label>Phân loại hàng</Label>
            </div>
            <Button variant='outline' size='sm' type='button' onClick={addVariant} className='flex items-center gap-1'>
              <Plus className='w-4 h-4' />
              Thêm nhóm phân loại
            </Button>
          </div>

          {variants.map((variant, variantIndex) => (
            <div key={variantIndex} className='space-y-4 p-4 bg-muted/30 rounded-lg'>
              <div className='flex gap-4'>
                <div className='flex-1'>
                  <Input
                    placeholder='e.g. Color, Size, etc'
                    value={variant.name}
                    onChange={(e) => updateVariantName(variantIndex, e.target.value)}
                  />
                </div>
                <Button type='button' variant='ghost' size='icon' onClick={() => removeVariant(variantIndex)}>
                  <X className='w-4 h-4' />
                </Button>
              </div>

              <div className='flex gap-2'>
                <Input
                  placeholder='e.g. Red, Blue, etc'
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className='max-w-[200px]'
                />
                <Button variant='outline' size='sm' type='button' onClick={() => addOption(variantIndex)}>
                  <Plus className='w-4 h-4 mr-1' />
                  Add
                </Button>
              </div>

              <div className='flex flex-wrap gap-2'>
                {variant.options.map((option, optionIndex) => (
                  <div key={optionIndex} className='flex items-center gap-1 bg-background px-3 py-1 rounded-md border'>
                    <span>{option}</span>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-4 w-4'
                      onClick={() => removeOption(variantIndex, optionIndex)}
                    >
                      <X className='w-3 h-3' />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {variants.length > 0 && (
            <div className='mt-6'>
              <div className='grid grid-cols-[1fr,1fr,1fr,1fr] gap-4 mb-2'>
                <div>Variant</div>
                <div>Price</div>
                <div>Stock</div>
                <div>SKU</div>
              </div>
              {combinations.map((combination) => (
                <div key={combination.id} className='grid grid-cols-[1fr,1fr,1fr,1fr] gap-4 items-center py-2 border-t'>
                  <div className='flex items-center gap-2'>
                    <div className='w-10 h-10 border rounded flex items-center justify-center'>
                      <ImageIcon className='w-4 h-4 text-muted-foreground' />
                    </div>
                    <div>{Object.values(combination.values).join(' / ')}</div>
                  </div>
                  <Input
                    type='number'
                    placeholder='Enter price'
                    value={combination.price}
                    onChange={(e) => {
                      const newCombinations = [...combinations]
                      const index = combinations.findIndex((c) => c.id === combination.id)
                      newCombinations[index].price = e.target.value
                      setCombinations(newCombinations)
                    }}
                  />
                  <Input
                    type='number'
                    placeholder='Enter stock'
                    value={combination.stock}
                    onChange={(e) => {
                      const newCombinations = [...combinations]
                      const index = combinations.findIndex((c) => c.id === combination.id)
                      newCombinations[index].stock = e.target.value
                      setCombinations(newCombinations)
                    }}
                  />
                  <Input
                    placeholder='Enter SKU'
                    value={combination.sku}
                    onChange={(e) => {
                      const newCombinations = [...combinations]
                      const index = combinations.findIndex((c) => c.id === combination.id)
                      newCombinations[index].sku = e.target.value
                      setCombinations(newCombinations)
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
