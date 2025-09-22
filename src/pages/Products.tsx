import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Package,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router/internal/react-server-client";
import { toast } from "sonner";

type ProductUnit = {
  id: number;
  productId: number;
  name: string;
  quantityInBase: number;
  price: number;
};

type Product = {
  id: number;
  name: string;
  handle: string;
  image: string | null;
  description: string | null;
  cost: number;
  price: number;
  unit: string;
  inventoryUnit: string;
  inventoryQuantity: number;
  vendorName: string | null;
  vendorContact: string | null;
  createdAt: string;
  updatedAt: string | null;
  archived: boolean;
  units: ProductUnit[];
};

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(7);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL
          }/product?page=${page}&limit=${limit}&search=${encodeURIComponent(
            search,
          )}`,
        );
        const data = await res.json();

        // ensure products is always an array
        setProducts(Array.isArray(data.products) ? data.products : []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts([]); // fallback
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [page, search, limit]);

  const toggleSelectAll = () => {
    if (selected.length === products.length) {
      setSelected([]);
    } else {
      setSelected(products.map((p) => p.id));
    }
  };
  const handleRowClick = (e: Event, productId: number) => {
    e.preventDefault();
    const targetElement = e.target as HTMLElement;
    if (targetElement.tagName !== "BUTTON") {
      navigate(`/products/${productId}`);
    }
  };
  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  const handleCreate = (e: Event) => {
    e.preventDefault();
    navigate("/products/create");
  };
  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <Button onClick={(e) => handleCreate(e)}>Add product</Button>
        <div className="relative w-full ">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset to first page on search
            }}
            className="pl-8"
          />
        </div>
        <Button
          variant="secondary"
          disabled={selected.length === 0}
          onClick={() => toast(`Bulk action on: ${selected}`)}
        >
          Bulk Action ({selected.length})
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden w-full ">
        <Table>
          <TableHeader className="bg-muted ">
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    selected.length === products.length && products.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead>Base Unit</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Vendor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: limit }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex flex-col items-center space-y-2">
                    <Package className="h-10 w-10 text-muted-foreground" />
                    <p className="text-muted-foreground">No products found.</p>
                  </div>{" "}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-muted/50 transition-colors"
                  onClick={(e) => handleRowClick(e, product.id)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(product.id)}
                      onCheckedChange={() => toggleSelect(product.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {product.image ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${product.image}`}
                        className="h-12 w-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-12 w-12 object-cover flex items-center justify-center bg-background rounded-md">
                        {/*   {" "} */}
                        <ImageOff />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {product.inventoryQuantity} {product.inventoryUnit}
                  </TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>
                    {product.cost} <b>MAD</b>
                  </TableCell>
                  <TableCell>
                    {product.price} <b>MAD</b>
                  </TableCell>
                  <TableCell>{product.vendorName || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-3">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
