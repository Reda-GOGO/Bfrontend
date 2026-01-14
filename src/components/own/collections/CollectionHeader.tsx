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
import { ChevronDown, EllipsisVertical, Library, Package } from "lucide-react";
import { useNavigate } from "react-router";
import { TitleLayout } from "@/components/shared/title-layout";
import type { Collection } from "@/types";

export default function CollectionHeader({
  collection,
}: { collection: Collection }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col ">
      <div className="flex w-full justify-end gap-2 py-2">
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"sm"} className="capitalize">
                {isMobile ? (
                  <EllipsisVertical />
                ) : (
                  <>
                    more actions
                    <ChevronDown />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => navigate(`/collections/update/${collection.handle}`)}
            size={"sm"}
            className="capitalize"
          >
            update collection{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}
