import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  MoreHorizontal,
  Edit3,
  Plus,
  Search,
  Package,
  Tag,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCollectionDetail } from "@/application/collections/hooks/useCollection";

export default function Collection() {
  const { handle } = useParams();
  const navigate = useNavigate();
  // Assuming a hook that fetches the single collection by handle
  const { collection, loading } = useCollectionDetail(handle);

  if (loading) return <CollectionDetailSkeleton />;
  if (!collection) return <CollectionNotFound />;

  return (
    <Back>
      <CollectionHeader collection={collection} />
      <div className="lg:grid lg:grid-cols-3 w-full flex flex-col gap-4 xl:px-46">
        <div className="col-span-2 w-full flex gap-2 flex-col">
          <CollectionStat collection={collection} />
          <CollectionProducts collection={collection} />
        </div>
        <CollectionInfoCard collection={collection} />
      </div>
    </Back>
  );
}

import { PackageOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

function CollectionProducts({ collection }: { collection: Collection }) {
  const products = collection.products || [];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">
          Collection Products ({products.length})
        </h3>
      </div>
      <div className="flex w-full p-4 border rounded-lg">
        {products.length > 0 ? (
          <ScrollArea className="w-full">
            <div className="w-full flex flex-col gap-2 pr-4 pb-4 h-[450px]">
              {products.map((product) => (
                /* Reuse a simplified version of ProductCard or the list below */
                <ProductCard
                  key={product.id}
                  product={product}
                  isProductSelected={() => true} // Always selected in this view
                // toggleProduct={() => { }} // You can add removal logic here
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex w-full h-[450px] flex-col items-center justify-center gap-2 text-muted-foreground">
            <EmptyCollectionProducts />
          </div>
        )}
      </div>
    </div>
  );
}

import { Info, Link as LinkIcon, FileText } from "lucide-react";

function CollectionInfoCard({ collection }: { collection: Collection }) {
  return (
    <Card className="overflow-hidden shadow-sm border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <CardTitle className="text-lg font-bold">
            Collection Overview
          </CardTitle>
        </div>
        <CardDescription>
          Main identity and visual details of your collection
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Visual Preview */}
        <div className="group relative w-full overflow-hidden rounded-xl border bg-muted/30 aspect-video flex items-center justify-center">
          <CollectionImage
            collection={collection}
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Textual Metadata */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-black tracking-tight text-foreground lowercase first-letter:uppercase">
              {collection.name || "Untitled Collection"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
              <code className="text-[12px] bg-muted px-2 py-0.5 rounded-md font-mono text-muted-foreground italic">
                /{collection.handle}
              </code>
            </div>
          </div>

          <Separator className="bg-muted/60" />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <FileText className="w-3 h-3" />
              Description
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              {collection.description ||
                "No description provided for this collection."}
            </p>
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge
              variant="secondary"
              className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10"
            >
              Active Status
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              {collection.products?.length || 0} Products Linked
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductCard({
  product,
  isProductSelected,
  toggleProduct,
}: {
  product: Product;
  isProductSelected: (productId: number) => boolean;
  toggleProduct: (product: Product) => void;
}) {
  const selected = isProductSelected(product.id);

  return (
    <div
      onClick={() => toggleProduct(product)}
      className={cn(
        "group relative flex w-full p-3 items-center gap-3 sm:gap-4 rounded-xl border transition-all duration-200 cursor-pointer select-none",
        selected
          ? "bg-primary/[0.03] border-primary ring-1 ring-primary/20 shadow-sm"
          : "bg-card hover:bg-accent/50 hover:border-accent-foreground/10",
      )}
    >
      {/* Responsive Image: Smaller on mobile, standard on tablet+ */}
      <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg border bg-muted shadow-inner">
        <ProductImage
          src={product.image}
          className="h-full w-full object-cover transition-transform group-hover:scale-110"
        />
        {selected && (
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-white dark:bg-black rounded-full p-0.5 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </div>
        )}
      </div>

      {/* Content Area: Uses flex-1 and min-w-0 to prevent text overflow */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row max-sm:w-50 sm:items-center justify-between gap-1">
          <span className="font-bold text-sm sm:text-base  pr-2">
            {product.name}
          </span>
          <Badge
            variant={selected ? "default" : "secondary"}
            className="font-mono text-[10px] w-fit px-1.5 py-0"
          >
            {formatMAD(product.price)} MAD
          </Badge>
        </div>

        {/* Stats: Hidden on very small screens or made compact */}
        <div className="flex items-center gap-3 sm:gap-4 mt-0.5">
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground font-medium">
            <Layers className="h-3 w-3 text-primary/60" />
            <span>
              {product.units?.length || 0}{" "}
              <span className="hidden xs:inline">Variants</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground font-medium">
            <Package className="h-3 w-3 text-primary/60" />
            <span>Stock: {product.availableQty}</span>
          </div>
        </div>
      </div>

      {/* Action Area: Switch is hidden on small mobile to save space, visible on sm+ */}
      <div className="flex items-center pl-1 sm:pl-2">
        <Switch
          checked={selected}
          className="scale-75 sm:scale-100 data-[state=checked]:bg-green-500"
        />
      </div>
    </div>
  );
}
import { Skeleton } from "@/components/ui/skeleton";

export function CollectionDetailSkeleton() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="p-6 lg:p-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-6 w-40 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            {/* Stats Bar Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          </div>
          <Skeleton className="aspect-square w-full rounded-2xl" />
        </div>

        {/* Product Grid Skeleton */}
        <div className="space-y-6 pt-10">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { SearchX } from "lucide-react";
import { CollectionImage } from "./Collections";
import { ProductImage } from "@/components/shared/ProductImage";
import Back from "@/components/own/Back";
import CollectionHeader from "@/components/own/collections/CollectionHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatMAD } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { CollectionStat } from "@/components/own/collections/CollectionStat";

export function CollectionNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center text-center p-6">
      <div className="mb-6 rounded-full bg-muted p-6">
        <SearchX className="h-12 w-12 text-muted-foreground/50" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">
        Collection Not Found
      </h2>
      <p className="text-muted-foreground max-w-xs mb-8">
        We couldn't find the collection you're looking for. It might have been
        deleted or the handle is incorrect.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
        <Button onClick={() => navigate("/collections")}>
          View All Collections
        </Button>
      </div>
    </div>
  );
}

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyCollectionProducts() {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Package />
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
