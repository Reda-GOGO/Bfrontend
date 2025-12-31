import {
  CardStats,
  CardStatsContent,
  CardStatsHeader,
} from "@/components/shared/stats-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CircleCheck, CircleX, HelpCircle, Package2 } from "lucide-react";
import CountUp from "react-countup";

export function InventoryStats() {
  return (
    <ScrollArea>
      <div className="flex w-full gap-2">
        <TotalProductCard />
        <OutOfStockProductCard />
        <AvailableProductCard />
        <UntrackedProductCard />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

function TotalProductCard() {
  return (
    <CardStats>
      <CardStatsHeader label="Total Products" />
      <CardStatsContent>
        <span className="text-md font-semibold">
          <CountUp end={28} duration={2} />
        </span>
        <Package2 />
      </CardStatsContent>
    </CardStats>
  );
}

function OutOfStockProductCard() {
  return (
    <CardStats>
      <CardStatsHeader label="Out of Stock Product(s) " />
      <CardStatsContent>
        <span className="text-md font-semibold">
          <CountUp end={18} duration={2} />
        </span>
        <CircleX />
      </CardStatsContent>
    </CardStats>
  );
}

function AvailableProductCard() {
  return (
    <CardStats>
      <CardStatsHeader label="Available Product(s) " />
      <CardStatsContent>
        <span className="text-md font-semibold">
          <CountUp end={10} duration={2} />
        </span>
        <CircleCheck />
      </CardStatsContent>
    </CardStats>
  );
}

function UntrackedProductCard() {
  return (
    <CardStats>
      <CardStatsHeader label="Untracked Product(s) " />
      <CardStatsContent>
        <span className="text-md font-semibold">
          <CountUp end={10} duration={2} />
        </span>
        <HelpCircle />
      </CardStatsContent>
    </CardStats>
  );
}
