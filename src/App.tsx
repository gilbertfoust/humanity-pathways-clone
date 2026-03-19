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
import GYLFH from "./pages/initiatives/GYLFH.tsx";
import NazareneMission from "./pages/initiatives/NazareneMission.tsx";
import MegaBridgeKenya from "./pages/initiatives/MegaBridgeKenya.tsx";
import SanteVieMeilleure from "./pages/initiatives/SanteVieMeilleure.tsx";
import CUBACongo from "./pages/initiatives/CUBACongo.tsx";
import TriumphantPhilippines from "./pages/initiatives/TriumphantPhilippines.tsx";
import ProjectWings from "./pages/initiatives/ProjectWings.tsx";
import HopeForAGoodLife from "./pages/initiatives/HopeForAGoodLife.tsx";
import SeishinPlus from "./pages/initiatives/SeishinPlus.tsx";
import CPBI from "./pages/initiatives/CPBI.tsx";
import HpgExecutiveAcademy from "./pages/initiatives/HpgExecutiveAcademy.tsx";

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
          <Route path="/sponsorship-application" element={<SponsorshipApplication />} />
          <Route path="/gylfh" element={<GYLFH />} />
          <Route path="/nazarene-mission" element={<NazareneMission />} />
          <Route path="/megabridge-kenya" element={<MegaBridgeKenya />} />
          <Route path="/sante-vie-meilleure" element={<SanteVieMeilleure />} />
          <Route path="/cuba-congo" element={<CUBACongo />} />
          <Route path="/triumphant-philippines" element={<TriumphantPhilippines />} />
          <Route path="/project-wings" element={<ProjectWings />} />
          <Route path="/hope-for-a-good-life" element={<HopeForAGoodLife />} />
          <Route path="/seishin-plus" element={<SeishinPlus />} />
          <Route path="/cpbi" element={<CPBI />} />
          <Route path="/hpg-executive-academy" element={<HpgExecutiveAcademy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
