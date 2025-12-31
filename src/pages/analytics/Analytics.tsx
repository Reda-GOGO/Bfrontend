import { TitleLayout } from "@/components/shared/title-layout";
import { ChartNoAxesCombined } from "lucide-react";

export default function Analytics() {
  return (
    <div className="w-full flex">
      <AnalyticsHeader />
    </div>
  );
}

function AnalyticsHeader() {
  return (
    <div className="flex w-full flex-col gap-4 py-1">
      <TitleLayout title="Analytics" icon={<ChartNoAxesCombined />} />
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Business Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Deep dive into your revenue growth, conversion rates, and customer
          behavior.
        </p>
      </div>
    </div>
  );
}
