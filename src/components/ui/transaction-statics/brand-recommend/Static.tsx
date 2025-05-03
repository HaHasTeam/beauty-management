'use client'

import * as React from 'react'
import { TConsultantRecommendationData } from '@/network/apis/user/type'

import { Label, Pie, PieChart } from 'recharts'

import { ConsultantSuggestedProductsDialog } from '@/components/dialog/ConsultantSuggestedProductsDialog'
import Empty from '@/components/empty/Empty'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type Props = {
  data: TConsultantRecommendationData | null | undefined // Allow null/undefined
  consultantId?: string | null // Add consultantId prop
}

// Helper to calculate suggestion counts from percentage and total
const calculateSuggestions = (percentage: number, total: number): number => {
  if (!total || total === 0 || !percentage) return 0
  return Math.round((percentage / 100) * total)
}

export const Static = ({ data, consultantId }: Props) => {
  // State for Dialog
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedBrandId, setSelectedBrandId] = React.useState<string | null>(null)

  // Handler to open dialog
  const handleBrandClick = (brandId: string) => {
    setSelectedBrandId(brandId)
    setDialogOpen(true)
  }

  // Memoize total suggestions - use this as the primary total
  const totalSuggestions = React.useMemo(() => {
    return data?.totalProductSuggestions ?? 0
  }, [data?.totalProductSuggestions])

  // Memoize chart data preparation with calculated counts
  const chartData = React.useMemo(() => {
    if (!data?.brandRecommendations || totalSuggestions === 0) return []

    return data.brandRecommendations.map((rec) => ({
      brandId: rec.brand.id, // Use brand ID for keying
      brandName: rec.brand.name, // Store brand name for legend
      suggestions: calculateSuggestions(rec.percentage, totalSuggestions),
      fill: '' // Placeholder, will be determined by chartConfig
    }))
  }, [data?.brandRecommendations, totalSuggestions])

  // Memoize chart config generation using brand ID and name
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      // Key for the data value
      suggestions: {
        label: 'Suggestions',
        color: 'hsl(var(--chart-1))' // Add default/placeholder color to satisfy type
      }
    }
    if (data?.brandRecommendations) {
      data.brandRecommendations.forEach((rec, index) => {
        // Use brand ID as the key in the config
        config[rec.brand.id] = {
          label: rec.brand.name, // Use actual brand name
          color: `hsl(var(--chart-${(index % 5) + 1}))` // Cycle through chart colors
        }
      })
    }
    return config
  }, [data?.brandRecommendations])

  // Handle case where there's no data or total suggestions is zero
  if (!chartData || chartData.length === 0 || totalSuggestions === 0) {
    return (
      <div className='flex items-center justify-center min-h-[280px]'>
        <Empty
          title='Brand Recommendations' // Updated title
          description='No brand recommendation data found for this consultant.' // Updated description
        />
      </div>
    )
  }

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Brand Recommendation Distribution</CardTitle> {/* Updated title */}
        <CardDescription>
          Based on {totalSuggestions} total suggestions
          {data?.consultant?.name && ` by ${data.consultant.name}`}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[250px]'>
          <PieChart>
            <ChartTooltip>
              <ChartTooltipContent />
            </ChartTooltip>
            <Pie
              data={chartData}
              dataKey='suggestions' // Use the calculated count
              nameKey='brandId' // Key to match in chartConfig (brand.id)
              innerRadius={60}
              strokeWidth={5}
              className='cursor-pointer' // Add cursor pointer to pie segments
              onClick={(payload) => {
                // payload contains the data item for the clicked segment
                if (payload && payload.brandId) {
                  handleBrandClick(payload.brandId)
                }
              }}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                        <tspan x={viewBox.cx} y={viewBox.cy} className='text-3xl font-bold fill-foreground'>
                          {totalSuggestions.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className='fill-muted-foreground'>
                          Suggestions
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col px-6 pt-4 mt-auto text-sm gap-y-3'>
        <div className='flex flex-wrap items-center justify-center w-full gap-x-4 gap-y-2'>
          <TooltipProvider>
            {' '}
            {/* Wrap legend items in TooltipProvider */}
            {Object.entries(chartConfig)
              .filter(([key]) => key !== 'suggestions')
              .map(([brandId, configEntry]) => {
                const dataItem = chartData.find((item) => item.brandId === brandId)
                const count = dataItem ? dataItem.suggestions : 0

                return (
                  <Tooltip key={brandId}>
                    <TooltipTrigger asChild>
                      <div
                        className='flex items-center gap-1.5 cursor-pointer' // Add cursor pointer
                        onClick={() => handleBrandClick(brandId)} // Add onClick
                      >
                        <span
                          className='w-2.5 h-2.5 shrink-0 rounded-full'
                          style={{ backgroundColor: configEntry.color }}
                        />
                        <span>{configEntry.label}</span>
                        <span className='font-medium text-muted-foreground'>({count})</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view recommended products for {configEntry.label}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
          </TooltipProvider>
        </div>
        <div className='leading-none text-muted-foreground'>Showing distribution of suggested brands.</div>
      </CardFooter>

      {/* Render the Dialog - Use the consultantId prop */}
      {selectedBrandId &&
        consultantId && ( // Check for consultantId prop
          <ConsultantSuggestedProductsDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            consultantId={consultantId} // Pass consultantId prop
            brandId={selectedBrandId}
          />
        )}
    </Card>
  )
}
