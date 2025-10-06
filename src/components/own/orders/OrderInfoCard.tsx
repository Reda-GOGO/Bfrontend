import { Calendar } from "@/components/ui/calendar";
import { CalendarPlus } from "lucide-react";

export default function OrderInfoCard() {
  return (
    <div className="flex w-full">
      <div className="flex w-full">
        <div className=" flex flex-col border rounded-lg p-4 justify-center ">
          <CalendarPlus />
          <span>today</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex">{/* <Calendar /> */}</div>
      </div>
    </div>
  );
}
