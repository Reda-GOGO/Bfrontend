import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CalendarPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

export default function OrderInfoCard() {
  const [orderStats, setOrderStats] = useState([]);
  const chartConfig = {
    desktop: {
      label: "total",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/orders/daily-stats`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        setOrderStats(data);
      } catch (error) {
        console.error(`Error fetching orders stats : ${error} `);
      }
    };
    fetcher();
  }, []);
  console.log("statistic : ", orderStats);
  return (
    <div className="flex w-full  ">
      <div className="flex w-full max-sm:flex-col gap-6">
        <div className=" flex flex-col border rounded-lg p-4 justify-center ">
          <CalendarPlus />
          <span>today</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex p-4 w-full h-[250px] ">
          {/* <Calendar /> */}
          {orderStats && (
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={orderStats}
                margin={{
                  left: 24,
                  right: 24,
                  top: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.split("-")[1]}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="totalIncome"
                  type="natural"
                  name="total"
                  fill="var(--color-desktop)"
                  fillOpacity={0.4}
                  stroke="var(--color-desktop)"
                />
              </AreaChart>
            </ChartContainer>
          )}
        </div>
      </div>
    </div>
  );
}
