import Link from "next/link";
import Partners from "./Partners";
import JourneyCarousel from "../carousel/JourneyCarousel";
import HomePageCarousel from "../carousel/HomePageCarousal.jsx";

const HomeBanner = () => {
  return (
    <section className="banner-section">
      <div>
        <HomePageCarousel />
      </div>
    </section>
  );
};

export default HomeBanner;
