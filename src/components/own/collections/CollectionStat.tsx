import {
  CardStats,
  CardStatsContent,
  CardStatsHeader,
} from "@/components/shared/stats-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Collection } from "@/types";
import {
  CalendarDays,
  CircleCheck,
  CircleX,
  HelpCircle,
  Package2,
} from "lucide-react";
import CountUp from "react-countup";

export function CollectionStat({ collection }: { collection: Collection }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">
        Collection Highlights
      </span>
      <ScrollArea>
        <div className="flex w-full gap-2">
          <TotalProductCard collection={collection} />
          <CreatedAtCard collection={collection} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function TotalProductCard({ collection }: { collection: Collection }) {
  return (
    <CardStats>
      <CardStatsHeader label="Total Products" />
      <CardStatsContent>
        <span className="text-md font-semibold">
          <CountUp end={collection.products?.length} duration={2} />
        </span>
        <Package2 />
      </CardStatsContent>
    </CardStats>
  );
}

function CreatedAtCard({ collection }: { collection: Collection }) {
  const dateLabel = collection.createdAt
    ? new Date(collection.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "N/A";

  return (
    <CardStats>
      <CardStatsHeader label="Created Date" />
      <CardStatsContent>
        <span className="text-md font-bold tracking-tight py-1">
          {dateLabel}
        </span>
        <CalendarDays />
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
