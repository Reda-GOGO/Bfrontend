import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Check,
  CheckCircle2,
  ChevronsUpDown,
  Layers,
  ListFilter,
  Loader2,
  Minus,
  Package,
  PackageMinus,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty.tsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import { useOrderCollectionLoader, useOrderProductLoader } from "@/application/orders/hooks/useOrder.tsx";
import type { Product } from "@/types/index.ts";
import { ProductImage } from "@/components/shared/ProductImage.tsx";
import { cn, formatMAD } from "@/lib/utils.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import Col from "@/components/shared/Col.tsx";
import Row from "@/components/shared/Row.tsx";

export default function ProductForm() {
  const [open, setOpen] = useState(false);

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-sm">Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full gap-2 items-center justify-center max-xl:flex-col ">
          <div
            className="flex relative w-3/5 max-xl:w-full"
            onClick={() => setOpen(true)}
          >
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="search for product"
              onFocus={() => setOpen(true)}
              className="pl-8"
            ></Input>
          </div>
          <div className="grid grid-cols-2 max-xl:grid-cols-1 w-2/5 max-xl:w-full gap-2">
            <BrowserModal open={open} setOpen={setOpen} />
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

function BrowserModal({ open, setOpen }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"outline"}>
          Browse
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col w-full sm:max-w-4xl h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>Products</DialogTitle>
          <DialogDescription>Select products to add to the order.</DialogDescription>
        </DialogHeader>
        <Browser />

        <DialogFooter className="px-6 py-4 shrink-0 border-t">
          <Button onClick={() => setOpen(false)} variant="outline">Cancel</Button>
          <Button onClick={() => setOpen(false)} variant="default">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Browser() {
  const [search, setSearch] = useState<string>("");
  const [collectionFilter, setCollectionFilter] = useState<string>("");
  const { products, hasMore, isLoading, loadMore, pagination } = useOrderProductLoader({
    search,
    collectionHandle: collectionFilter
  });
  const totalPages = pagination.totalItems;
  const { collections } = useOrderCollectionLoader();
  const [show, setShow] = useState(true);

  return (
    <div className="flex flex-col flex-1 min-h-0 px-6 pt-2 pb-0 gap-4">
      <Row className="w-full items-center">
        <Input
          placeholder="Search products ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Badge className="flex p-2 h-8">
          <span className="text-sm">All Collections</span>
          <ChevronsUpDown className="ml-auto size-4" />
        </Badge>
        <Button onClick={() => setShow(!show)} variant="outline" size="sm">
          <ListFilter />
        </Button>
      </Row>
      {
        show && (
          <Filters
            collections={collections}
            totalPages={totalPages}
            filter={collectionFilter}
            setFilter={setCollectionFilter}
          />
        )
      }
      {/* This wrapper is the key: gives ScrollArea a real pixel height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ItemsList
          products={products}
          isLoading={isLoading}
          hasMore={hasMore}
          loadMore={loadMore}
        />
      </div>
    </div>
  );
}

function Filters({ collections, totalPages, setFilter, filter }) {
  return (
    <Row className="flex-wrap gap-1">
      {/* "All" Button */}
      <Button
        autoFocus
        onClick={() => setFilter("")}
        className={cn("bg-primary/80 dark:bg-muted dark:text-primary text-xs h-7 px-4 py-1 rounded-full hover:bg-primary-dark  transition-all duration-200",
          filter === "" ? "outline-none ring-2 ring-green-400" : ""
        )}
      >
        <span>All</span>
        <span className="ml-2 rounded-full bg-background dark:bg-primary text-primary dark:text-background text-xs p-1 w-5 h-5 flex items-center justify-center font-semibold">
          {totalPages}
        </span>
      </Button>

      {/* Collection Buttons */}
      {collections.map((collection) => (
        <Button
          key={collection.handle}
          onClick={() => setFilter(collection.handle)}
          className={cn("bg-gray-100 text-xs h-7 text-gray-800 px-4 py-1 rounded-full hover:bg-gray-200  transition-all duration-200",
            filter === collection.handle ? "outline-none ring-2 ring-green-400" : ""
          )}
        >
          <span>{collection.name}</span>
          <span className="ml-2 rounded-full bg-background text-primary text-xs p-1 w-5 h-5 flex items-center justify-center font-semibold">
            {collection._count.products}
          </span>
        </Button>
      ))}
    </Row>

  )
}


function ItemsList({ products, isLoading, hasMore, loadMore }) {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  return (
    <ScrollArea className="h-full w-full pr-4">
      <div className="flex flex-col gap-2 pb-4">
        {products.map((product) => (
          <ProductCard key={product.handle} product={product} />
        ))}
        <div ref={observerTarget} className="py-4 flex justify-center w-full">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Loading more products...</span>
            </div>
          ) : hasMore ? (
            <div className="h-4" />
          ) : (
            <span className="text-xs text-muted-foreground opacity-50">
              No more products to show
            </span>
          )}
        </div>
      </div>
      <ScrollBar />
    </ScrollArea>
  );
}


function ProductCard({ product }: { product: Product }) {
  const [isAdded, setIsAdded] = useState(false);
  return (
    <div

      className={cn(
        "group relative flex w-full p-3  gap-4 rounded-xl border transition-all duration-200 cursor-pointer select-none",
        isAdded
          ? "bg-primary/[0.03] border-primary ring-1 ring-primary/20 shadow-sm"
          : "bg-card hover:bg-accent/50 hover:border-accent-foreground/10",
      )}

    >
      <PictureArea product={product} selected={isAdded} />
      <Col className="w-full">
        <Highlight product={product} isAdded={isAdded} />
        {
          isAdded && (

            <Col className=" gap-4">
              <Row className="gap-2  justify-between items-center">
                <UnitInput product={product} isAdded={isAdded} />
                <QuantityInput isAdded={isAdded} />
              </Row>

              <Row className="items-center justify-between gap-2">
                <PriceInput product={product} isAdded={isAdded} />
                <TotalAmount product={product} isAdded={isAdded} />
              </Row>
            </Col>
          )
        }
      </Col>

      {
        isAdded ? (
          <span onClick={() => setIsAdded(!isAdded)} className="p-2" >
            <Trash2 className="h-4 w-4 text-primary  hover:text-red-500 " />
          </span>
        ) : (
          <Button onClick={() => setIsAdded(!isAdded)} size={"sm"} variant="default" type="button" className="cursor-pointer" >
            <Plus />
            Add
          </Button>
        )
      }
    </div>
  );
}


function Highlight({ product, isAdded }) {
  return (
    <Col>
      <div className="flex justify-between items-center gap-4">
        <h2 className="font-bold text-lg">{product.name}</h2>
      </div>
      <Row className="gap-4 items-center">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Badge variant="secondary">
            <Layers className="h-3 w-3" />
            <span>{product.units?.length || 0}  unit(s)</span>
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Badge variant="secondary">

            <Package className="h-3 w-3" />
            <span>default : {formatMAD(product.price)} MAD / {product.unit}</span>
          </Badge>
        </div>
      </Row>
    </Col>
  )
}


function TotalAmount({ product, isAdded }) {

  const [amount, setAmount] = useState<number>(product.price * 135)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAmount(135 * product.price) // Reset to the original price when the product changes
  }, [product.price])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value)
    // if (!isNaN(newAmount)) {
    //   console.log("is not a number : ", newAmount)
    setAmount(isNaN(newAmount) ? 0 : newAmount)
    setIsEditing(true)
    // }
  }

  const handleConfirm = () => {
    // You would send the updated price here (e.g., an API call)
    console.log("Price confirmed:", amount)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setAmount(135 * product.price) // Reset to the original price
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm()
    }
  }

  useEffect(() => {
    if (isEditing && amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <Col>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Total Amount
      </Label>
      <Row className="gap-2 items-center">
        <span className="text-sm font-bold">135 {product.unit} </span>
        <X className="w-3 h-3" />
        <span className="text-sm font-bold">{formatMAD(product.price)} MAD</span>
        <span className="text-sm font-bold">=  </span>
        {
          isEditing ? (
            <>

              <Input
                type="number"
                ref={amountInputRef}
                disabled={!isAdded}
                defaultValue={135 * product.price}
                onWheel={(e) => e.currentTarget.blur()}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="h-8 w-30 text-center"
              />
              <Row>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 p-2 bg-green-100 text-green-700 hover:bg-green-200"
                  onClick={handleConfirm}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 p-2 bg-red-100 text-red-700 hover:bg-red-200"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4" />
                </Button>
              </Row>
            </>
          ) : (
            <>

              <div
                className="flex items-center gap-1.5 h-8 px-3.5 py-2 rounded-md border  font-bold text-sm "
                title="Click to edit price"
              >
                <Check className="w-3 h-3 text-muted-foreground" />
                <span className="">{formatMAD(amount)}</span>
                <span className=""> MAD</span>
              </div>
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="text-sm" disabled={!isAdded}>
                <Pencil className="w-3 h-3 text-muted-foreground" />
              </Button>
            </>

          )
        }
      </Row>

    </Col>
  )
}


function PriceInput({ product, isAdded }: { product: Product, isAdded: boolean }) {
  const [price, setPrice] = useState<number>(product.price)
  const [isEditing, setIsEditing] = useState<boolean>(true)

  useEffect(() => {
    setPrice(product.price) // Reset to the original price when the product changes
  }, [product.price])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(e.target.value)
    // if (!isNaN(newPrice)) {
    //   console.log("is not a number : ", newPrice)
    setPrice(isNaN(newPrice) ? 0 : newPrice)
    setIsEditing(true)
    // }
  }

  const handleConfirm = () => {
    // You would send the updated price here (e.g., an API call)
    console.log("Price confirmed:", price)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setPrice(product.price) // Reset to the original price
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm()
    }
  }

  return (
    <Col>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Price
      </Label>
      <Row className="gap-2 items-center">
        {isEditing ? (
          <Row className="gap-2 items-center">
            <Input
              type="number"
              autoFocus
              value={price}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              onWheel={(e) => e.currentTarget.blur()} // Prevents scrolling in number inputs
              className="h-8 w-40 text-center"
            />
            <Row>

              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-2 bg-green-100 text-green-700 hover:bg-green-200"
                onClick={handleConfirm}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-2 bg-red-100 text-red-700 hover:bg-red-200"
                onClick={handleCancel}
              >
                <X className="w-4 h-4" />
              </Button>
            </Row>
          </Row>
        ) : (
          <>

            <div
              className="flex items-center gap-1.5 h-8 px-3.5 py-2 rounded-md border  font-bold text-sm "
              title="Click to edit price"
            >
              <Check className="w-3 h-3 text-muted-foreground" />
              <span className="">{formatMAD(price)}</span>
              <span className=""> MAD</span>
            </div>
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="text-sm" disabled={!isAdded}>
              <Pencil className="w-3 h-3 text-muted-foreground" />
            </Button>
          </>

        )}
      </Row>
    </Col>
  )
}

function UnitInput({ product, isAdded }: { product: Product; isAdded: boolean }) {
  const defaultUnit = product.units?.[0].name ? product.units[0].name : "";
  const [selectedUnit, setSelectedUnit] = useState<string>(defaultUnit);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState<string>(defaultUnit);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (unitName: string) => {
    setSelectedUnit(unitName);
    setRenameValue(unitName);
  };

  const handleRename = () => {
    // Perform rename logic (e.g., API call)
    setIsRenaming(false);
    console.log(`Renamed to: ${renameValue}`);
  };

  const setRenameMode = () => {
    // if(renameInputRef.current) {

    setIsRenaming(true)
    // console.log("renaming mode", renameInputRef.current)
    // renameInputRef.current.focus();
    // }
  }
  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      // Optional: select all text when editing
      // renameInputRef.current.select();
      // const len = renameInputRef.current.value.length;
      // renameInputRef.current.setSelectionRange(len, len);
    }
  }, [isRenaming]);

  const hasMultipleUnits = product.units && product.units.length > 1;

  return (
    <Col className="gap-2 ">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Unit
      </Label>

      <div className="flex gap-2 items-center">
        {/* Unit Selector */}
        <Select
          value={selectedUnit || undefined}
          onValueChange={handleSelect}
          disabled={!isAdded}
        >
          <SelectTrigger className={cn("h-10 w-[120px] ", !selectedUnit && "ring-2 ring-red-500 ")}>
            <SelectValue placeholder="Select Unit" />
          </SelectTrigger>
          <SelectContent>
            {product.units?.map((unit) => (
              <SelectItem key={unit.name} value={unit.name}>
                {unit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Rename Input */}
        {selectedUnit && (
          <div className="flex gap-2 items-center">
            <Input
              ref={renameInputRef}
              type="text"
              disabled={!isRenaming}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="h-10 w-40 text-center transition-colors duration-150"
            />

            {/* Rename / Save Buttons */}
            {!isRenaming ? (
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-2"
                onClick={() => setIsRenaming(true)}
              >
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 p-2 bg-green-100 text-green-700 hover:bg-green-200"
                  onClick={handleRename}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 p-2 bg-red-100 text-red-700 hover:bg-red-200"
                  onClick={() => {
                    setIsRenaming(false);
                    setRenameValue(selectedUnit);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Optional UX tip for single unit */}
      {!hasMultipleUnits && !selectedUnit && (
        <p className="text-xs  text-red-400">Please select the unit first</p>
      )}
    </Col>
  );
}

function QuantityInput({ isAdded }: { isAdded: boolean }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <Col className="gap-2 justify-between">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Quantity
      </Label>
      <Row className="gap-2 justify-between">
        <Button onClick={() => { setQuantity(quantity - 1) }} variant={"default"} size={"sm"} className="text-sm">
          <Minus className="w-3 h-3 " />
        </Button>

        <Input
          type="number"
          disabled={!isAdded}
          autoFocus
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          onWheel={(e) => e.currentTarget.blur()}
          className="h-8 w-40 text-center"
        />
        <Button onClick={() => setQuantity(quantity + 1)} variant={"default"} size={"sm"} className="text-sm">
          <Plus className="w-3 h-3 " />
        </Button>
      </Row>
    </Col>
  )
}

function PictureArea({ product, selected }: { product: Product, selected: boolean }) {
  return (

    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
      <ProductImage
        src={product.image || undefined}
        className="h-full w-full object-cover"
      />
      {selected && (
        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-green-500 fill-white dark:fill-black" />
        </div>
      )}
    </div>
  )
}



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
