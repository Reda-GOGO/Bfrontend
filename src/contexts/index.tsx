import { OrderProvider } from "./orderContext.tsx";
import { ThemeProvider } from "./themeContext.tsx";
import { AuthProvider } from "./userContext.tsx";

export function AppProvider({ children }: ReactNode) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <OrderProvider>{children}</OrderProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
