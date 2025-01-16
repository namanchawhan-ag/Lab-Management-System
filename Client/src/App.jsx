import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import { ErrorFallback } from "./utils/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { StrictMode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/toaster";

function AppContent() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Toaster />
      <Navbar />
      {/* md:px-12 lg:px-20 */}
      <main className="py-2 px-4 ">
        <Home />
      </main>
    </ErrorBoundary>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 24,
    },
  },
});

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
