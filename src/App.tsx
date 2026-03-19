import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import HpgVision from "./pages/HpgVision.tsx";
import HpgInitiatives from "./pages/HpgInitiatives.tsx";
import HpgStaff from "./pages/HpgStaff.tsx";
import HpgBoard from "./pages/HpgBoard.tsx";
import HpgSponsorship from "./pages/HpgSponsorship.tsx";
import HpgBlog from "./pages/HpgBlog.tsx";
import GlobalLeadersSummit from "./pages/GlobalLeadersSummit.tsx";
import ContactUs from "./pages/ContactUs.tsx";
import VolunteerApplication from "./pages/VolunteerApplication.tsx";
import SponsorshipApplication from "./pages/SponsorshipApplication.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hpg-vision" element={<HpgVision />} />
          <Route path="/hpg-initiatives" element={<HpgInitiatives />} />
          <Route path="/hpg-staff" element={<HpgStaff />} />
          <Route path="/hpg-board-of-directors" element={<HpgBoard />} />
          <Route path="/hpg-sponsorship" element={<HpgSponsorship />} />
          <Route path="/hpg-blog" element={<HpgBlog />} />
          <Route path="/global-leaders-summit" element={<GlobalLeadersSummit />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/volunteer-application" element={<VolunteerApplication />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
