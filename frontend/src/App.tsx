import { ThemeProvider } from "@/app/providers/theme-provider";
import { AppRouter } from "@/app/router";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppRouter />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
