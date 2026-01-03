import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, Upload, Trash2 } from "lucide-react";
import type { Product } from "@/types"; // adjust path if needed

type Props = {
  product?: Product; // ✅ optional
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
};

export default function MediaCard({ product, setProduct }: Props) {
  console.log("product image : ", product.image);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const formatImageUrl = (image: string | null) => {
    const isImageStored = image?.split(":").includes("blob");
    if (isImageStored) {
      return product?.image;
    } else {
      return `${import.meta.env.VITE_API_URL + product.image}`;
    }
  };
  const fileRef = React.useRef<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    fileRef.current = file; // save the actual file
    setProduct((prev) => ({ ...prev, image: preview, imageFile: file }));
  };

  const removeImage = () => {
    setProduct((prev) => ({
      ...prev,
      image: null,
      imageFile: null,
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6 py-8">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* ================= SAFE RENDER ================= */}
        {product?.image ? (
          <div className="group relative">
            <img
              src={formatImageUrl(product.image)}
              alt="Product image"
              className="h-44 w-44 rounded-xl border object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl bg-black/40 opacity-0 transition group-hover:opacity-100">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Replace
              </Button>

              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={removeImage}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-44 w-44 flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/40 text-muted-foreground transition hover:bg-muted"
          >
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs font-medium">Upload image</span>
          </button>
        )}
      </CardContent>
    </Card>
  );
}
