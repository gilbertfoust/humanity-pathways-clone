import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import WhoWeAre from "@/components/WhoWeAre";
import VolunteerCTA from "@/components/VolunteerCTA";
import FiscalSponsorship from "@/components/FiscalSponsorship";
import DonateSection from "@/components/DonateSection";
import SubscribeForm from "@/components/SubscribeForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroCarousel />
      <WhoWeAre />
      <VolunteerCTA />
      <FiscalSponsorship />
      <DonateSection />
      <SubscribeForm />
      <Footer />
    </div>
  );
};

export default Index;
