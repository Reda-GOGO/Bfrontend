import { cn } from "@/lib/utils";

function Rows({
  className,
  children,
}: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex w-full flex-row gap-2", className)}>
      {children}
    </div>
  );
}
function Cols({
  className,
  children,
}: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {children}
    </div>
  );
}

export { Rows, Cols };
