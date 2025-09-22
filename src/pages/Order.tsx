import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";

export default function Order() {
  const navigate = useNavigate();
  const addOrder = (e: Event) => {
    e.preventDefault();
    navigate("/orders/create");
  };
  return (
    <div className="flex w-full h-full">
      <div className="flex w-full max-md:flex-col gap-2 relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="text"></Input>
        <div className="flex gap-1 max-md:w-full max-md:flex-col">
          <Button
            onClick={(e) => addOrder(e)}
            size={"sm"}
            variant={"outline"}
            className="max-md:w-full"
          >
            Create new Order
          </Button>
          <Button size={"sm"} className="max-md:w-full">
            More Action
          </Button>
        </div>
      </div>
    </div>
  );
}
