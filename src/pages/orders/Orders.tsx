import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import {
  ArrowDownUp,
  BadgeCheck,
  ChevronDown,
  CircleSlash,
  ClipboardList,
  DollarSign,
  EllipsisVertical,
  FileSignature,
  FileText,
  Hourglass,
  Package,
  Search,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";
import OrderInfoCard from "@/components/own/orders/OrderInfoCard";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { TitleLayout } from "@/components/shared/title-layout";
import OrdersFilters from "@/components/own/orders/OrdersFilters";
import { OrdersHeader } from "@/components/own/orders/OrdersHeader";
import OrdersPagination from "@/components/own/orders/OrdersPagination";
import {
  useOrders,
  useOrdersSelection,
} from "@/application/orders/hooks/useOrders";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/own/orders/OrdersTables";
import type { Order } from "@/types";
import OrdersCards from "@/components/own/orders/OrdersCards";

// Order type definitions with icon + label
export const ORDER_TYPES = [
  {
    label: "Invoice",
    value: "invoice",
    icon: <FileText className="h-3.5 w-3.5" />,
  },
  {
    label: "Purchase Order",
    value: "purchase",
    icon: <ClipboardList className="h-3.5 w-3.5" />,
  },
  {
    label: "Delivery Order",
    value: "delivery",
    icon: <Truck className="h-3.5 w-3.5" />,
  },
  {
    label: "Estimate",
    value: "estimate",
    icon: <FileSignature className="h-3.5 w-3.5" />,
  },
];

// Status definitions with icon + label + color class
export const STATUSES = [
  {
    label: "Pending",
    value: "pending",
    icon: <Hourglass className="h-3.5 w-3.5" />,
    variant: "secondary",
  },
  {
    label: "Partially Paid",
    value: "partially_paid",
    icon: <DollarSign className="h-3.5 w-3.5" />,
    variant: "outline",
  },
  {
    label: "Paid",
    value: "paid",
    icon: <BadgeCheck className="h-3.5 w-3.5" />,
    variant: "default",
  },
  {
    label: "Canceled",
    value: "canceled",
    icon: <CircleSlash className="h-3.5 w-3.5" />,
    variant: "destructive",
  },
];

const TABS_COLUMNS = ["all", "active", "archived"];

export default function OrderPage() {
  const {
    orders,
    search,
    setSearch,
    selected,
    setSelected,
    paginationControl,
    pagination,
  } = useOrders();

  const {
    selectedSize,
    handleSelection,
    isItemSelected,
    handleAllSelection,
    isAllItemsSelected,
  } = useOrdersSelection({ selected, setSelected });

  return (
    <div className="flex flex-col w-full h-full py-1 ">
      <OrdersHeader />

      <OrdersContent
        search={search}
        setSearch={setSearch}
        orders={orders}
        handleSelection={handleSelection}
        isItemSelected={isItemSelected}
        handleAllSelection={handleAllSelection}
        isAllItemsSelected={isAllItemsSelected}
      />

      <OrdersPagination
        paginationControl={paginationControl}
        pagination={pagination}
        selectedSize={selectedSize}
      />
    </div>
  );
}
function OrdersContent({
  search,
  setSearch,
  orders,
  handleSelection,
  isItemSelected,
  handleAllSelection,
  isAllItemsSelected,
}: {
  search: string;
  setSearch: (search: string) => void;
  orders: Order[];
  handleSelection: (id: number) => void;
  isItemSelected: (id: number) => boolean;
  handleAllSelection: (items: Order[]) => void;
  isAllItemsSelected: (items: Order[]) => boolean;
}) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <OrdersFilters search={search} setSearch={setSearch} />

      {TABS_COLUMNS.map((tab) => (
        <TabsContent key={tab} value={tab}>
          <OrderGrid
            orders={orders}
            handleSelection={handleSelection}
            isItemSelected={isItemSelected}
            handleAllSelection={handleAllSelection}
            isAllItemsSelected={isAllItemsSelected}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function OrderGrid({
  orders,
  handleSelection,
  isItemSelected,
  handleAllSelection,
  isAllItemsSelected,
}: {
  orders: Order[];
  handleSelection: (id: number) => void;
  isItemSelected: (id: number) => boolean;
  handleAllSelection: (items: Order[]) => void;
  isAllItemsSelected: (items: Order[]) => boolean;
}) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  return (
    <>
      {isMobile ? (
        <OrdersCards
          orders={orders}
          handleSelection={handleSelection}
          isItemSelected={isItemSelected}
          handleAllSelection={handleAllSelection}
          isAllItemsSelected={isAllItemsSelected}
        />
      ) : (
        <OrdersTable
          orders={orders}
          handleSelection={handleSelection}
          isItemSelected={isItemSelected}
          handleAllSelection={handleAllSelection}
          isAllItemsSelected={isAllItemsSelected}
        />
      )}
    </>
  );
}
