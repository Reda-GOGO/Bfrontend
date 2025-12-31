import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp, ListFilter, SearchIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function OrdersFilters({
  search,
  setSearch,
}: { search: string; setSearch: (search: string) => void }) {
  const [isSearch, setIsSearch] = useState(false);
  // const [search, setSearch] = useState("");

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
                onClick={() => setIsSearch(true)}
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
                autoFocus={false}
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setIsSearch(false)}
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
