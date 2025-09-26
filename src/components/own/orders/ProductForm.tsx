import { useOrderContext } from "@/contexts/orderContext.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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

export default function ProductForm() {
  const { selectedProducts } = useOrderContext();
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-sm">Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full gap-2 items-center justify-center max-xl:flex-col ">
          <div className="flex relative w-3/5 max-xl:w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="search for product"
              className="pl-8"
            ></Input>
          </div>
          <div className="grid grid-cols-2 max-xl:grid-cols-1 w-2/5 max-xl:w-full gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size={"sm"} variant={"outline"}>
                  Browse
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:min-w-2xl w-full px-0  flex flex-col overflow-auto">
                <DialogHeader className="p-4 ">
                  <DialogTitle>Products</DialogTitle>
                  <DialogDescription>
                    Select products to add to the order.
                  </DialogDescription>
                </DialogHeader>
                <SearchDialog />
              </DialogContent>
            </Dialog>
            <Button size={"sm"}>Add Custom item</Button>
          </div>
        </div>
        <div className="flex w-full flex-col py-4 gap-2">
          {selectedProducts.length !== 0 && (
            <div className="flex w-full">
              <span className="text-sm">Selected Items</span>
            </div>
          )}
          {selectedProducts &&
            selectedProducts.map((product, index) => {
              return <OrderLine product={product} key={index} />;
            })}
        </div>
      </CardContent>
    </Card>
  );
}
