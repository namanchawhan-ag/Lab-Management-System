import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import { ErrorFallback } from "./utils/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { StrictMode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function AppContent() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
              </>
            } />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
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
