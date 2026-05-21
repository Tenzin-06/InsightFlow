import { QueryProvider } from "@/app/providers/query-provider";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { AuthTokenProvider } from "@/app/providers/auth-token-provider";
import { AppRouter } from "@/app/router";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthTokenProvider>
          <AppRouter />
          <Toaster />
        </AuthTokenProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
