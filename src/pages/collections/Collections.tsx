import CollectionsHeader from "@/components/own/collections/CollectionsHeader";
import { ArrowDownUp, ArrowUpRightIcon, Library, Package, SearchIcon } from "lucide-react";
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
  X,
  MoreHorizontal,
  Layers,
  Calendar,
  ExternalLink,
  Edit3,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "motion/react"
import useCollections, { type CollectionsHook } from "@/application/collections/hooks/useCollections";
import type { Collection } from "@/types";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const TABS_COLUMNS = ["all", "active", "archived"];

export default function Collections() {
  const hook = useCollections();
  return (
    <div className="w-full flex flex-col h-full gap-6">
      <CollectionsHeader />
      <CollectionsContent
        hook={hook}
      />
      <CollectionPagination
        hook={hook}
      />
    </div>
  );
}

function CollectionsContent({
  hook
}: {
  hook: CollectionsHook
}) {
  const { filter, setFilter } = hook;
  return (
    <div className="w-full">
      <Tabs onValueChange={setFilter} value={filter} className="w-full">
        <CollectionFilters hook={hook} />
        {TABS_COLUMNS.map((tab) => (
          <TabsContent key={tab} value={tab}>
            <CollectionGrid hook={hook} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function CollectionGrid({
  hook
}: {
  hook: CollectionsHook
}) {
  return (
    <div className="w-full">
      <CollectionTable hook={hook} />
    </div>
  )
}


function CollectionTable({
  hook,
}: {
  hook: CollectionsHook
}) {
  const { collections, loading } = hook;
  console.log("collections", collections);

  return (
    <div className="w-full rounded-xl border bg-card shadow-sm  min-h-[360px]">
      <Table>
        <TableHeader className="sticky top-0 bg-muted/60 backdrop-blur-xl z-10 border-b">
          <TableRow className="bg-muted/40 hover:bg-muted/40 ">
            <TableHead className="w-12" />
            <TableHead className="font-semibold">Collection</TableHead>
            <TableHead className="hidden md:table-cell text-center font-semibold">
              Products
            </TableHead>
            <TableHead className="hidden lg:table-cell font-semibold">
              Last Updated
            </TableHead>
            <TableHead className="text-right w-12" />
          </TableRow>
        </TableHeader>
        <TableBody >
          {loading ? (
            // Skeleton rows during initial load or refetch after clearing search
            <div> loading ...</div>
          ) : (
            collections.map((collection) => (
              <CollectionRow key={collection.id} collection={collection} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function CollectionRow({
  collection
}: {
  collection: Collection
}) {
  const navigate = useNavigate();
  const productCount = collection._count.products || 0;
  return (
    <TableRow
      className="cursor-pointer group transition-colors p-4"
    >
      <TableCell className="py-2 pl-4 pr-2 w-12">
        <Checkbox />
      </TableCell>
      {/* Thumbnail */}
      <TableCell
        onClick={() => navigate(`/collections/${collection.handle}`)}
        className="py-2 pl-4 pr-2 flex-row flex gap-2">
        <div className="h-12 w-12 rounded-lg overflow-hidden border bg-muted flex  items-center justify-center shrink-0">
          {collection.image ? (
            <img
              src={`${import.meta.env.VITE_API_URL + collection.image}`}
              alt={collection.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Layers className="h-4 w-4 text-muted-foreground/50" />
          )}
        </div>
        {/* Name + description */}
        <div className="max-w-xs items-center justify-between flex">
          <p className="font-medium text-sm leading-snug group-hover:text-primary transition-colors truncate">
            {collection.name}
          </p>
          {/* <p className="text-xs text-muted-foreground truncate"> */}
          {/*   {collection.description || "No description"} */}
          {/* </p> */}
        </div>
      </TableCell>
      {/* Products count */}
      <TableCell
        onClick={() => navigate(`/collections/${collection.handle}`)}
        className="hidden md:table-cell text-center">
        <Badge variant="secondary" className="tabular-nums font-medium">
          <Package className="h-3 w-3 shrink-0" />
          {productCount}
          &nbsp;
          product(s)
        </Badge>
      </TableCell>
      {/* Updated at */}
      <TableCell
        onClick={() => navigate(`/collections/${collection.handle}`)}
        className="hidden lg:table-cell text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3 shrink-0" />
          {new Date(collection.updatedAt).toLocaleDateString()}
        </div>
      </TableCell>
      {/* Actions */}
      <TableCell className="text-right pr-4">
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/collections/update/${collection.handle}`)
                }
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}


function CollectionFilters({
  hook
}: {
  hook: CollectionsHook
}) {
  const [isSearch, setIsSearch] = useState(false)
  const { search, setSearch, setFilter } = hook;
  useEffect(() => {
    // We use a Set to track multiple keys simultaneously
    const pressedKeys = new Set<string>();

    const down = (e: KeyboardEvent) => {
      pressedKeys.add(e.key);

      // Check if both " " (Space) and "a" are in the Set
      // Note: We use e.code === "Space" to avoid issues with scroll behavior
      const isSpacePressed = pressedKeys.has(" ");
      const isAPressed = pressedKeys.has("a") || pressedKeys.has("A");

      if (isSpacePressed && isAPressed) {
        // Prevent 'a' from being typed and 'Space' from scrolling the page
        e.preventDefault();

        // setIsSearch((prev) => !prev);
        if (isSearch) {
          disableSearch();
        } else {
          enableSearch();
        }

        // Clear the set after trigger to prevent "sticky" firing
        pressedKeys.clear();
      }
    };

    const up = (e: KeyboardEvent) => {
      pressedKeys.delete(e.key);
    };

    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);

    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", up);
    };
  }, [isSearch]);
  const enableSearch = () => {
    setFilter("all")
    setIsSearch(true);
  };
  const disableSearch = () => {
    setIsSearch(false);
    setFilter("all")
    setSearch("");
  };

  return (
    <div className="flex w-full items-center gap-3">

      {/* Animated Left Area */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {isSearch ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search collections..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  className="
                    h-10
                    pr-10
                    rounded-xl
                    border-neutral-200
                    bg-white/80
                    backdrop-blur
                    shadow-sm
                    transition-all
                    focus-visible:ring-1
                  "
                />

                <button
                  onClick={() => {
                    setIsSearch(false)
                    setSearch("")
                  }}
                  className="
                    absolute right-3 top-1/2
                    -translate-y-1/2
                    text-muted-foreground
                    hover:text-foreground
                    transition
                  "
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tabs"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <TabsList className="rounded-xl">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Button */}
      <motion.div
        whileTap={{ scale: 0.96 }}
      >
        <Button
          onClick={() => { setIsSearch((prev) => !prev); setFilter("all") }}
          variant={isSearch ? "default" : "outline"}
          size="sm"
          className="rounded-xl"
        >
          <SearchIcon className="mr-2 h-4 w-4" />
          {isSearch ? "Close" : "Search"}
        </Button>
      </motion.div>
    </div>
  )
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
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-primary/5">
      <Layers className="h-10 w-10 text-primary/20" />
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




function CollectionPagination({
  hook
}: {
  hook: CollectionsHook
}) {
  const { pagination, setPagination } = hook;
  const {
    totalCount,
    currentPage,
    totalPages,
    limit,
  } = pagination;
  const changeLimit = (value: number) => {
    setPagination((prev) => ({ ...prev, limit: value, currentPage: 1 }));
  };
  const goPrevPage = () => {
    setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
  };
  const goNextPage = () => {
    setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
  };
  const goFirstPage = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };
  const goLastPage = () => {
    setPagination((prev) => ({ ...prev, currentPage: prev.totalPages }));
  };
  return (
    <div className="flex w-full text-sm items-center justify-between px-4 py-2">
      <p className="text-muted-foreground @max-[1024px]/main:hidden">
        {0} of {totalCount} row(s) selected
      </p>

      <div className="flex items-center justify-between lg:gap-16 @max-[1024px]/main:w-full ">
        <div className="flex gap-8 items-center @max-[1024px]/main:hidden ">
          <p>Rows per page</p>

          <Select
            defaultValue={String(limit)}
            onValueChange={(v) => changeLimit(Number(v))}
          >
            <SelectTrigger className="px-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex lg:gap-8 items-center @max-[1024px]/main:w-full @max-[1024px]/main:justify-between">
          <p>
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2 ">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={goFirstPage}
              disabled={pagination.currentPage === 1}
            >
              <ChevronsLeft />
            </Button>

            <Button
              variant="outline"
              className="h-8 w-8 p-0 "
              onClick={goPrevPage}
              disabled={pagination.currentPage === 1}
            >
              <ChevronLeft />
            </Button>

            <Button
              variant="outline"
              className="h-8 w-8 p-0 "
              onClick={goNextPage}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              <ChevronRight />
            </Button>

            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={goLastPage}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
