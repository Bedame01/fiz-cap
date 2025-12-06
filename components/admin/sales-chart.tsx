"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface SalesData {
  name: string
  total: number
}

interface SalesChartProps {
  data: SalesData[]
}

export function SalesChart({ data }: SalesChartProps) {
  const chartData =
    data.length > 0
      ? data
      : [
          { name: "Jan", total: 0 },
          { name: "Feb", total: 0 },
          { name: "Mar", total: 0 },
          { name: "Apr", total: 0 },
          { name: "May", total: 0 },
          { name: "Jun", total: 0 },
          { name: "Jul", total: 0 },
          { name: "Aug", total: 0 },
          { name: "Sep", total: 0 },
          { name: "Oct", total: 0 },
          { name: "Nov", total: 0 },
          { name: "Dec", total: 0 },
        ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value) => [`$${value}`, "Revenue"]}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
