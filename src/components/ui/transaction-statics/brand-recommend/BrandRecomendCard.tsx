'use client'

import * as React from 'react'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/useDataTable'
import type { DataTableFilterField, DataTableQueryState } from '@/types/table'
import { useQuery } from '@tanstack/react-query'
import { CardWithFacetFilters } from '@/components/ui/CardWithFacetFilters'
import { RoleEnum } from '@/types/enum'
import { useStore } from '@/stores/store'
import { getAllUserApi } from '@/network/apis/user'
import { TUser } from '@/types/user'
import { TConsultantRecommendationData, TGetConsultantRecommendationParams } from '@/network/apis/user/type'
import { Static } from './Static'
import { TServerResponse } from '@/types/request'


    interface BrandRecommendCardProps {
  data: TConsultantRecommendationData
  queryStates?: [
    DataTableQueryState<TGetConsultantRecommendationParams>,
    React.Dispatch<React.SetStateAction<DataTableQueryState<TGetConsultantRecommendationParams>>>
  ]
}

export function BrandRecommendCard({ queryStates, data }: BrandRecommendCardProps) {
  const { user } = useStore()
  const isAdmin = [RoleEnum.ADMIN, RoleEnum.OPERATOR].includes(user?.role as RoleEnum)

  // Fetch consultants data - Simplified useQuery
  const { data: consultantData } = useQuery({
    queryKey: [getAllUserApi.queryKey], 
    queryFn: getAllUserApi.fn,
    enabled: isAdmin ,
    // Select function to filter and extract the user array
    select: (response: TServerResponse<TUser[]>) => 
      (response?.data ?? []).filter((user: TUser) => user.role === RoleEnum.CONSULTANT)
    // Let TS infer the return type here
  })

  // consultantData should be inferred as TUser[] | undefined
  const consultants = consultantData ?? [] 

  // Effect to set default consultantId
  React.useEffect(() => {
    if (isAdmin && consultants.length > 0 && queryStates) {
      const [queryState, setQueryState] = queryStates;
      const currentConsultantId = queryState.fieldFilters?.consultantId;

      if (!currentConsultantId) {
        const firstConsultantId = consultants[0]?.id;
        if (firstConsultantId) {
          setQueryState((prev) => ({
            ...prev,
            fieldFilters: {
              ...prev.fieldFilters,
              consultantId: firstConsultantId,
            },
          }));
        }
      }
    }
  }, [isAdmin, consultants, queryStates]); 

  // Filter fields definition
  const filterFields: DataTableFilterField<TGetConsultantRecommendationParams>[] = React.useMemo(() => {
    const fields: DataTableFilterField<TGetConsultantRecommendationParams>[] = []

    if (isAdmin && consultants.length > 0) { 
      fields.push({
        id: 'consultantId',
        label: 'Consultant',
        options: consultants.map((consultant: TUser) => ({
          label: consultant.email ?? `Consultant ${consultant.id}`,
          value: consultant.id ?? '' 
        })).filter(opt => opt.value), 
        isCustomFilter: true,
        isSingleChoice: true
      })
    }
    return fields
  }, [isAdmin, consultants])

  // Update useDataTable generic type
  const { table } = useDataTable<TGetConsultantRecommendationParams>({
    data: [], 
    columns: [], 
    pageCount: 0, 
    queryStates,
    filterFields,
    shallow: false,
    clearOnDefault: true
  })

  return (
    <div className='space-y-4 w-full overflow-auto'>
      <CardWithFacetFilters mainContent={<Static data={data} />}>
        <DataTableToolbar table={table} filterFields={filterFields} isTable={false}>
        </DataTableToolbar>
      </CardWithFacetFilters>
    </div>
  )
}
