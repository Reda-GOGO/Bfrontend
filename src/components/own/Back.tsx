import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function Back({ children }) {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <div className="flex w-full py-2 sticky top-0 z-40 bg-background/70 backdrop-blur-md">
        <span
          className="border rounded-full p-1  w-fit"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft />
        </span>
      </div>
      {children}
    </div>
  );
}
