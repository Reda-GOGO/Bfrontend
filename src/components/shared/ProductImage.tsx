import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

export function ProductImage({
  src,
  className,
}: { src?: string; className?: string }) {
  if (!src) {
    return (
      <div
        className={cn(
          "h-12 w-12 flex items-center justify-center bg-secondary/50 rounded-md border text-muted-foreground",
          className,
        )}
      >
        <ImageOff className="h-5 w-5" />
      </div>
    );
  }

  return (
    <img
      src={`${import.meta.env.VITE_API_URL}${src}`}
      className={cn(
        "h-12 w-12 object-cover rounded-md shadow-sm border",
        className,
      )}
    />
  );
}
