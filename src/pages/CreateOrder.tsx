import Back from "@/components/own/Back";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageOff, Plus, Search, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { ScrollArea } from "../components/ui/scroll-area.tsx";

export default function Create() {
  const isDesktop = useMediaQuery("(min-width : 768px)");
  const [customer, setCustomer] = useState();
  const [type, setType] = useState();
  const [orderItems, setOrderItems] = useState();
  console.log("order items : ", orderItems);
  return (
    <Back>
      <div className="flex w-full flex-col">
        <div className="lg:grid lg:grid-cols-3 w-full gap-4 xl:px-46">
          <div className="lg:col-span-2 flex flex-col gap-2">
            <ProductSection setOrderItems={setOrderItems} />
            <PayementSection />
          </div>
          <div className="lg:col-span-1 max-lg:py-4 flex flex-col gap-2">
            <CustomerSection />
            <OrderType />
          </div>
        </div>
        <div className="flex w-full p-4 justify-end">
          <Button className="w-[200px]">Add Order</Button>
        </div>
      </div>
    </Back>
  );
}

function ProductSection({ setOrderItems }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  console.log("selectedProducts : ", selectedProducts);
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
                <SearchProduct
                  selectedProducts={selectedProducts}
                  setSelectedProducts={setSelectedProducts}
                />
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
              return (
                <OrderLine
                  product={product}
                  key={index}
                  setSelectedProducts={setSelectedProducts}
                  setOrderItems={setOrderItems}
                />
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
function OrderLine({ product, setSelectedProducts, setOrderItems }) {
  const baseUnit = {
    name: product.unit,
    price: product.price,
    quantityInBase: 1,
  };
  const otherUnit = product.units.map((u) => {
    const { name, price, quantityInBase } = u;
    return { name, price, quantityInBase };
  });
  const allUnit = [baseUnit, ...otherUnit];
  console.log("otherUnit : ", allUnit);
  const deleteItems = () => {
    setSelectedProducts((prev) => {
      return prev.filter((p) => p.id !== product.id);
    });
  };
  const [selectedPrice, setSelectedPrice] = useState(product.price);
  const handleUnit = (value) => {
    const currentUnit = allUnit.find((u) => u.name === value);
    const price = currentUnit.price;
    setSelectedPrice(price);
    setOrderItems((prev = []) => {
      return [
        ...prev,
        {
          name: product.name,
          unit: currentUnit,
          price: price,
          quantity: 1,
        },
      ];
    });
    console.log("selected Unit : ", value, price);
  };
  return (
    <div
      className="flex w-full items-center gap-2 py-4 px-2 text-sm"
      key={product.id}
    >
      {product.image ? (
        <img
          src={`${import.meta.env.VITE_API_URL}${product.image}`}
          className="h-12 w-12 object-cover rounded-md"
        />
      ) : (
        <div className="h-12 w-12 object-cover flex items-center justify-center bg-background rounded-md">
          <ImageOff />
        </div>
      )}
      <div className="flex w-full flex-col  gap-2">
        <span className="font-semibold w-[60%]">{product.name}</span>
        <span>
          {selectedPrice} <span className="font-semibold">MAD</span>{" "}
        </span>
      </div>
      <div className="flex">
        <Select onValueChange={handleUnit} defaultValue={allUnit[0].name}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              {allUnit.map((u, index) => {
                return (
                  <SelectItem key={index} value={u.name}>
                    {u.name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center w-[20%] gap-2">
        <Input type="number" defaultValue={1}></Input>
      </div>
      <Button onClick={deleteItems}>
        <Trash />
      </Button>
    </div>
  );
}
function SearchProduct({ selectedProducts, setSelectedProducts }) {
  return (
    <div className="flex w-full flex-col ">
      <div className="flex w-full gap-2 px-2 max-sm:flex-col max-sm:flex-col-reverse">
        <div className="flex relative w-full ">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="search for product"
            className="pl-8"
          ></Input>
        </div>
        <div className="flex">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Search By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <SearchResults
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />
      <div className="flex w-full justify-end px-4">
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button size={"sm"} variant={"secondary"}>
              <Trash />
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button size={"sm"}>
              <Plus /> Add Products
            </Button>
          </DialogClose>
        </div>
      </div>
    </div>
  );
}

function SearchResults({ selectedProducts, setSelectedProducts }) {
  const [products, setProducts] = useState();
  const getProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/product`, {
        credentials: "include",
      });
      const data = await res.json();
      setProducts(data.products);
    } catch (e) {
      console.error("error during fetching products : ", e);
    }
  };
  useEffect(() => {
    getProducts();
  }, []);
  return (
    <div className="flex w-full py-4 flex-col text-sm ">
      <ScrollArea className="h-76">
        {products &&
          products.map((product, index) => {
            return (
              <SearchRow
                product={product}
                key={index}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
              />
            );
          })}
      </ScrollArea>
    </div>
  );
}

function SearchRow({ product, selectedProducts, setSelectedProducts }) {
  const isChecked = selectedProducts.some((p) => p.id === product.id);
  const toggleSelected = (checked) => {
    if (checked) {
      setSelectedProducts((prev = []) => {
        if (prev.some((p) => p.id === product.id)) return prev;
        return [...prev, product];
      });
    } else {
      setSelectedProducts((prev = []) =>
        prev.filter((p) => p.id !== product.id),
      );
    }
  };
  return (
    <div className="flex w-full items-center gap-2 bg-accent hover:bg-popover p-2">
      <div className="flex w-8 h-8 justify-center items-center">
        <Checkbox checked={isChecked} onCheckedChange={toggleSelected} />
      </div>
      <div className="flex">
        {product.image ? (
          <img
            src={`${import.meta.env.VITE_API_URL}${product.image}`}
            className="h-12 w-12 object-cover rounded-md"
          />
        ) : (
          <div className="h-12 w-12 object-cover flex items-center justify-center bg-background rounded-md">
            <ImageOff />
          </div>
        )}
      </div>
      <div className="flex w-full justify-between px-2">
        <span className="font-semibold">{product.name}</span>
        <span className="flex justify-center items-center gap-2">
          {product.price} <span className="font-bold">MAD</span>
        </span>
      </div>
    </div>
  );
}

function PayementSection() {
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-sm">Payment</CardTitle>
      </CardHeader>
      <CardContent>this is the payment section</CardContent>
    </Card>
  );
}

function CustomerSection() {
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-sm">Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full ">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <Button className="w-full">
                  <Plus /> Create a new Customer
                </Button>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderType() {
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-sm">Order type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full ">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type " />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>orders</SelectLabel>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="purchase">Purchase Order</SelectItem>
                <SelectItem value="delivery">Delivery Order</SelectItem>
                <SelectItem value="devis">Devis</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
