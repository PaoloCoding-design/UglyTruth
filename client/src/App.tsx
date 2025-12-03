import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Category from "@/pages/category";
import Product from "@/pages/product";
import Search from "@/pages/search";
import PCComponents from "@/pages/pc-components";
import ComponentType from "@/pages/component-type";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pc-components" component={PCComponents} />
      <Route path="/pc-components/:type" component={ComponentType} />
      <Route path="/pc-components/:type/:brand" component={Category} />
      <Route path="/category/:category" component={Category} />
      <Route path="/product/:id" component={Product} />
      <Route path="/search" component={Search} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ugly-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;