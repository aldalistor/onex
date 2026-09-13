import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import WindowWorkbench from "./pages/WindowWorkbench";
import SystemSetup from "./pages/SystemSetup";

function Router() {
  return <Switch><Route path="/" component={WindowWorkbench} /><Route path="/home" component={Home} /><Route path="/workbench" component={WindowWorkbench} /><Route path="/setup" component={SystemSetup} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
