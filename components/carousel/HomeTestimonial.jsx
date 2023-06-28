import Image from "next/image";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Slider from "react-slick";
import { journey_carousel_data } from "./carouselData";
import Link from "next/link";
// import arrow_right from "/public/images/icon/arrow_right";

// Import css files
import "slick-carousel/slick/slick.css";
import { business_solutions_data } from "../home/homeData";

const Next = ({ onClick }) => {
  return (
    <button
      type="button"
      className="slick-arrow slick-prev pull-left"
      onClick={onClick}
    >
      <i>
        <BsChevronLeft />
      </i>
    </button>
  );
};

const Prev = ({ onClick }) => {
  return (
    <button
      type="button"
      className="slick-arrow slick-next pull-right"
      onClick={onClick}
    >
      <i>
        <BsChevronRight />
      </i>
    </button>
  );
};

const HomeTestimonial = () => {
  const settings = {
    infinite: true,
    autoplay: false,
    focusOnSelect: false,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <Next />,
    nextArrow: <Prev />,
    dots: false,
    dotsClass: "section-dots",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };
  return (
    <Slider {...settings} className="journey-carousel">
      {journey_carousel_data.map((itm, i) => (
        // <div style={{ margin: "2px" }}>
        //   <div className="single-box text-center">
        //     <div className="thumb d-flex justify-content-center align-items-center">
        //       <Image src={itm?.icon} alt="checking" />
        //     </div>
        //     <div className="content">
        //       <h5>{itm?.title}</h5>
        //       <p>{itm?.desc}</p>
        //       <Link href={itm?.link} className="btn-arrow">
        //         Open Account
        //         <Image src={BsChevronRight} alt="arrow" />
        //       </Link>
        //     </div>
        //   </div>
        // </div>

        <div key={itm.id} className="single">
          <div className="single-box">
            <div className="top-box d-flex align-items-center flex-column">
              <div className="icon-box">
                <Image src={itm.src} alt="icon" height={200} width={200} />
              </div>
              <h4>{itm.name}</h4>
            </div>
            <div className="text-box">
              <p>{itm.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default HomeTestimonial;
