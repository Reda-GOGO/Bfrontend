import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ChevronDown, EllipsisVertical, Library, Package } from "lucide-react";
import { useNavigate } from "react-router";
import { TitleLayout } from "@/components/shared/title-layout";

export default function CollectionsHeader() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col ">
      <div className="flex w-full justify-between gap-2 py-2">
        <TitleLayout title="Collections" icon={<Library />} />
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
            onClick={() => navigate("/collections/create")}
            size={"sm"}
            className="capitalize"
          >
            create collection{" "}
          </Button>
        </div>
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Collections Catalog
        </h1>
        <p className="text-sm text-muted-foreground">
          Create, edit, and manage your collections for products in your store .
        </p>
      </div>
    </div>
  );
}
