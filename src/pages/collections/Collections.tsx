import CollectionsHeader from "@/components/own/collections/CollectionsHeader";
import { ArrowUpRightIcon, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useNavigate } from "react-router";
import {
  MoreHorizontal,
  Layers,
  Calendar,
  ArrowRight,
  ExternalLink,
  Edit3,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCollections from "@/application/collections/hooks/useCollections";
import type { Collection } from "@/types";

export default function Collections() {
  const { collections } = useCollections();
  return (
    <div className="w-full flex flex-col h-full">
      <CollectionsHeader />
      <CollectionsContent collections={collections} />
    </div>
  );
}

function CollectionsContent({
  collections = [],
}: { collections?: Collection[] }) {
  if (collections.length === 0) return <EmptyCollections />;

  return (
    <div className="flex-1 p-6 lg:px-8">
      {/* <div className="mb-6 flex items-center justify-between"> */}
      {/*   <div> */}
      {/*     <h2 className="text-2xl font-bold tracking-tight"> */}
      {/*       Your Collections */}
      {/*     </h2> */}
      {/*     <p className="text-muted-foreground text-sm"> */}
      {/*       Manage and organize your curated product sets. */}
      {/*     </p> */}
      {/*   </div> */}
      {/* </div> */}
      <CollectionGrid collections={collections} />
    </div>
  );
}

function CollectionGrid({ collections }: { collections: Collection[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
      {collections.map((item) => (
        <CollectionCard key={item.id} collection={item} />
      ))}
    </div>
  );
}
export function CollectionImage({ collection }: { collection: Collection }) {
  if (collection.image) {
    return (
      <img
        src={`${import.meta.env.VITE_API_URL + collection.image}`}
        alt={collection.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    );
  } else {
    return (
      <div className="flex h-full w-full items-center justify-center bg-primary/5">
        <Layers className="h-10 w-10 text-primary/20" />
      </div>
    );
  }
}

function CollectionCard({ collection }: { collection: Collection }) {
  const navigate = useNavigate();
  const productCount = collection._count.products || 0;

  return (
    <div
      onClick={() => navigate(`/collections/${collection.handle}`)}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      {/* Header Image Section */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        <CollectionImage collection={collection} />
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm dark:bg-black/90 font-semibold"
          >
            {productCount} {productCount === 1 ? "Product" : "Products"}
          </Badge>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-bold leading-none tracking-tight text-lg group-hover:text-primary transition-colors">
              {collection.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
              {collection.description ||
                "No description provided for this collection."}
            </p>
          </div>

          {/* Actions Dropdown */}
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/collections/edit/${collection.handle}`)
                  }
                >
                  <Edit3 className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="mr-2 h-4 w-4" /> View Live
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="h-3 w-3" />
            <span>
              Updated {new Date(collection.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
            View <ArrowRight className="h-3 w-3 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmptyCollections() {
  const navigate = useNavigate();
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Library />
          </EmptyMedia>
          <EmptyTitle>No Collection(s) Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any collections yet. Get started by
            creating your first collection.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/collections/create")}>
              Create Collection
            </Button>
            <Button variant="outline">Import Collection(s)</Button>
          </div>
        </EmptyContent>
        <Button variant="link" className="text-muted-foreground" size="sm">
          Learn More <ArrowUpRightIcon />
        </Button>
      </Empty>
    </div>
  );
}
