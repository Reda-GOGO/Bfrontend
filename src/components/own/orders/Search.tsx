import SearchResults from "./SearchResults.tsx";

import { Input } from "@/components/ui/input";
import { Plus, Search, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SearchDialog() {
  const [search, setSearch] = useState("");
  return (
    <div className="flex w-full flex-col ">
      <div className="flex w-full gap-2 px-2 max-sm:flex-col max-sm:flex-col-reverse">
        <div className="flex relative w-full ">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="search for product"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></Input>
        </div>
        <div className="flex">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Search By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <SearchResults search={search} />
      <div className="flex w-full justify-end px-4">
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button size={"sm"} variant={"secondary"}>
              <Trash />
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button size={"sm"}>
              <Plus /> Add Products
            </Button>
          </DialogClose>
        </div>
      </div>
    </div>
  );
}
