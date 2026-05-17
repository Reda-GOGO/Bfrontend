import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ChevronDown, EllipsisVertical, Library, Package, RefreshCw, Tag } from "lucide-react";
import { useNavigate } from "react-router";
import { TitleLayout } from "@/components/shared/title-layout";
import type { Collection } from "@/types";

export default function CollectionHeader({
  collection,
}: { collection: Collection }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const navigate = useNavigate();
  return (
    <div className="hea w-full flex flex-col ">
      <div className="flex w-full justify-end gap-2 py-2">
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"sm"} className="capitalize">
                {isMobile ? (
                  <EllipsisVertical />
                ) : (
                  <>
                    <EllipsisVertical />
                    Actions
                    <ChevronDown />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                Collection Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm gap-2">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh data
              </DropdownMenuItem>
              {/* <DropdownMenuItem className="text-sm gap-2"> */}
              {/*   <Tag className="w-3.5 h-3.5" /> Apply discount */}
              {/* </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm text-destructive hover:text-destructive gap-2">
                <Package className="w-3.5 h-3.5 text-destructive" />
                <span className="text-destructive hover:text-destructive" >
                  Archive collection
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => navigate(`/collections/update/${collection.handle}`)}
            size={"sm"}
            className="capitalize"
          // disabled
          >
            update collection{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}



