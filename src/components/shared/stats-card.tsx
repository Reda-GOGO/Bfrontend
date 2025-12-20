import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

export function CardStats({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        " w-full flex flex-col min-w-70 bg-input/30  h-20 border px-3 py-4 gap-2 hover:bg-muted/70 rounded-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardStatsHeader({
  label,
  tooltipContent,
}: { label: string; tooltipContent: React.ReactNode }) {
  return (
    <div className="flex w-full cursor-pointer">
      <span
        className="text-sm font-semibold max-sm:text-xs underline decoration-dashed 
        decoration-2 underline-offset-4 decoration-black/20 dark:decoration-white/20"
      >
        <CardStatsHoverCard title={label} content={tooltipContent} />
      </span>
    </div>
  );
}

export function CardStatsHoverCard({
  title,
  content,
}: { title: string; content: React.ReactNode }) {
  return (
    <HoverCard>
      <HoverCardTrigger>{title}</HoverCardTrigger>
      <HoverCardContent className="p-1 flex pt-1">{content}</HoverCardContent>
    </HoverCard>
  );
}

export function CardStatsContent({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex justify-between items-center ", className)}>
      {children}
    </div>
  );
}

export function CardStatsChart({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex w-20 h-6", className)}> {children}</div>;
}
