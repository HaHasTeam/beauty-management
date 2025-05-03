'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '@/utils/number'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

type DataPoint = {
  date: string
  [key: string]: number | string
}

type InteractiveAreaChartProps = {
  data: DataPoint[]
  title: React.ReactNode
  description: React.ReactNode
  config: ChartConfig
  className?: string
  bottomLabel?: React.ReactNode
  mode?: 'full' | 'mini'
}

export function InteractiveAreaChart({
  data,
  title,
  description,
  config,
  className,
  bottomLabel,
  mode = 'full'
}: InteractiveAreaChartProps) {
  const [activeDataKey, setActiveDataKey] = React.useState<string | null>(null)
  const configKeys = React.useMemo(() => Object.keys(config), [config])

  // Debug - log props
  React.useEffect(() => {
    console.log('Chart config:', config)
    console.log('Data sample:', data.slice(0, 2))
  }, [config, data])

  // Custom legend that shows colored boxes
  const renderColorfulLegendText = (value: string, entry: any) => {
    const { color } = entry
    const dataKey = entry.dataKey
    const isActive = activeDataKey === dataKey || activeDataKey === null

    const handleClick = () => {
      setActiveDataKey((prevState) => (prevState === dataKey ? null : dataKey))
    }

    return (
      <span
        className={`cursor-pointer text-sm font-medium mx-2 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-40'}`}
        onClick={handleClick}
        style={{ color: isActive ? color : undefined }}
      >
        {config[dataKey]?.label || value}
      </span>
    )
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label)
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })

      return (
        <div className='rounded-lg border bg-background p-3 shadow-md'>
          <p className='font-medium mb-2 text-foreground'>{formattedDate}</p>
          {payload.map((entry: any, index: number) => {
            const isActive = activeDataKey === entry.dataKey || activeDataKey === null
            // Only show tooltip data for active or all series
            if (!isActive && activeDataKey !== null) return null

            const dataKey = entry.dataKey
            // Check if config exists for safety
            if (!config[dataKey]) return null

            const colorVar = `--${config[dataKey].color}`
            const formattedValue = formatCurrency(entry.value, 'vi-VN')

            return (
              <div key={`tooltip-item-${index}`} className='flex items-center justify-between gap-4 py-1'>
                <div className='flex items-center gap-2'>
                  <div className='h-3 w-3 rounded-sm' style={{ backgroundColor: `hsl(var(${colorVar}))` }} />
                  <span className='text-sm font-medium text-muted-foreground'>{config[dataKey].label}</span>
                </div>
                <span className='font-bold text-foreground'>{formattedValue}</span>
              </div>
            )
          })}
        </div>
      )
    }
    return null
  }

  // Format Y-axis ticks - all values should be currency
  const formatYAxisTick = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`
    }

    return value.toLocaleString()
  }

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
          <div className='grid flex-1 gap-1 text-center max-sm:w-full'>
            {title && (typeof title === 'string' ? <CardTitle>{title}</CardTitle> : title)}
            {description &&
              (typeof description === 'string' ? <CardDescription>{description}</CardDescription> : description)}
          </div>
        </CardHeader>
      )}
      <CardContent className='px-1 pt-4 sm:px-2 sm:pt-6'>
        <div className='aspect-auto h-[300px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
              {/* Dynamic Gradient Definitions */}
              <defs>
                {configKeys.map((key) => {
                  const colorName = config[key]?.color || 'chart-1' // Fallback color
                  return (
                    <linearGradient key={`fill-${key}`} id={`fill-${key}`} x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor={`hsl(var(--${colorName}))`} stopOpacity={0.8} />
                      <stop offset='95%' stopColor={`hsl(var(--${colorName}))`} stopOpacity={0.1} />
                    </linearGradient>
                  )
                })}
              </defs>
              <CartesianGrid vertical={false} stroke='hsl(var(--border))' strokeDasharray='3 3' strokeOpacity={0.4} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={50}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={70}
                tickMargin={10}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={formatYAxisTick}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: 'hsl(var(--muted-foreground))',
                  strokeWidth: 1,
                  strokeDasharray: '5 5',
                  strokeOpacity: 0.5
                }}
              />
              {/* Dynamic Area Rendering */}
              {configKeys.map((key) => {
                const colorName = config[key]?.color || 'chart-1' // Fallback color
                return (
                  <Area
                    key={key}
                    dataKey={key}
                    type='monotone'
                    fill={`url(#fill-${key})`}
                    stroke={`hsl(var(--${colorName}))`}
                    strokeWidth={activeDataKey === key || activeDataKey === null ? 3 : 1.5}
                    dot={false}
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      stroke: 'hsl(var(--background))',
                      fill: `hsl(var(--${colorName}))`
                    }}
                    hide={activeDataKey !== null && activeDataKey !== key} // Hide inactive series
                  />
                )
              })}

              {mode === 'full' && (
                <Legend
                  verticalAlign='bottom'
                  height={36}
                  iconType='circle'
                  iconSize={8}
                  wrapperStyle={{
                    paddingTop: '10px',
                    marginLeft: '-10px'
                  }}
                  formatter={renderColorfulLegendText}
                  // Update onClick to use the passed entry directly
                  onClick={(entry) => {
                    const dataKey = entry.dataKey as string
                    setActiveDataKey((prevState) => (prevState === dataKey ? null : dataKey))
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {bottomLabel && <div className='mt-4'>{bottomLabel}</div>}
      </CardContent>
    </Card>
  )
}
