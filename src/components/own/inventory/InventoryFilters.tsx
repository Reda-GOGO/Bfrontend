import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";

const FILTERS = [
  { label: "All", count: 38 },
  { label: "Out of stock", count: 18 },
  { label: "Available", count: 10 },
  { label: "Untracked", count: 10 },
];

export function InventoryFilters() {
  const [active, setActive] = useState("All");

  return (
    <ScrollArea className="w-full">
      <div className="flex w-max min-w-full px-1">
        <div className="inline-flex items-center gap-1 rounded-xl border bg-muted/40 p-1">
          {FILTERS.map((filter) => {
            const isActive = active === filter.label;

            return (
              <button
                key={filter.label}
                onClick={() => setActive(filter.label)}
                className={cn(
                  "relative inline-flex items-center gap-2 whitespace-nowrap rounded-lg",
                  "px-3 py-2 text-sm font-medium transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "active:scale-[0.98]",
                  isActive
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <span>{filter.label}</span>

                <span
                  className={cn(
                    "inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs",
                    isActive
                      ? "bg-muted text-foreground"
                      : "bg-muted/60 text-muted-foreground",
                  )}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
