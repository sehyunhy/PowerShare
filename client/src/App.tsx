import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import Dashboard from "@/pages/dashboard";
import MapView from "@/pages/map";
import History from "@/pages/history";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import BottomNavigation from "@/components/bottom-navigation";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/map" component={MapView} />
        <Route path="/history" component={History} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
