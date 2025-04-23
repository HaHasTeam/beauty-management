/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from '@tanstack/react-query'
import { Check, ChevronRight, Loader2, Search, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import useDebounce from '@/hooks/useDebounce'
import { getProductFilterMutationApi } from '@/network/apis/product'
import { StatusEnum } from '@/types/enum'
import type { IResponseProduct, IServerProductClassification } from '@/types/product'

import ImageWithFallback from '../image/ImageWithFallback'

interface ExtendedResponseProduct extends IResponseProduct {
  selectedClassification?: IServerProductClassification
}

interface ProductSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectProducts: (products: ExtendedResponseProduct[]) => void
  initialSelectedProducts?: ExtendedResponseProduct[]
  title?: string
}

interface ClassificationSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: IResponseProduct | null
  onSelect: (product: IResponseProduct, classification: IServerProductClassification) => void
}

// Define a type for selected products with classification
interface SelectedProductWithClassification {
  product: IResponseProduct
  classification?: IServerProductClassification
}

// Replace the getCheapestClassification function with the provided one
export const getCheapestClassification = (classifications: IServerProductClassification[]) => {
  if (!classifications || classifications.length === 0) return null

  return classifications.reduce(
    (cheapest, current) => {
      // Ensure both current and cheapest have a defined price before comparison
      if (current?.price !== undefined && (cheapest?.price === undefined || current.price < cheapest.price)) {
        return current
      }
      return cheapest
    },
    null as IServerProductClassification | null
  )
}

const defaultLimit = 10

// Update the ClassificationSelectionDialog component to remove discount price display
function ClassificationSelectionDialog({ open, onOpenChange, product, onSelect }: ClassificationSelectionDialogProps) {
  const { t } = useTranslation()

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle>{t('product.selectVariation')}</DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          <h3 className='font-medium mb-2'>{product.name}</h3>
          <div className='space-y-2 mt-4'>
            {product.productClassifications?.map((classification) => (
              <Card
                key={classification.id}
                className='cursor-pointer hover:border-primary transition-colors'
                onClick={() => {
                  onSelect(product, classification)
                  onOpenChange(false)
                }}
              >
                <CardContent className='p-3 flex justify-between items-center'>
                  <div>
                    <p className='font-medium'>{classification.title || t('product.default')}</p>
                    <p className='text-sm font-medium'>{t('productCard.price', { price: classification.price })}</p>
                    <p className='text-xs text-muted-foreground'>
                      {classification.quantity} {t('product.inStock')}
                    </p>
                  </div>
                  <ChevronRight className='h-4 w-4 text-muted-foreground' />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ProductSearchDialog({
  open,
  onOpenChange,
  onSelectProducts,
  initialSelectedProducts = [],
  title = 'Select Products'
}: ProductSearchDialogProps) {
  const { t } = useTranslation()
  const { mutateAsync: searchMutate } = useMutation({
    mutationKey: [getProductFilterMutationApi.mutationKey],
    mutationFn: getProductFilterMutationApi.fn
  })

  // Search states
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [products, setProducts] = useState<IResponseProduct[]>([])
  const [allProducts, setAllProducts] = useState<IResponseProduct[]>([])

  // Use a separate state for selected products with their classifications
  const [selectedProductsWithClassifications, setSelectedProductsWithClassifications] = useState<
    SelectedProductWithClassification[]
  >([])

  // Classification dialog states
  const [classificationDialogOpen, setClassificationDialogOpen] = useState(false)
  const [selectedProductForClassification, setSelectedProductForClassification] = useState<IResponseProduct | null>(
    null
  )

  // Pagination states
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_totalItems, setTotalItems] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const prevDebouncedQuery = useRef(debouncedSearchQuery)

  // Initialize selected products from props
  useEffect(() => {
    if (open) {
      // Process initialSelectedProducts to extract any selected classifications
      const initialWithClassifications = initialSelectedProducts.map((product) => {
        return {
          product,
          classification: product.selectedClassification
        }
      })

      setSelectedProductsWithClassifications(initialWithClassifications)
      setPage(1)
      setHasMore(true)

      // If there's a search query, fetch products
      if (debouncedSearchQuery.trim().length > 2) {
        fetchProducts(true)
      }
    }
  }, [initialSelectedProducts, open])

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [open])

  // Fetch products when search query changes
  useEffect(() => {
    if (debouncedSearchQuery !== prevDebouncedQuery.current) {
      prevDebouncedQuery.current = debouncedSearchQuery

      if (debouncedSearchQuery.trim().length > 2 || debouncedSearchQuery === '') {
        fetchProducts(true)
      }
    }
  }, [debouncedSearchQuery])

  // Merge search results with selected products that aren't in the search results
  useEffect(() => {
    // Get IDs of products in search results
    const searchResultIds = new Set(products.map((product) => product.id))

    // Get selected products that aren't in search results
    const selectedProductsNotInSearch = selectedProductsWithClassifications
      .filter((item) => !searchResultIds.has(item.product.id))
      .map((item) => item.product)

    // Combine search results with selected products not in search
    setAllProducts([...products, ...selectedProductsNotInSearch])
  }, [products, selectedProductsWithClassifications])

  // Fetch products function
  const fetchProducts = useCallback(
    async (reset = false) => {
      if (isLoading || (!hasMore && !reset)) return

      try {
        setIsLoading(true)
        const currentPage = reset ? 1 : page

        const response = await searchMutate({
          search: debouncedSearchQuery,
          page: currentPage,
          limit: defaultLimit
        })

        if (response && response.data) {
          const newProducts = response.data.items
          const total = Number.parseInt(response.data.total || '0')

          setTotalItems(total)

          if (reset) {
            setProducts(newProducts)
          } else {
            setProducts((prev) => [...prev, ...newProducts])
          }

          setHasMore(currentPage * defaultLimit < total)

          if (!reset) {
            setPage(currentPage + 1)
          } else {
            setPage(2)
          }
        }
      } finally {
        setIsLoading(false)
      }
    },
    [debouncedSearchQuery, page, hasMore, isLoading, searchMutate]
  )

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Handle product selection
  const handleProductClick = useCallback(
    (product: IResponseProduct) => {
      // Check if product is already selected
      const isSelected = selectedProductsWithClassifications.some((item) => item.product.id === product.id)

      // If product is already selected, remove it
      if (isSelected) {
        setSelectedProductsWithClassifications((prev) => prev.filter((item) => item.product.id !== product.id))
        return
      }

      // Get active classifications
      const activeClassifications = product.productClassifications?.filter((c) => c.status === StatusEnum.ACTIVE) || []

      // If product has multiple active classifications, open dialog
      if (activeClassifications.length > 1) {
        setSelectedProductForClassification(product)
        setClassificationDialogOpen(true)
      } else if (activeClassifications.length === 1) {
        // If product has only one active classification, select it directly
        setSelectedProductsWithClassifications((prev) => [
          ...prev,
          {
            product,
            classification: activeClassifications[0]
          }
        ])
      } else if (product.productClassifications && product.productClassifications.length > 0) {
        // If no active classifications but has classifications, use the first one
        setSelectedProductsWithClassifications((prev) => [
          ...prev,
          {
            product,
            classification: product.productClassifications[0]
          }
        ])
      } else {
        // If product has no classifications, select it directly
        setSelectedProductsWithClassifications((prev) => [
          ...prev,
          {
            product,
            classification: undefined
          }
        ])
      }
    },
    [selectedProductsWithClassifications]
  )

  // Handle classification selection
  const handleClassificationSelect = useCallback(
    (product: IResponseProduct, classification: IServerProductClassification) => {
      setSelectedProductsWithClassifications((prev) => [
        ...prev,
        {
          product,
          classification
        }
      ])
    },
    []
  )

  // Improved scroll handler with throttling
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (isLoading || !hasMore) return

      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      const scrollBottom = scrollHeight - scrollTop - clientHeight

      // Load more when user scrolls to within 200px of the bottom
      if (scrollBottom < 200) {
        fetchProducts()
      }
    },
    [fetchProducts, isLoading, hasMore]
  )

  // Handle confirm selection
  const handleConfirm = useCallback(() => {
    // Convert our internal format back to the expected output format
    // Add the selected classification to each product
    const selectedProducts = selectedProductsWithClassifications.map((item) => {
      // Create a new object with the product properties and the extended property
      const extendedProduct: ExtendedResponseProduct = {
        ...item.product,
        selectedClassification: item.classification
      }

      return extendedProduct
    })

    onSelectProducts(selectedProducts)
    onOpenChange(false)
  }, [selectedProductsWithClassifications, onSelectProducts, onOpenChange])

  // Check if a product is selected
  const isProductSelected = useCallback(
    (productId: string) => selectedProductsWithClassifications.some((item) => item.product.id === productId),
    [selectedProductsWithClassifications]
  )

  // Remove a selected product
  const removeSelectedProduct = useCallback((productId: string) => {
    setSelectedProductsWithClassifications((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[600px] max-h-[90vh] flex flex-col overflow-hidden'>
          <DialogHeader>
            <DialogTitle>{title || t('product.selectProducts')}</DialogTitle>
          </DialogHeader>

          <div className='flex items-center space-x-2 mb-4'>
            <div className='relative flex-1 group'>
              <div className='absolute inset-0 rounded-md bg-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10'></div>
              <div className='absolute left-0 top-0 bottom-0 flex items-center pl-3 pointer-events-none'>
                <Search className='h-4 w-4 text-muted-foreground' />
              </div>
              <Input
                ref={inputRef}
                type='text'
                placeholder={t('product.searchProducts')}
                value={searchQuery}
                onChange={handleSearchChange}
                className='pl-10 pr-10 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted/40'
              />
              {searchQuery && (
                <div className='absolute right-0 top-0 bottom-0 flex items-center pr-3'>
                  <button
                    type='button'
                    onClick={handleClearSearch}
                    className='text-muted-foreground hover:text-foreground rounded-full p-1 hover:bg-muted transition-colors'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
              )}
            </div>
          </div>

          {selectedProductsWithClassifications.length > 0 && (
            <ScrollArea className='w-full max-h-[100px] mb-4 overflow-y-auto'>
              <div className='flex flex-wrap gap-2 p-1'>
                {selectedProductsWithClassifications.map((item) => (
                  <Badge key={item.product.id} variant='secondary' className='flex items-center gap-1 px-3 py-1.5'>
                    <span className='max-w-[200px] truncate'>
                      {item.product.name}
                      {item.classification && ` (${item.classification.title || t('product.default')})`}
                    </span>
                    <button
                      type='button'
                      onClick={() => removeSelectedProduct(item.product.id)}
                      className='ml-1 rounded-full hover:bg-muted p-0.5'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          )}

          <ScrollArea
            className='flex-1 rounded-md max-h-[400px] overflow-y-auto'
            onScrollCapture={handleScroll}
            ref={scrollAreaRef}
          >
            {allProducts.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 p-2'>
                {allProducts.map((product) => {
                  // Get cheapest classification
                  const productClassification = getCheapestClassification(product.productClassifications || [])

                  return (
                    <Card
                      key={product.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        isProductSelected(product.id) ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => handleProductClick(product)}
                    >
                      <CardContent className='p-3 flex gap-3'>
                        {/* Product Image with Fallback */}
                        <div className='h-16 w-16 rounded-md overflow-hidden flex-shrink-0'>
                          <ImageWithFallback
                            src={product.images?.[0]?.fileUrl || '/placeholder.svg'}
                            fallback={fallBackImage}
                            alt={product.name}
                            className='object-cover w-full h-full'
                          />
                        </div>

                        {/* Product Info */}
                        <div className='flex-1 min-w-0 flex flex-col justify-between'>
                          <div>
                            <p className='font-medium truncate'>{product.name}</p>
                          </div>

                          <div className='flex justify-between items-center mt-1'>
                            <p className='font-medium'>
                              {t('productCard.price', { price: productClassification?.price })}
                            </p>
                            <div className='flex items-center'>
                              {isProductSelected(product.id) ? (
                                <Check className='h-4 w-4 text-primary' />
                              ) : product.productClassifications && product.productClassifications.length > 1 ? (
                                <ChevronRight className='h-4 w-4 text-muted-foreground' />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center p-8 text-center'>
                {isLoading ? (
                  <Loader2 className='h-8 w-8 animate-spin text-primary mb-2' />
                ) : (
                  <>
                    <Search className='h-8 w-8 text-muted-foreground mb-2' />
                    <p className='text-muted-foreground'>
                      {debouncedSearchQuery ? t('product.noProductsFound') : t('product.searchToAddProducts')}
                    </p>
                  </>
                )}
              </div>
            )}

            {hasMore && products.length > 0 && (
              <div className='py-4 text-center'>
                <Button variant='outline' onClick={() => fetchProducts()} disabled={isLoading} className='w-full'>
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {t('common.loading')}
                    </>
                  ) : (
                    t('product.loadMore')
                  )}
                </Button>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className='mt-4 flex items-center justify-between'>
            <div className='text-sm text-muted-foreground'>
              {t('product.productsSelected', { count: selectedProductsWithClassifications.length })}
            </div>
            <div className='flex space-x-2'>
              <Button variant='outline' onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleConfirm} disabled={selectedProductsWithClassifications.length === 0}>
                <Check className='mr-2 h-4 w-4' />
                {t('common.confirm')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ClassificationSelectionDialog
        open={classificationDialogOpen}
        onOpenChange={setClassificationDialogOpen}
        product={selectedProductForClassification}
        onSelect={handleClassificationSelect}
      />
    </>
  )
}
