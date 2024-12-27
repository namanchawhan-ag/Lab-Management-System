import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./App.css";
import Navbar from "./my_components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import { ErrorFallback } from "./utils/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { StrictMode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function AppContent() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Navbar />
      <main className="py-4 px-4 md:px-12 lg:px-20">
        <Home />
      </main>
    </ErrorBoundary>
  );
}

const queryClient = new QueryClient();

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
