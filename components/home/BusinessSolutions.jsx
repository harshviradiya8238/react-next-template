import HomeTestimonial from "../carousel/HomeTestimonial";

const BusinessSolutions = () => {
  return (
    <section className="our-journey">
      <div className="overlay pt-120 pb-120">
        <div className="container wow fadeInUp">
          <div className="row justify-content-center">
            <div className="col-xl-9 col-lg-10">
              <div className="section-header text-center">
                <h2 className="sub-title">Testimonials</h2>
                <h4 className="title">
                  Everyone has a story behind. Here’s ours!
                </h4>
                <p>
                  For decades, the clearing of financial transactions remained
                  unchanged and unchallenged.Bankio provide real-time payment
                  and innovative banking services to their customers . Our
                  company timeline
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            {/* Journey Carousel Slider */}
            <HomeTestimonial />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSolutions;
