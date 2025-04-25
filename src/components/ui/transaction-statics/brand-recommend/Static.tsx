'use client'

import * as React from 'react'
import { TConsultantRecommendationData } from '@/network/apis/user/type'

import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type Props = {
  data: TConsultantRecommendationData | null | undefined // Allow null/undefined
}

export const Static = ({ data }: Props) => {

  // Memoize chart data preparation
  const chartData = React.useMemo(() => {
    if (!data?.brandRecommendations) return [];
    // Map brand recommendations to the format needed by the chart
    return data.brandRecommendations.map((rec) => ({
      brand: rec.brandId, // Use brandId as the key/identifier
      percentage: rec.percentage,
      // We'll assign fill colors dynamically via chartConfig
    }));
  }, [data?.brandRecommendations]);

  // Memoize chart config generation
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      percentage: { 
        label: "Percentage",
        color: "hsl(var(--chart-1))" // Added default color
      },
    };
    if (data?.brandRecommendations) {
      // Assign colors dynamically from --chart-1 to --chart-5 cycle
      data.brandRecommendations.forEach((rec, index) => {
        config[rec.brandId] = {
          // Using truncated ID as label - ideally fetch brand name
          label: `Brand ${rec.brandId.substring(0, 6)}...`,
          color: `hsl(var(--chart-${(index % 5) + 1}))`, 
        };
      });
    }
    return config;
  }, [data?.brandRecommendations]);

  // Memoize total suggestions for the center label
  const totalSuggestions = React.useMemo(() => {
    return data?.totalProductSuggestions ?? 0;
  }, [data?.totalProductSuggestions]);

  // Handle case where there's no recommendation data
  if (!chartData || chartData.length === 0) {
    return (
       <Card className="flex flex-col items-center justify-center min-h-[300px]">
         <CardHeader>
            <CardTitle>Brand Recommendation Percentage</CardTitle>
         </CardHeader>
         <CardContent>
            <p className='text-sm text-muted-foreground'>No recommendation data available for this consultant.</p>
         </CardContent>
      </Card>
    )
  }

  return (
    // Using the structure from the example Component
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        {/* Update Title */}
        <CardTitle>Brand Recommendation Percentage</CardTitle>
        {/* Update Description - maybe show consultant name? */}
        <CardDescription>
           Based on consultant suggestions 
           {data?.consultant?.name && `for ${data.consultant.name}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip>
               <ChartTooltipContent />
            </ChartTooltip>
            <Pie
              data={chartData}
              dataKey="percentage" // Value to plot
              nameKey="brand"      // Key to match in chartConfig for label/color
              innerRadius={60}
              strokeWidth={5}
              // Assign fill based on config - Recharts does this implicitly based on nameKey matching config keys
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {/* Display total suggestions in center */}
                          {totalSuggestions.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {/* Updated label for center */}
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
      {/* Updated footer */}
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing percentage distribution of recommended brands.
        </div>
      </CardFooter>
    </Card>
  )
}