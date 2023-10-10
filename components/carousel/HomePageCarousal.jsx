import React from "react";
// import { MDBCarousel, MDBCarouselItem } from "mdb-react-ui-kit";
import { useState } from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
// import styles from "../styles/Bootstrap.module.css";

//public/Items.json

const bootstrap = [
  {
    id: 1,
    title: "Home Loan",
    body: "Loan With Great Rates 11%",
    imageUrl: "/images/img1.jpg",
    docs: "https://getbootstrap.com/docs/4.0/components/carousel/",
  },
  {
    id: 2,
    title: "Car Loan",
    body: "Loan With Great Rates 11%",
    imageUrl: "/images/img2.jpg",
    docs: "https://getbootstrap.com/docs/4.0/components/carousel/",
  },
  {
    id: 3,
    title: "Personal Loan",
    body: "Loan With Great Rates 11%",
    imageUrl: "/images/img3.jpg",
    docs: "https://getbootstrap.com/docs/4.0/components/carousel/",
  },
  {
    id: 4,
    title: "Home Loan",
    body: "Loan With Great Rates 11%",
    imageUrl: "/images/img4.jpg",
    docs: "https://getbootstrap.com/docs/4.0/components/carousel/",
  },
];

function HomePageCarousal() {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  return (
    <>
      <div>
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {bootstrap.map((item) => (
            <Carousel.Item key={item.id} interval={4000}>
              <img src={item.imageUrl} alt="slides" className="homeCarousel" />
              <Carousel.Caption>
                <h1 className="text-white">{item.title}</h1>
                <p className="text-white">{item.body}</p>
                <button className="btn btn-danger">Visit Docs</button>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </>
  );
}

export default HomePageCarousal;
