//
// type OrderInfoCardProps = {
//   loading: boolean;
//   stats: {
//     revenueToday?: number;
//     totalOrders?: number;
//     averageOrderValue?: number;
//     revenueLast7Days?: { day: string; revenue: number }[];
//   };
// };
//
// export default function OrderInfoCard({ loading, stats }: OrderInfoCardProps) {
import { useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { DateCard } from "@/components/date-card";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Package,
  TrendingUp,
  ImageOff,
  Star,
  Calendar,
  HandCoins,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OrderInfoCard() {
  const [loading] = useState(false);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="mb-8">
      <HighlightStatsLayout />
    </div>
  );
}

function HighlightStatsLayout() {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  return isDesktop ? <StatsDesktopLayout /> : <StatsMobileLayout />;
}

/* Common repeated content extracted */
function StatsCardsRow() {
  return (
    <div className="flex w-full  gap-4 my-2 items-center">
      <TotalOrdersCard />
      <TotalRevenueCard />
      <TotalProductCard />
      <TopSellingProduct />
      <AverageSellRate />
    </div>
  );
}

function StatsDesktopLayout() {
  return (
    <ScrollArea>
      <div className="flex  gap-4 my-2 items-center">
        <StatsPeriodControl />
        <StatsCardsRow />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

function StatsMobileLayout() {
  const periods = [
    { value: "DAILY", label: "Today" },
    { value: "WEEKLY", label: "Last 7 days" },
    { value: "MONTHLY", label: "Last 30 days" },
  ];

  return (
    <Tabs defaultValue="DAILY">
      <TabsList className="flex items-center justify-center w-full">
        {periods.map((p) => (
          <TabsTrigger key={p.value} value={p.value}>
            {p.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {periods.map((p) => (
        <TabsContent key={p.value} value={p.value}>
          <ScrollArea>
            <StatsCardsRow />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}

import CountUp from "react-countup";
import {
  CardStats,
  CardStatsChart,
  CardStatsContent,
  CardStatsHeader,
} from "@/components/shared/stats-card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

function StatsPeriodControl() {
  const [period, setPeriod] = useState("DAILY");

  const options = [
    {
      value: "DAILY",
      title: "Today",
      subtitle: "compared to yesterday",
    },
    {
      value: "WEEKLY",
      title: "last 7 days",
      subtitle: "compared to previous 7 days",
    },
    {
      value: "MONTHLY",
      title: "last 30 days",
      subtitle: "compared to previous 30 days",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Calendar />
          <span>Today</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 capitalize">
        <DropdownMenuRadioGroup value={period} onValueChange={setPeriod}>
          {options.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value}>
              <div className="flex flex-col">
                <p className="text-sm">{opt.title}</p>
                <span className="text-xs">{opt.subtitle}</span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LoadingSkeleton() {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-4 pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card className="min-w-75 w-full" key={i + 1}>
            <CardHeader>
              <div className="h-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
