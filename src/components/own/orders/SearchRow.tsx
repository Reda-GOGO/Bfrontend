import { Checkbox } from "@/components/ui/checkbox";
import { useOrderContext } from "@/contexts/orderContext";
import { ImageOff } from "lucide-react";

export default function SearchRow({ product }) {
  const { setOrderItems, setSelectedProducts, selectedProducts } =
    useOrderContext();
  const isChecked = selectedProducts.some((p) => p.id === product.id);
  const toggleSelected = (checked) => {
    if (checked) {
      setSelectedProducts((prev = []) => {
        if (prev.some((p) => p.id === product.id)) return prev;
        return [...prev, product];
      });
      setOrderItems((prev) => {
        if (prev.some((p) => p.productId === product.id)) return prev;
        return [
          ...prev,
          {
            productId: product.id,
            price: product.price,
            name: product.name,
            unit: product.unit,
            quantity: 1,
            productUnit: null,
          },
        ];
      });
    } else {
      setSelectedProducts((prev = []) =>
        prev.filter((p) => p.id !== product.id),
      );
      setOrderItems((prev) => prev.filter((p) => p.productId !== product.id));
    }
  };
  return (
    <div className="flex w-full items-center gap-2 bg-accent hover:bg-popover p-2">
      <div className="flex w-8 h-8 justify-center items-center">
        <Checkbox
          disabled={isChecked}
          checked={isChecked}
          onCheckedChange={toggleSelected}
        />
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
