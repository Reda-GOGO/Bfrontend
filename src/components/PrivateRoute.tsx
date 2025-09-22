import { Navigate, Outlet } from "react-router";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/userContext";
import { useEffect } from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn("flex items-center justify-center h-screen", className)}
      {...props}
    >
      <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
    </div>
  );
}
export const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};
