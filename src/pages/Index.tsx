import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import WhoWeAre from "@/components/WhoWeAre";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroCarousel />
      <WhoWeAre />
      <Footer />
    </div>
  );
};

export default Index;
