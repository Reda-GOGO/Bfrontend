import { ImageOff } from "lucide-react";

export function ProductImage({ src }: { src?: string }) {
  if (!src) {
    return (
      <div className="h-12 w-12 flex items-center justify-center bg-secondary/50 rounded-md border text-muted-foreground">
        <ImageOff className="h-5 w-5" />
      </div>
    );
  }

  return (
    <img
      src={`${import.meta.env.VITE_API_URL}${src}`}
      className="h-12 w-12 object-cover rounded-md shadow-sm border"
    />
  );
}
