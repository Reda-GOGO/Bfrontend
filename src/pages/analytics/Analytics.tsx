import { TitleLayout } from "@/components/shared/title-layout";
import { ChartNoAxesCombined, ChartNoAxesCombinedIcon } from "lucide-react";

export default function Analytics() {
  return (
    <div className="w-full flex h-full">
      <AnalyticsHeader />
    </div>
  );
}

function AnalyticsHeader() {
  return (
    <div className="flex w-full h-full flex-col gap-4 py-1">
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
      <EmptyAnalytics />
    </div>
  );
}

import { ArrowUpRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyAnalytics() {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ChartNoAxesCombinedIcon />
          </EmptyMedia>
          <EmptyTitle>No Analytics Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any analytics yet. Get started by commit
            some action .
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button>Aggregate Analytics</Button>
            <Button variant="outline">Import Analytics</Button>
          </div>
        </EmptyContent>
        <Button variant="link" className="text-muted-foreground" size="sm">
          Learn More <ArrowUpRightIcon />
        </Button>
      </Empty>
    </div>
  );
}
