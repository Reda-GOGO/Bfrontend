import { Tabs, TabsContent } from "@/components/ui/tabs";

import { ProductsTable } from "@/components/own/products/ProductTables";
import { ProductCards } from "@/components/own/products/ProductCards";

import useMediaQuery from "@/hooks/useMediaQuery";
import {
  ProductsProvider,
  useProductsContext,
} from "@/application/products/store/products.store";
import ProductsPagination from "@/components/own/products/ProductsPagination";
import ProductFilters from "@/components/own/products/ProductsFilters";
import {
  useProducts,
  useProductsSelection,
} from "@/application/products/hooks/useProducts";
import ProductsHeader from "@/components/own/products/ProductsHeader";

export default function Products() {
  return (
    <ProductsProvider>
      <ProductsWrapper />
    </ProductsProvider>
  );
}

const TABS_COLUMNS = ["all", "active", "archived"];
export function ProductsWrapper() {
  const { paginationControl, pagination, filterBy } = useProducts();
  const { selectedSize } = useProductsSelection();
  return (
    <div className="w-full flex flex-col ">
      <ProductsHeader />
      <ProductsContent filterBy={filterBy} />
      <ProductsPagination
        paginationControl={paginationControl}
        pagination={pagination}
        selectedSize={selectedSize}
      />
    </div>
  );
}

function ProductsContent({ filterBy }: { filterBy: (value: string) => void }) {
  return (
    <Tabs onValueChange={filterBy} defaultValue={"all"} className="w-full">
      <ProductFilters />
      {TABS_COLUMNS.map((tab) => (
        <TabsContent key={tab} value={tab}>
          <ProductGrid />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function ProductGrid() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { products } = useProductsContext();
  return (
    <div className="w-full flex flex-col">
      {isMobile ? (
        <ProductCards products={products} />
      ) : (
        <ProductsTable products={products} />
      )}
    </div>
  );
}
