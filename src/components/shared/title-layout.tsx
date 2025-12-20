import { ChevronRight, type LucideIcon } from "lucide-react";

export function TitleLayout({
  title,
  icon,
}: { title: string; icon: LucideIcon }) {
  return (
    <div className="flex gap-1 items-center">
      {icon}
      <ChevronRight />
      <span className="text-md capitalize font-semibold">{title}</span>
    </div>
  );
}
