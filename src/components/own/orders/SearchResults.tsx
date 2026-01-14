import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import SearchRow from "./SearchRow.tsx";
import { useEffect, useState } from "react";
import { productApi } from "@/application/products/api/product.api.ts";

export default function SearchResults({ search }: { search: string }) {
  const [products, setProducts] = useState();
  const getProducts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product?search=${search}`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setProducts(data.products);
    } catch (e) {
      console.error("error during fetching products : ", e);
    }
  };
  useEffect(() => {
    getProducts();
  }, [search]);
  return (
    <div className="flex w-full py-4 flex-col text-sm ">
      <ScrollArea className="h-76">
        {products &&
          products.map((product, index) => {
            return <SearchRow product={product} key={index} />;
          })}
      </ScrollArea>
    </div>
  );
}
