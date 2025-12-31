import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import CountUp from "react-countup";
import {
  CardStats,
  CardStatsHeader,
  CardStatsContent,
  CardStatsChart,
} from "@/components/shared/stats-card";
import {
  ArrowRightLeft,
  Calendar,
  ChevronRight,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { ArrowRight } from "lucide-react";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DashboardHeader() {
  const [dateRange, setDateRange] = React.useState<{ from?: Date; to?: Date }>(
    {},
  );

  const formattedDateRange = () => {
    if (!dateRange.from && !dateRange.to) return "Select period";
    const from = dateRange.from ? format(dateRange.from, "dd MMM") : "";
    const to = dateRange.to ? format(dateRange.to, "dd MMM") : "";
    return from && to ? `${from} - ${to}` : from || to;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <TitleLayout
        title="Dashboard"
        icon={<LayoutDashboard className="text-primary" />}
      />
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          A real-time snapshot of your business performance, sales, and active
          visitors.
        </p>
      </div>
      {/* Current day + Date range picker */}
      <div className="flex max-sm:flex-col sm:items-center gap-4">
        {/* Current day */}
        <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-lg px-4 py-2 font-semibold shadow-sm">
          <Calendar className="w-5 h-5" />
          <span>Today, {format(new Date(), "dd MMM")}</span>
        </div>

        {/* Date range picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" className="flex items-center gap-2  shadow-sm">
              <span className="font-medium">{formattedDateRange()}</span>
              <ArrowRight className="w-4 h-4 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={(range) => setDateRange(range)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function DashboardTopStats() {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-4 my-5 items-center">
        <TotalOrdersCard />
        <TotalRevenueCard />
        <OrdersCard />
        <TotalProductCard />
        <TopSellingProduct />
        <AverageSellRate />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default function Dashboard() {
  return (
    <div className="flex flex-col  gap-2">
      <DashboardHeader />
      <DashboardTopStats />
      <div className="flex gap-4 items-center p-4 sm:flex-row flex-col">
        <ProductSalesChart products={testProducts} />
        <TopProductsGrid />
        <CustomersStats />
      </div>
      <div className="flex max-sm:flex-col gap-2 p-4 w-full">
        <TopOrders />
        <ChartAreaInteractive />
      </div>
    </div>
  );
}

function OrdersCard() {
  const content = (
    <div className="flex text-red-500">
      <p>order revenue in last 7 days</p>
    </div>
  );
  return (
    <CardStats>
      <CardStatsHeader label="Orders" tooltipContent={content} />
      <CardStatsContent>
        <span className="text-sm font-semibold">
          MAD <CountUp end={928} />
        </span>
        <CardStatsChart>
          <ChartAreaDefault />
        </CardStatsChart>
      </CardStatsContent>
    </CardStats>
  );
}

import { Bar, BarChart } from "recharts";
import { TitleLayout } from "@/components/shared/title-layout";
import { Button } from "@/components/ui/button";
import ProductSalesChart, {
  testProducts,
} from "@/components/own/dashboard/ProductSalesStats";
import { CustomersStats } from "@/components/own/dashboard/CustomersStats";
import { ChartAreaInteractive } from "@/components/area-chart";
import TopProductsGrid from "@/components/own/dashboard/TopProductsGrid";
import TopOrders from "@/components/own/dashboard/TopOrders";

function TotalOrdersCard() {
  const content = <p className="text-xs p-1">Total Revenue for Today</p>;
  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--color-blue-500)",
    },
  } satisfies ChartConfig;
  return (
    <CardStats>
      <CardStatsHeader label="Orders" tooltipContent={content} />
      <CardStatsContent>
        <span className="text-md font-semibold">
          <CountUp end={12300} separator=" " duration={2} />
        </span>
        <CardStatsChart>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardStatsChart>
      </CardStatsContent>
    </CardStats>
  );
}
function TotalRevenueCard() {
  const content = <p className="text-xs p-1">Total Revenue for Today</p>;
  return (
    <CardStats>
      <CardStatsHeader label="Revenues" tooltipContent={content} />
      <CardStatsContent>
        <div className="flex gap-2">
          <span className="text-md font-semibold">MAD</span>
          <span className="text-md font-semibold">
            <CountUp
              end={128543000}
              separator=" "
              decimalPlaces={2}
              decimals={2}
              duration={2}
            />
          </span>
        </div>
      </CardStatsContent>
    </CardStats>
  );
}
function TotalProductCard() {
  const content = (
    <p className="text-xs p-1">Different product(s) was sold today</p>
  );
  return (
    <CardStats>
      <CardStatsHeader label="Product(s) Sold" tooltipContent={content} />
      <CardStatsContent>
        <span className="text-md font-semibold">
          <CountUp end={128} duration={2} />
        </span>
      </CardStatsContent>
    </CardStats>
  );
}

function TopSellingProduct() {
  const content = (
    <p className="text-xs p-1 ">
      Products graded by their business value. Tier A generates most of your
      revenue
    </p>
  );
  return (
    <CardStats>
      <CardStatsHeader label="Top Product" tooltipContent={content} />
      <CardStatsContent>
        <div className="flex gap-2 items-center">
          <span className="text-sm font-semibold">Ecrous 6m</span>
        </div>
      </CardStatsContent>
    </CardStats>
  );
}

function AverageSellRate() {
  const content = (
    <p className="text-xs p-1 ">Show Average Selling Grow rate </p>
  );
  return (
    <CardStats>
      <CardStatsHeader label="Average Sell Rate" tooltipContent={content} />
      <CardStatsContent>
        <span className="text-md font-semibold">
          <CountUp end={80.76} decimals={2} prefix="+" suffix="%" />
        </span>
      </CardStatsContent>
    </CardStats>
  );
}
export const description = "A simple area chart";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-blue-500)",
  },
} satisfies ChartConfig;

export function ChartAreaDefault() {
  return (
    <ChartContainer className="w-full aspect-auto" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <Area
          dataKey="desktop"
          type="natural"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
