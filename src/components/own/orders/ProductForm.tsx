import { useOrderContext } from "@/contexts/orderContext.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PackageMinus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import OrderLine from "./OrderLine.tsx";
import SearchDialog from "./Search.tsx";
import { useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

export default function ProductForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-sm">Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full gap-2 items-center justify-center max-xl:flex-col ">
          <div
            className="flex relative w-3/5 max-xl:w-full"
            onClick={handleDialogOpen}
          >
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="search for product"
              className="pl-8"
            ></Input>
          </div>
          <div className="grid grid-cols-2 max-xl:grid-cols-1 w-2/5 max-xl:w-full gap-2">
            <ProductDialog />
            <Button size={"sm"}>Previous Orders</Button>
          </div>
        </div>
        <div className="flex w-full flex-col py-4 gap-2 h-[450px]">
          <div className="flex w-full">
            <span className="text-sm uppercase text-muted-foreground">
              (0) Selected Items
            </span>
          </div>
          <EmptyProducts />
        </div>
      </CardContent>
    </Card>
  );
}

function ProductDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"outline"}>
          Browse
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-4xl w-full  px-0  flex flex-col overflow-auto">
        <DialogHeader className="p-4 ">
          <DialogTitle>Products</DialogTitle>
          <DialogDescription>
            Select products to add to the order.
          </DialogDescription>
        </DialogHeader>
        <SearchDialog />
      </DialogContent>
    </Dialog>
  );
}

// function OrderItems() {
//   const { selectedProducts } = useOrderContext();
//   return (
//     <ScrollArea>
//       <div className="flex flex-col gap-2 h-100 pr-4">
//         {selectedProducts.map((product, index) => {
//           return <OrderLine product={product} key={index} />;
//         })}
//       </div>
//     </ScrollArea>
//   );
// }

function EmptyProducts() {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageMinus />
          </EmptyMedia>
          <EmptyTitle>No Product Added Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t added any product yet, Start adding products to
            your collection .
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button variant="outline" type="button">
              Add Product
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
