import { useQuery } from '@tanstack/react-query'
import { ChartColumnStacked, Leaf, Split, SquareCheckBig } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TreeDataItem, TreeView } from '@/components/ui/tree-view'
import { Routes, routesConfig } from '@/configs/routes'
import { getAllCategoryApi } from '@/network/apis/category'
import { ICategory } from '@/types/category'

const CategorySummary = () => {
  const { data: categoriesData } = useQuery({
    queryKey: [getAllCategoryApi.queryKey],
    queryFn: getAllCategoryApi.fn
  })

  const { id: categoryId } = useParams()
  const isInDetailPage = categoryId !== 'add'

  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useQueryState('selectedCategory', parseAsString.withDefault('root'))

  const handleNavigateToCategoryDetails = useCallback(
    (categoryId: string) => {
      navigate(
        routesConfig[Routes.CATEGORY_DETAILS].getPath({
          id: categoryId
        })
      )
    },
    [navigate]
  )

  const generateTreeData = useCallback(
    (categories: ICategory[]): TreeDataItem[] => {
      if (!categories.length) {
        return []
      }
      const data: TreeDataItem[] = categories.map((category) => {
        const categoryItem: TreeDataItem = {
          id: category.id,
          name: category.name,
          icon: category?.subCategories?.length ? Split : Leaf,
          selectedIcon: SquareCheckBig,
          onClick: () =>
            !isInDetailPage ? setSelectedCategory(category.id) : handleNavigateToCategoryDetails(category.id)
        }
        if (category?.subCategories?.length) {
          categoryItem.children = generateTreeData(category.subCategories)
        }
        return categoryItem
      })

      return data
    },
    [setSelectedCategory, handleNavigateToCategoryDetails, isInDetailPage]
  )
  const treeData = useMemo(() => {
    const data: TreeDataItem[] = [
      {
        id: 'root',
        name: 'All Categories (Root)',
        children: [],
        icon: Split,
        selectedIcon: SquareCheckBig,
        onClick: () => !isInDetailPage && setSelectedCategory('root')
      }
    ]
    if (categoriesData?.data) {
      data[0].children = generateTreeData(categoriesData.data)
    }
    return data
  }, [categoriesData, generateTreeData, setSelectedCategory, isInDetailPage])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-1'>
            <ChartColumnStacked />
            Category Structure
          </CardTitle>
          <CardDescription>Select a category to view its details.</CardDescription>
        </CardHeader>
        <CardContent>
          <TreeView data={treeData} initialSelectedItemId={isInDetailPage ? categoryId : selectedCategory} expandAll />
        </CardContent>
      </Card>
    </>
  )
}

export default CategorySummary
