import ArticleCard from "../cards/ArticleCard";
import { articles_data } from "./homeData";

const LatestArticles = () => {
  return (
    <section className="latest-articles">
      <div className="overlay pt-120 pb-120">
        <div className="container wow fadeInUp">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-lg-6">
              <div className="section-header text-center">
                <h5 className="sub-title">Latest insights from Bankio</h5>
                <h2 className="title">Total Counters</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
                  quaerat debitis nemo, voluptate incidunt beatae quo non
                  repudiandae perferendis cumque enim commodi voluptates odio
                  veritatis tenetur optio voluptatem laudantium nobis? ...
                </p>
              </div>
            </div>
          </div>
          <div className="row cus-mar">
            <div className="col-xl-4 col-md-4">
              <div
                className="count-content text-center d-flex justify-content-center align-items-center flex-column"
                style={{
                  background: "var(--body-color)",
                  boxShadow: " 0px 12px 24px rgba(47, 65, 129, 0.1)",
                  borderRadius: "10px",
                  height: "200px",
                }}
              >
                <div className="count-number">
                  <h4 className="counter">98 %</h4>
                  {/* <h4 className="static">%</h4> */}
                </div>
                <p>Customer satisfaction</p>
              </div>
            </div>
            <div className="col-xl-4 col-md-4">
              <div
                className="count-content text-center d-flex justify-content-center align-items-center flex-column"
                style={{
                  background: "var(--body-color)",
                  boxShadow: " 0px 12px 24px rgba(47, 65, 129, 0.1)",
                  borderRadius: "10px",
                  height: "200px",
                }}
              >
                <div className="count-number ">
                  <h4 className="counter">250 M</h4>
                  {/* <h4 className="static">M</h4> */}
                </div>
                <p>Monthly active users</p>
              </div>
            </div>
            <div className="col-xl-4 col-md-4">
              <div
                className="count-content text-center d-flex justify-content-center align-items-center flex-column"
                style={{
                  background: "var(--body-color)",
                  boxShadow: " 0px 12px 24px rgba(47, 65, 129, 0.1)",
                  borderRadius: "10px",
                  height: "200px",
                }}
              >
                <div className="count-number ">
                  <h4 className="counter">100 K</h4>
                  {/* <h4 className="static">k</h4> */}
                </div>
                <p>New Users per week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;
