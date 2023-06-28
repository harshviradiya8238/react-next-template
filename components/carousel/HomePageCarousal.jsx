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
      <Carousel activeIndex={index} onSelect={handleSelect}>
        {bootstrap.map((item) => (
          <Carousel.Item key={item.id} interval={4000}>
            <img src={item.imageUrl} alt="slides" />
            <Carousel.Caption>
              <h1 style={{ color: "white" }}>{item.title}</h1>
              <p style={{ color: "white" }}>{item.body}</p>
              <button className="btn btn-danger">Visit Docs</button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      {/* <MDBCarousel showIndicators showControls fade>
        <MDBCarouselItem
          className="w-100 d-block"
          itemId={1}
          src="/images/img1.jpg"
          alt="..."
          style={{ minHeight: "90vh" }}
        >
          <div></div>
          <h1 style={{ color: "white" }}>Loan With Great Rates 11%</h1>
          <p style={{ color: "white" }}>
            Nulla vitae elit libero, a pharetra augue mollis interdum.
          </p>
        </MDBCarouselItem>

        <MDBCarouselItem
          className="w-100 d-block"
          itemId={2}
          src="/images/img2.jpg"
          alt="..."
          style={{ minHeight: "90vh" }}
        >
          <h1 style={{ color: "white" }}>Loan With Great Rates 11%</h1>
          <p style={{ color: "white" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </MDBCarouselItem>

        <MDBCarouselItem
          className="w-100 d-block"
          itemId={3}
          src="/images/img3.jpg"
          alt="..."
          style={{ minHeight: "90vh" }}
        >
          <h1 style={{ color: "white" }}>Loan With Great Rates 11%</h1>
          <p style={{ color: "white" }}>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </MDBCarouselItem>
      </MDBCarousel> */}
    </>
  );
}

export default HomePageCarousal;
