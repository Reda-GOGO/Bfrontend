import type { OrderItemsHook } from "@/application/orders/hooks/useOrderItems";
import type { PrevOrderItemsHook } from "@/application/orders/hooks/usePrevOrderItems";
import Col from "@/components/shared/Col";
import Row from "@/components/shared/Row";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  GitCompare,
  Loader2,
  Package,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ModalPhase } from "./LoadItemsModal";
import type { OrderItem } from "@/types";

type conflictItems = {
  item: OrderItem
  orderId: number
}
/* ─────────────────────────────────────────────
   Root
───────────────────────────────────────────── */
export function CheckMergingStatus({
  setPhase,
  orderItemHook,
  prevOrderItemHook,
  setOpen,
}: {
  setPhase: React.Dispatch<React.SetStateAction<ModalPhase>>;
  orderItemHook: OrderItemsHook;
  prevOrderItemHook: PrevOrderItemsHook;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const orderItems = Array.from(prevOrderItemHook.selected.values()).map((order) => order.items).flat()
  const currentItems = orderItemHook.orderItems.map((item) => ({ ...item, orderId: -1 }))
  const allItems = [...orderItems, ...currentItems]
  const analyzeConflicts = () => {
    const grouped = allItems.reduce((acc, item) => {
      if (!acc[item.productId]) {
        acc[item.productId] = [];
      }

      acc[item.productId].push(item);
      return acc;
    }, {});


    return grouped;

  }
  const grouped = analyzeConflicts()
  const allProducts = Object.values(grouped).flat()
  const conflictCount = Object.values(grouped).
    reduce((acc, item) => item.length > 1 ? acc + 1 : acc, 0);

  console.log("conflicts : ", conflictCount);
  // console.log("merge results : ", grouped);


  function merge() {
    prevOrderItemHook.setMergeItems(grouped);
    // allItems.map((item) => {
    //   const product = { ...item.product, units: [item.productUnit] };
    //   orderItemHook.addItem(product)
    // })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full h-full">
      <ScrollArea className="flex-1 min-h-0 w-full ">

        <Col className="flex-1 min-h-0 w-full ">
          <MergeBanner />
          <div className="px-6 pb-6">
            <CheckList
              itemCount={allProducts.length}
              conflictCount={conflictCount} />
          </div>
        </Col>
        <ScrollBar />
      </ScrollArea>

      <DialogFooter className="px-6 py-4 border-t bg-muted/30 flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            setPhase("loading")
            // setOpen(false);
            orderItemHook.setSearch("");
          }}
        >
          Back
        </Button>
        <Button
          onClick={
            () => {
              merge();
              setPhase("merging")
            }
          }
          className="min-w-24 gap-1.5">
          Next
          <Check className="h-3.5 w-3.5" />
        </Button>
      </DialogFooter>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Steps definition
───────────────────────────────────────────── */
const CHECK_STEPS = [
  {
    label: "Loading previous order items",
    icon: Package,
    getSubtitle: (number: number) => `${number} items found`,
  },
  {
    label: "Comparing with current order",
    icon: GitCompare,
    getSubtitle: () => "Checking quantities and duplicates",
  },
  {
    label: "Detecting conflicts",
    icon: AlertTriangle,
    getSubtitle: (number: number) => `${number} conflicts detected`,
  },
  {
    label: "Ready to resolve",
    icon: CheckCircle2,
    getSubtitle: () => null,
  },
];

type StageType = "idle" | "checking" | "done";
type StatusType = "pending" | "running" | "success" | "failure";

/* ─────────────────────────────────────────────
   CheckList
───────────────────────────────────────────── */
function CheckList({
  itemCount,
  conflictCount,
}: {
  itemCount: number,
  conflictCount: number | unknown
}) {
  const steps = CHECK_STEPS;
  const [stage, setStage] = useState<StageType>("idle");
  const [statuses, setStatuses] = useState<StatusType[]>(
    steps.map(() => "pending")
  );

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const updateStatues = (index: number, status: StatusType) => {
    setStatuses((prev) => {
      const next = [...prev];
      next[index] = status;
      return next;
    });
  };

  const animate = async () => {
    for (let i = 0; i < steps.length; i++) {
      updateStatues(i, "running");
      await delay(300);

      updateStatues(i, "success");

    }
  };

  useEffect(() => {
    animate();
  }, []);

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border/40 bg-muted/20">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Validation steps
        </p>
      </div>
      <div className=" ">
        {steps.map((step, idx) => {
          let subTitle;
          switch (idx) {
            case 0:
              subTitle = step.getSubtitle(itemCount);
              break;
            case 2:
              subTitle = step.getSubtitle(conflictCount ? conflictCount : 0);
              break;
            default:
              subTitle = step.getSubtitle();
          }
          return (
            <div key={idx}>
              <StepRow
                key={idx}
                subTitle={subTitle}
                step={step}
                status={statuses[idx]}
              />
              {

                idx < steps.length - 1 && (
                  <div className={cn("ml-7 w-px h-5 bg-muted-foreground transition-all duration-200 ",
                    statuses[idx] === "pending" &&
                    "bg-muted border border-border text-muted-foreground",
                    statuses[idx] === "running" &&
                    "bg-amber-100 border border-amber-200 text-amber-600 dark:bg-amber-900/60 dark:border-amber-700 dark:text-amber-300",
                    statuses[idx] === "success" &&
                    "bg-green-100 border border-green-200 text-green-600 dark:bg-green-900/60 dark:border-green-700 dark:text-green-400",
                    statuses[idx] === "failure" &&
                    "bg-red-100 border border-red-200 text-red-600 dark:bg-red-900/60 dark:border-red-700 dark:text-red-400"
                  )} />
                )
              }
            </div>

          )
        })
        }

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   StepRow
───────────────────────────────────────────── */
function StepRow({
  step,
  status,
  subTitle,
}: {
  step: (typeof CHECK_STEPS)[0];
  status: StatusType;
  subTitle: string;
}) {
  const Icon = step.icon;
  const subtitle = subTitle;

  return (
    <Row
      className={cn(
        "items-center gap-3.5 px-4 py-3.5 transition-colors duration-200",
        // status === "running" && "bg-blue-50/60 dark:bg-blue-950/20",
        // status === "success" && "bg-green-50/40 dark:bg-green-950/10",
        // status === "failure" && "bg-red-50/60 dark:bg-red-950/20"
      )}
    >
      {/* Status indicator */}
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
          status === "pending" &&
          "bg-muted border border-border text-muted-foreground",
          status === "running" &&
          "bg-amber-100 border border-amber-200 text-amber-600 dark:bg-amber-900/60 dark:border-amber-700 dark:text-amber-300",
          status === "success" &&
          "bg-green-100 border border-green-200 text-green-600 dark:bg-green-900/60 dark:border-green-700 dark:text-green-400",
          status === "failure" &&
          "bg-red-100 border border-red-200 text-red-600 dark:bg-red-900/60 dark:border-red-700 dark:text-red-400"
        )}
      >
        {status === "running" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : status === "success" ? (
          <Check className="h-3.5 w-3.5" />
        ) : status === "failure" ? (
          <XCircle className="h-3.5 w-3.5" />
        ) : (
          <Icon className="h-3.5 w-3.5" />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className={cn(
            "text-sm font-medium leading-none transition-colors duration-200",
            status === "pending" ? "text-muted-foreground" : "text-foreground",
            status === "failure" && "text-red-700 dark:text-red-400"
          )}
        >
          {step.label}
        </span>
        {status !== "pending" && subtitle && (
          <span
            className={cn(
              "text-xs leading-none mt-1 transition-all duration-300",
              // status === "running" && "text-blue-500 dark:text-blue-400",
              // status === "success" && "text-muted-foreground",
              // status === "failure" && "text-red-500 dark:text-red-400"
            )}
          >
            {subtitle}
          </span>
        )}
        {status === "failure" && (
          <span className="text-xs leading-none mt-1 text-red-500 dark:text-red-400">
            Something went wrong — please try again
          </span>
        )}
      </div>

      {/* Right-side indicators */}
      {/* {status === "running" && ( */}
      {/*   <span className="ml-auto flex h-2 w-2 shrink-0"> */}
      {/*     <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75" /> */}
      {/*     <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" /> */}
      {/*   </span> */}
      {/* )} */}
      {/* {status === "failure" && ( */}
      {/*   <span className="ml-auto flex h-2 w-2 shrink-0"> */}
      {/*     <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" /> */}
      {/*   </span> */}
      {/* )} */}
    </Row>
  );
}

/* ─────────────────────────────────────────────
   MergeBanner
───────────────────────────────────────────── */

function MergeBanner() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 pt-8 pb-6 px-6">
      {animate ? <SuccessUI /> : <WaitingUI />}
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-foreground">
          {animate ? "Analysis complete" : "Analyzing orders"}
        </p>
        <p className="text-xs text-muted-foreground">
          {animate
            ? "Review the results below before continuing"
            : "Checking merge status, please wait…"}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WaitingUI
───────────────────────────────────────────── */

function WaitingUI() {
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <span className="absolute inset-0 rounded-full bg-amber-400/15 animate-ping" />
      <span className="absolute inset-3 rounded-full border border-amber-300/40" />
      <span className="relative z-10 w-14 h-14 rounded-full border-2 border-amber-400/60 bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
        <GitCompare className="h-6 w-6 text-amber-500" />
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SuccessUI
───────────────────────────────────────────── */

function SuccessUI() {
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSuccess(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Spinner phase */}
      <span
        className={cn(
          "absolute inset-0 rounded-full border-2 border-green-400/40 transition-opacity duration-500",
          isSuccess ? "opacity-0" : "opacity-100"
        )}
      />
      <Loader2
        className={cn(
          "absolute h-14 w-14 text-green-400 animate-spin transition-opacity duration-500",
          isSuccess ? "opacity-0" : "opacity-100"
        )}
      />
      {/* Success phase */}
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-green-50 dark:bg-green-900/30 border-2 border-green-400/50 transition-all duration-500",
          isSuccess ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )}
      />
      <CheckCircle2
        className={cn(
          "absolute h-10 w-10 text-green-500 transition-all duration-500",
          isSuccess ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   FailureUI
───────────────────────────────────────────── */


function FailureUI() {
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSettled(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Outer pulse — red ring that fades */}
      <span
        className={cn(
          "absolute inset-0 rounded-full border-2 border-red-300/60 dark:border-red-700/50 transition-all duration-700",
          isSettled ? "opacity-100 scale-100" : "opacity-0 scale-75"
        )}
      />
      {/* Subtle ambient glow ring */}
      <span
        className={cn(
          "absolute inset-2 rounded-full bg-red-100/60 dark:bg-red-900/20 transition-all duration-700",
          isSettled ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )}
      />
      {/* Icon container */}
      <span
        className={cn(
          "relative z-10 w-14 h-14 rounded-full border-2 border-red-300/80 bg-red-50 dark:bg-red-900/40 dark:border-red-700/60 flex items-center justify-center transition-all duration-500",
          isSettled ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )}
      >
        <XCircle className="h-7 w-7 text-red-500 dark:text-red-400" />
      </span>
    </div>
  );
}
