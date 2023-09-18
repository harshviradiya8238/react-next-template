import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { navData } from "./navData";
import Logo from "/public/images/logo.png";
// import { Button } from "bootstrap";

const NavBar = ({ userLoginData }) => {
  const [windowHeight, setWindowHeight] = useState(0);
  // const [userLoginData, setUserLoginData] = useState("");

  const [newData, setNewData] = useState();

  useEffect(() => {
    // You can also set state in a useEffect block
    console.log(userLoginData, "999999999999999999999");
    if (!userLoginData) {
      if (typeof window !== "undefined") {
        if (localStorage.getItem("user")) {
          var stroge = localStorage.getItem("user");
          if (stroge) {
            var data = JSON.parse(stroge);
            console.log(data, "-=-=-dddddddddddddddddddddddd");
            setNewData(data);
          }
        }
      }
    } else {
      setNewData(userLoginData);
    }
  }, [userLoginData]);
  console.log(newData);
  // useEffect(() => {
  //   if (newData == "undefined") {
  //     if (typeof window !== "undefined") {
  //       if (localStorage.getItem("user")) {
  //         var stroge = localStorage.getItem("user");
  //         if (stroge) {
  //           var data = JSON.parse(stroge);
  //           console.log(data, "-=-=-dddddddddddddddddddddddd");
  //           setNewData(data);
  //         }
  //       }
  //     }
  //   }
  // }, []);
  const menus = useRef();

  const hidenMenu = () => {
    menus.current.classList.remove("show");
  };

  const navBarTop = () => {
    if (window !== undefined) {
      let height = window.scrollY;
      setWindowHeight(height);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", navBarTop);
    return () => {
      window.removeEventListener("scroll", navBarTop);
    };
  }, []);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const handleStroageChange = (event) => {
  //       if (event.key === "user") {
  //         console.log("data2323333333333333333333333333baaar");

  //         console.log("fjdkfd", event.newValue);
  //         if (event.newValue) {
  //           var data = JSON.parse(event.newValue);
  //           console.log("data2323333333333333333333333333", data);
  //           setUserLoginData(data);
  //         } else {
  //           setUserLoginData("");
  //         }
  //       }
  //     };
  //     window.addEventListener("storage", handleStroageChange);
  //     if (localStorage.getItem("user")) {
  //       var stroge = localStorage.getItem("user");
  //       if (stroge) {
  //         var data = JSON.parse(stroge);
  //         setUserLoginData(data);
  //       }
  //     }

  //     return () => {
  //       window.removeEventListener("storage", handleStroageChange);
  //     };
  //   }
  // }, []);

  return (
    <header
      className={`header-section ${
        windowHeight > 50 && "header-fixed animated fadeInDown"
      }`}
    >
      <div className="overlay">
        <div className="container">
          <div className="row d-flex header-area">
            <nav className="navbar navbar-expand-lg navbar-light">
              {/* <Link className="navbar-brand" href="/" onClick={hidenMenu}>
                <Image src={Logo} className="logo" alt="logo" />
              </Link> */}
              <button
                className="navbar-toggler collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbar-content"
              >
                <i>
                  <FaBars />
                </i>
              </button>
              <div
                className="collapse navbar-collapse justify-content-end"
                id="navbar-content"
                ref={menus}
              >
                <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
                  {navData.map(({ itm, url, id, dropdown, dropdown_itms }) => {
                    return !dropdown ? (
                      <li key={id} className="nav-item">
                        <Link
                          className="nav-link"
                          aria-current="page"
                          href={url}
                          onClick={hidenMenu}
                        >
                          {itm}
                        </Link>
                      </li>
                    ) : (
                      <li key={id} className="nav-item dropdown main-navbar">
                        <Link
                          className="nav-link dropdown-toggle"
                          href="/"
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="outside"
                        >
                          {itm}
                        </Link>
                        <ul className="dropdown-menu main-menu shadow">
                          {dropdown_itms?.map(
                            ({ id, dp_itm, url, sbu_dropdown, sub_items }) =>
                              !sbu_dropdown ? (
                                <li key={id}>
                                  <Link
                                    className="nav-link"
                                    href={url}
                                    onClick={hidenMenu}
                                  >
                                    {dp_itm}
                                  </Link>
                                </li>
                              ) : (
                                <li key={id} className="dropend sub-navbar">
                                  <Link
                                    href="/"
                                    className="dropdown-item dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    data-bs-auto-close="outside"
                                  >
                                    {dp_itm}
                                  </Link>
                                  <ul className="dropdown-menu sub-menu shadow">
                                    {sub_items?.map(({ id, url, sub_itm }) => (
                                      <li key={id}>
                                        <Link
                                          className="nav-link"
                                          href={url}
                                          onClick={hidenMenu}
                                        >
                                          {sub_itm}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              )
                          )}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
                <div className="right-area header-action d-flex align-items-center m-0">
                  {newData ? (
                    <>
                      <ul className="navbar-nav mr-auto mb-2 mb-lg-0 me-5">
                        <li className="nav-item">
                          <Link href="/userDashBoard" className="nav-link">
                            Dashboard
                          </Link>
                        </li>
                      </ul>
                      <div className="login_Name">
                        {newData.firstName} {newData.lastName}
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="cmn-btn me-3"
                        onClick={hidenMenu}
                      >
                        Login
                      </Link>
                      <Link
                        href="/registerApplication"
                        className="cmn-btn "
                        onClick={hidenMenu}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
