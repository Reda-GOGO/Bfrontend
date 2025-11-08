import { OrderProvider } from "./orderContext.tsx";
import { AuthProvider } from "./userContext.tsx";

export function AppProvider({ children }: ReactNode) {
  return (
    <AuthProvider>
      <OrderProvider>{children}</OrderProvider>
    </AuthProvider>
  );
}
