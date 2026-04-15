import { useProductsContext } from "@/application/products/store/products.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp, ListFilter, SearchIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export default function ProductFilters() {
  const { isSearch, setIsSearch, search, setSearch, setPagination } =
    useProductsContext();
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
    setIsSearch(true);
  };
  const disableSearch = () => {
    setIsSearch(false);
    setSearch("");
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      <AnimatePresence initial={false}>
        {!isSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex justify-between items-center w-full"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => enableSearch()}
              >
                <SearchIcon className="mr-1" />
                <ListFilter />
              </Button>
              <Button variant="outline" size="sm">
                <ArrowDownUp />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full mt-2"
          >
            <div className="relative w-full flex items-center">
              <Input
                type="text"
                placeholder="Search for products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 pr-12 border rounded-lg shadow-sm transition placeholder:text-xs "
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => disableSearch()}
              >
                <span className="sr-only">Close search</span>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
