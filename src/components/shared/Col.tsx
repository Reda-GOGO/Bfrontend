import { cn } from "@/lib/utils";

export default function Col({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2 ", className)}>
      {children}
    </div>
  );
}
