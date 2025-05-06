import * as React from 'react'
import { TConsultantRecommendationData } from '@/network/apis/user/type'

import { Label, Pie, PieChart } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { ConsultantSuggestedProductsDialog } from '@/components/dialog/ConsultantSuggestedProductsDialog'
import Empty from '@/components/empty/Empty'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useStore } from '@/stores/store'

type Props = {
  data: TConsultantRecommendationData | null | undefined // Allow null/undefined
  consultantId?: string | null // Add consultantId prop
}

// Helper to calculate suggestion counts from percentage and total
const calculateSuggestions = (percentage: number, total: number): number => {
  if (!total || total === 0 || !percentage) return 0
  return Math.round((percentage / 100) * total)
}

// Define a more extensive color palette using CSS variables
const brandColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-blue))', // Adding more potential colors
  'hsl(var(--chart-green))',
  'hsl(var(--chart-yellow))',
  'hsl(var(--chart-violet))',
  'hsl(var(--chart-orange))'
]

export const Static = ({ data, consultantId }: Props) => {
  // State for Dialog
  const { user } = useStore()
  consultantId = consultantId || user?.id
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

  // Memoize chart config generation using brand ID and name and new colors
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      suggestions: {
        label: 'Suggestions',
        color: 'hsl(var(--muted))'
      }
    }
    if (data?.brandRecommendations) {
      data.brandRecommendations.forEach((rec, index) => {
        config[rec.brandId] = {
          label: rec.brandName,
          color: brandColors[index % brandColors.length]
        }
      })
    }
    return config
  }, [data?.brandRecommendations])
  console.log(selectedBrandId, 'selectedBrandId')
  console.log(consultantId, 'consultantId')

  // Memoize chart data preparation - ensure FILL is included
  const chartData = React.useMemo(() => {
    if (!data?.brandRecommendations || totalSuggestions === 0) return []

    return data.brandRecommendations.map((rec) => ({
      brandId: rec.brandId, // Key for config lookup
      brandName: rec.brandName, // Still useful maybe for label fallback or custom tooltips later
      suggestions: calculateSuggestions(rec.percentage, totalSuggestions),
      // Assign fill color directly based on config
      fill: chartConfig[rec.brandId]?.color ?? 'hsl(var(--muted))'
    }))
  }, [data?.brandRecommendations, totalSuggestions, chartConfig])

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
    <Card className='flex flex-col h-full'>
      <CardContent className='pb-0 mt-auto'>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[300px]'>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent indicator='dot' />}></ChartTooltip>
            <Pie
              data={chartData}
              dataKey='suggestions'
              nameKey='brandId' // *** IMPORTANT: Match key in chartConfig ***
              innerRadius={60}
              strokeWidth={5}
              className='cursor-pointer'
              onClick={(payload) => {
                // Payload is the data item; brandId is directly on it
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
            {Object.entries(chartConfig)
              .filter(([key]) => key !== 'suggestions')
              .map(([brandId, configEntry]) => {
                const dataItem = chartData.find((item) => item.brandId === brandId)
                const count = dataItem ? dataItem.suggestions : 0

                return (
                  <Tooltip key={brandId}>
                    <TooltipTrigger asChild>
                      <div
                        className='flex items-center gap-1.5 cursor-pointer'
                        onClick={() => handleBrandClick(brandId)}
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
