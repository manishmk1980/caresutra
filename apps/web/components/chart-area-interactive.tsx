"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"

export const description = "CareSutra customer record trend"

const chartData = [
  { date: "2026-05-21", insurance: 1, loans: 0, healthcare: 0 },
  { date: "2026-05-22", insurance: 1, loans: 1, healthcare: 0 },
  { date: "2026-05-23", insurance: 2, loans: 1, healthcare: 0 },
  { date: "2026-05-24", insurance: 2, loans: 1, healthcare: 1 },
  { date: "2026-05-25", insurance: 3, loans: 2, healthcare: 1 },
  { date: "2026-05-26", insurance: 3, loans: 2, healthcare: 2 },
  { date: "2026-05-27", insurance: 4, loans: 3, healthcare: 2 },
]

const chartConfig = {
  records: {
    label: "Records",
  },
  insurance: {
    label: "Insurance",
    color: "var(--primary)",
  },
  loans: {
    label: "Loans",
    color: "var(--primary)",
  },
  healthcare: {
    label: "Health Services",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Customer Record Trend</CardTitle>
        <CardDescription>
          New CareSutra records by service category for the latest sample period.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillInsurance" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-insurance)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-insurance)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillLoans" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-loans)"
                  stopOpacity={0.65}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-loans)"
                  stopOpacity={0.08}
                />
              </linearGradient>
              <linearGradient id="fillHealthcare" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-healthcare)"
                  stopOpacity={0.45}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-healthcare)"
                  stopOpacity={0.06}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="healthcare"
              type="natural"
              fill="url(#fillHealthcare)"
              stroke="var(--color-healthcare)"
              stackId="a"
            />
            <Area
              dataKey="loans"
              type="natural"
              fill="url(#fillLoans)"
              stroke="var(--color-loans)"
              stackId="a"
            />
            <Area
              dataKey="insurance"
              type="natural"
              fill="url(#fillInsurance)"
              stroke="var(--color-insurance)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
