/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useContext, useRef, useState } from "react";
import Link from "next/link";

import { StyleClass } from "primereact/styleclass";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { Divider } from "primereact/divider";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { NodeRef } from "@/types";
import { classNames } from "primereact/utils";

const Homepage = () => {
  const [isHidden, setIsHidden] = useState(false);
  const menuRef = useRef<HTMLElement | null>(null);

  const toggleMenuItemClick = () => {
    setIsHidden((prevState) => !prevState);
  };

  const { layoutConfig } = useContext(LayoutContext);

  return (
    <div className="surface-0 flex justify-content-center">
      <div id="home" className="landing-wrapper overflow-hidden">
        <div
          id="topmenu"
          className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static"
        >
          <Link href="/" className="flex align-items-center">
            <img
              src={`/layout/images/${
                layoutConfig.colorScheme === "light" ? "logo-dark" : "logo-white"
              }.svg`}
              alt="Taskify me Logo"
              height="50"
              className="mr-0 lg:mr-2"
            />
            <span className="text-900 font-medium text-2xl line-height-3 mr-8">
              <span className="text-indigo-500">TASKIFY</span>me
            </span>
          </Link>
          <StyleClass
            nodeRef={menuRef as NodeRef}
            selector="@next"
            enterClassName="hidden"
            leaveToClassName="hidden"
            hideOnOutsideClick
          >
            <i
              ref={menuRef}
              className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"
            ></i>
          </StyleClass>
          <div
            className={classNames(
              "align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2",
              { hidden: isHidden }
            )}
            style={{ top: "100%" }}
          >
            <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
              <li>
                <a
                  href="#home"
                  onClick={toggleMenuItemClick}
                  className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"
                >
                  <span>Home</span>
                  <Ripple />
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={toggleMenuItemClick}
                  className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"
                >
                  <span>Features</span>
                  <Ripple />
                </a>
              </li>
              <li>
                <a
                  href="#highlights"
                  onClick={toggleMenuItemClick}
                  className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"
                >
                  <span>Highlights</span>
                  <Ripple />
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={toggleMenuItemClick}
                  className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3"
                >
                  <span>Pricing</span>
                  <Ripple />
                </a>
              </li>
            </ul>
            <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
              <Link href="/auth/login">
                <Button
                  label="Login"
                  text
                  rounded
                  className="border-none font-light line-height-2 text-blue-500"
                ></Button>
              </Link>
              <Button
                label="Register"
                rounded
                className="border-none ml-5 font-light line-height-2 bg-blue-500 text-white"
              ></Button>
            </div>
          </div>
        </div>

        <div
          id="hero"
          className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
          style={{
            background:
              "linear-gradient(0deg, rgba(236, 72, 153, 0.2), rgba(6,182,212, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EC4899 0%, #06B6D4 100%)",
            clipPath: "ellipse(150% 87% at 93% 13%)",
            height: "300 px",
          }}
        >
          <div id="hero-txt" className="flex flex-col justify-center">
            <div className="mx-4 md:mx-8 mt-10 md:mt-4">
              <h1
                className="text-6xl font-bold text-gray-100 line-height-2"
                style={{ marginTop: "30px" }}
              >
                <span className="font-light block">Voice Your Tasks</span>Into Action!
              </h1>
              <p className="font-normal text-2xl line-height-3 md:mt-3 text-gray-200 width">
                Take control of your time with Taskify Me!<br></br>
                Plan, organize, and track your<br></br>
                tasks effortlessly.
              </p>
              <Button
                type="button"
                label="Get Started"
                rounded
                className="text-xl border-none mt-3 bg-blue-500 font-normal line-height-3 px-3 text-white"
              ></Button>
            </div>
          </div>
          <div
            className="flex justify-content-center md:justify-content-end"
            style={{ marginTop: "-200px" }}
          >
            <img
              src="/images/home/screen-1.png"
              alt="Hero Image"
              className="w-9 md:w-auto"
              // height="600"
            />
          </div>
        </div>

        <div id="features" className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
          <div className="grid justify-content-center">
            {/* <div className="col-12 text-center mt-8 mb-4">
              <h2 className="text-900 font-normal mb-2">Marvelous Features</h2>
              <span className="text-600 text-2xl">Placerat in egestas erat...</span>
            </div> */}

            <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
              <div
                style={{
                  height: "160px",
                  padding: "2px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))",
                }}
              >
                <div className="p-3 surface-card h-full" style={{ borderRadius: "8px" }}>
                  <div
                    className="flex align-items-center justify-content-center bg-pink-500 mb-3"
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "10px",
                    }}
                  >
                    <i className="pi pi-fw pi-th-large text-2xl text-pink-100"></i>
                  </div>
                  <h5 className="mb-2 text-900">Intuitive Interface</h5>
                  <span className="text-600">Easily manage your to-dos and deadlines.</span>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
              <div
                style={{
                  height: "160px",
                  padding: "2px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgba(145,226,237,0.2),rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))",
                }}
              >
                <div className="p-3 surface-card h-full" style={{ borderRadius: "8px" }}>
                  <div
                    className="flex align-items-center justify-content-center bg-primary-500 mb-3"
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "10px",
                    }}
                  >
                    <i className="pi pi-fw pi-pencil text-2xl text-primary-100"></i>
                  </div>
                  <h5 className="mb-2 text-900">Smart Reminders</h5>
                  <span className="text-600">Never forget an important task again.</span>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0">
              <div
                style={{
                  height: "160px",
                  padding: "2px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))",
                }}
              >
                <div className="p-3 surface-card h-full" style={{ borderRadius: "8px" }}>
                  <div
                    className="flex align-items-center justify-content-center bg-indigo-600"
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "10px",
                    }}
                  >
                    <i className="pi pi-fw pi-sliders-h text-2xl text-indigo-100"></i>
                  </div>
                  <h5 className="mb-2 text-900">Customization</h5>
                  <span className="text-600">Tailor the app to fit your needs and work style.</span>
                </div>
              </div>
            </div>
            {/* 
            <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
              <div
                style={{
                  height: "160px",
                  padding: "2px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgba(187, 199, 205, 0.2),rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2),rgba(145, 210, 204, 0.2))",
                }}
              >
                <div className="p-3 surface-card h-full" style={{ borderRadius: "8px" }}>
                  <div
                    className="flex align-items-center justify-content-center bg-bluegray-200 mb-3"
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "10px",
                    }}
                  >
                    <i className="pi pi-fw pi-id-card text-2xl text-bluegray-700"></i>
                  </div>
                  <h5 className="mb-2 text-900">Responsive Layout</h5>
                  <span className="text-600">Nulla malesuada pellentesque elit.</span>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
              <div
                style={{
                  height: "160px",
                  padding: "2px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgba(187, 199, 205, 0.2),rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(145, 226, 237, 0.2),rgba(160, 210, 250, 0.2))",
                }}
              >
                <div className="p-3 surface-card h-full" style={{ borderRadius: "8px" }}>
                  <div
                    className="flex align-items-center justify-content-center bg-orange-200 mb-3"
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "10px",
                    }}
                  >
                    <i className="pi pi-fw pi-star text-2xl text-orange-700"></i>
                  </div>
                  <h5 className="mb-2 text-900">Clean Code</h5>
                  <span className="text-600">Condimentum lacinia quis vel eros.</span>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0">
              <div
                style={{
                  height: "160px",
                  padding: "2px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(212, 162, 221, 0.2))",
                }}
              >
                <div className="p-3 surface-card h-full" style={{ borderRadius: "8px" }}>
                  <div
                    className="flex align-items-center justify-content-center bg-pink-200 mb-3"
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "10px",
                    }}
                  >
                    <i className="pi pi-fw pi-moon text-2xl text-pink-700"></i>
                  </div>
                  <h5 className="mb-2 text-900">Dark Mode</h5>
                  <span className="text-600">Convallis tellus id interdum velit laoreet.</span>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 mt-4 lg:mt-0">
              <div
                style={{
                  height: "160px",
                  padding: "2px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(160, 210, 250, 0.2)), linear-gradient(180deg, rgba(187, 199, 205, 0.2), rgba(145, 210, 204, 0.2))",
                }}
              >
                <div className="p-3 surface-card h-full" style={{ borderRadius: "8px" }}>
                  <div
                    className="flex align-items-center justify-content-center bg-teal-200 mb-3"
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "10px",
                    }}
                  >
                    <i className="pi pi-fw pi-shopping-cart text-2xl text-teal-700"></i>
                  </div>
                  <h5 className="mb-2 text-900">Ready to Use</h5>
                  <span className="text-600">Mauris sit amet massa vitae.</span>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 mt-4 lg:mt-0">
              <div
                style={{
                  height: "160px",
                  padding: "2px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))",
                }}
              >
                <div className="p-3 surface-card h-full" style={{ borderRadius: "8px" }}>
                  <div
                    className="flex align-items-center justify-content-center bg-blue-200 mb-3"
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "10px",
                    }}
                  >
                    <i className="pi pi-fw pi-globe text-2xl text-blue-700"></i>
                  </div>
                  <h5 className="mb-2 text-900">Modern Practices</h5>
                  <span className="text-600">Elementum nibh tellus molestie nunc non.</span>
                </div>
              </div>
            </div>

            <div className="col-12 md:col-12 lg:col-4 p-0 lg-4 mt-4 lg:mt-0">
              <div
                style={{
                  height: "160px",
                  padding: "2px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(90deg, rgba(160, 210, 250, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(246, 158, 188, 0.2), rgba(212, 162, 221, 0.2))",
                }}
              >
                <div className="p-3 surface-card h-full" style={{ borderRadius: "8px" }}>
                  <div
                    className="flex align-items-center justify-content-center bg-purple-200 mb-3"
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "10px",
                    }}
                  >
                    <i className="pi pi-fw pi-eye text-2xl text-purple-700"></i>
                  </div>
                  <h5 className="mb-2 text-900">Privacy</h5>
                  <span className="text-600">Neque egestas congue quisque.</span>
                </div>
              </div>
            </div> */}

            <div
              className="col-12 mt-8 mb-8 p-2 md:p-8"
              style={{
                borderRadius: "20px",
                background: "linear-gradient(90deg, #06B6D4, #5457CD)",
              }}
            >
              <div className="flex flex-column justify-content-center align-items-center text-center px-3 py-3 md:py-0">
                <h3 className="text-gray-200 mb-2">Joséphine Miller</h3>
                <span className="text-gray-300 text-2xl">app user</span>
                <p
                  className="text-gray-200 sm:line-height-2 md:line-height-4 text-2xl mt-4"
                  style={{ maxWidth: "800px" }}
                >
                  “Taskify Me is a game-changer for anyone looking to boost productivity. Its
                  intuitive interface makes managing tasks simple and stress-free. The customizable
                  features, like smart reminders and personalized task categories, help keep
                  everything organized.”
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="highlights" className="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
          {/* <div className="text-center">
            <h2 className="text-900 font-normal mb-2">Powerful Everywhere</h2>
            <span className="text-600 text-2xl">Amet consectetur adipiscing elit...</span>
          </div> */}

          <div className="grid mt-8 pb-2 md:pb-8">
            <div
              className="flex justify-content-end col-12 lg:col-6 bg-pink-500 flex-order-1 lg:flex-order-0"
              style={{ borderRadius: "8px", marginRight: "5%", paddingTop: "15%" }}
            >
              <img
                src="/images/home/mockup.png"
                className="w-11"
                alt="mockup mobile"
                style={{ marginRight: "-15%", marginBottom: "-15%" }}
              />
            </div>

            <div className="col-12 lg:col-5 my-auto flex flex-column lg:align-items-end text-center lg:text-right">
              <div
                className="flex align-items-center justify-content-center bg-pink-500 align-self-center lg:align-self-end"
                style={{
                  width: "4.2rem",
                  height: "4.2rem",
                  borderRadius: "10px",
                }}
              >
                <i className="pi pi-fw pi-desktop text-5xl text-indigo-100"></i>
              </div>
              <h2 className="line-height-1 text-900 text-4xl font-normal">Smart Reminders</h2>
              <span
                className="text-700 text-2xl line-height-3 ml-0 md:ml-2"
                style={{ maxWidth: "650px" }}
              >
                <p>Never miss a deadline with Taskify Me's Smart Reminders.</p>

                <p>
                  This feature allows you to set custom notifications for each task, ensuring you're
                  always reminded at the right time.
                </p>
                <p>
                  Whether it’s a daily to-do or a one-time project, Smart Reminders keep you on
                  track and reduce the chances of forgetting important tasks.
                </p>
              </span>
            </div>
          </div>

          <div className="grid my-8 pt-2 md:pt-8">
            <div className="col-12 lg:col-6 my-auto flex flex-column text-center lg:text-left lg:align-items-start">
              <div
                className="flex align-items-center justify-content-center bg-primary-500 align-self-center lg:align-self-start"
                style={{
                  width: "4.2rem",
                  height: "4.2rem",
                  borderRadius: "10px",
                }}
              >
                <i className="pi pi-fw pi-pencil text-5xl text-pink-100"></i>
              </div>
              <h2 className="line-height-1 text-900 text-4xl font-normal">Customization</h2>
              <span
                className="text-700 text-2xl line-height-3 mr-0 md:mr-2"
                style={{ maxWidth: "650px" }}
              >
                {" "}
                <p>
                  Tailor Taskify Me to fit your unique workflow with our powerful customization
                  options.
                </p>
                <p>
                  From personalized task categories to color-coded labels, you can organize your
                  to-dos in a way that suits your style.
                </p>
                <p>
                  Adjust layouts, set custom priorities, and even choose how your reminders
                  appear—making Taskify Me truly your own personal productivity tool.
                </p>
              </span>
            </div>

            <div
              className="flex justify-content-center  flex-order-1 sm:flex-order-2 col-12 lg:col-6 bg-primary-500"
              style={{
                borderRadius: "8px",
                alignItems: "flex-end",
                paddingRight: "5%",
                paddingLeft: "5%",
              }}
            >
              <img
                src="/images/home/mockup-tablet.png"
                className="w-11 align-bottom"
                alt="mockup"
                style={{
                  maxHeight: "95%",
                  marginBottom: "-10%",
                }}
              />
            </div>
          </div>
        </div>
        {/* 
        <div id="pricing" className="py-4 px-4 lg:px-8 my-2 md:my-4">
          <div className="text-center">
            <h2 className="text-900 font-normal mb-2">Matchless Pricing</h2>
            <span className="text-600 text-2xl">Amet consectetur adipiscing elit...</span>
          </div>

          <div className="grid justify-content-between mt-8 md:mt-0">
            <div className="col-12 lg:col-4 p-0 md:p-3">
              <div className="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all">
                <h3 className="text-900 text-center my-5">Free</h3>
                <img src="/images/landing/free.svg" className="w-10 h-10 mx-auto" alt="free" />
                <div className="my-5 text-center">
                  <span className="text-5xl font-bold mr-2 text-900">$0</span>
                  <span className="text-600">per month</span>
                  <Button
                    label="Get Started"
                    rounded
                    className="block mx-auto mt-4 border-none ml-3 font-light line-height-2 bg-blue-500 text-white"
                  ></Button>
                </div>
                <Divider className="w-full bg-surface-200"></Divider>
                <ul className="my-5 list-none p-0 flex text-900 flex-column">
                  <li className="py-2">
                    <i className="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                    <span className="text-xl line-height-3">Responsive Layout</span>
                  </li>
                  <li className="py-2">
                    <i className="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                    <span className="text-xl line-height-3">Unlimited Push Messages</span>
                  </li>
                  <li className="py-2">
                    <i className="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                    <span className="text-xl line-height-3">50 Support Ticket</span>
                  </li>
                  <li className="py-2">
                    <i className="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                    <span className="text-xl line-height-3">Free Shipping</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-12 lg:col-4 p-0 md:p-3 mt-4 md:mt-0">
              <div className="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all">
                <h3 className="text-900 text-center my-5">Startup</h3>
                <img
                  src="/images/landing/startup.svg"
                  className="w-10 h-10 mx-auto"
                  alt="startup"
                />
                <div className="my-5 text-center">
                  <span className="text-5xl font-bold mr-2 text-900">$1</span>
                  <span className="text-600">per month</span>
                  <Button
                    label="Try Free"
                    rounded
                    className="block mx-auto mt-4 border-none ml-3 font-light line-height-2 bg-blue-500 text-white"
                  ></Button>
                </div>
                <Divider className="w-full bg-surface-200"></Divider>
                <ul className="my-5 list-none p-0 flex text-900 flex-column">
                  <li className="py-2">
                    <i className="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                    <span className="text-xl line-height-3">Responsive Layout</span>
                  </li>
                  <li className="py-2">
                    <i className="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                    <span className="text-xl line-height-3">Unlimited Push Messages</span>
                  </li>
                  <li className="py-2">
                    <i className="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                    <span className="text-xl line-height-3">50 Support Ticket</span>
                  </li>
                  <li className="py-2">
                    <i className="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                    <span className="text-xl line-height-3">Free Shipping</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-12 lg:col-4 p-0 md:p-3 mt-4 md:mt-0">
              <div className="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all">
                <h3 className="text-900 text-center my-5">Enterprise</h3>
                <img
                  src="/images/landing/enterprise.svg"
                  className="w-10 h-10 mx-auto"
                  alt="enterprise"
                />
                <div className="my-5 text-center">
                  <span className="text-5xl font-bold mr-2 text-900">$999</span>
                  <span className="text-600">per month</span>
                  <Button
                    label="Get a Quote"
                    rounded
                    className="block mx-auto mt-4 border-none ml-3 font-light line-height-2 bg-blue-500 text-white"
                  ></Button>
                </div>
                <Divider className="w-full bg-surface-200"></Divider>
                <ul className="my-5 list-none p-0 flex text-900 flex-column">
                  <li className="py-2">
                    <i className="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                    <span className="text-xl line-height-3">Responsive Layout</span>
                  </li>
                  <li className="py-2">
                    <i className="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                    <span className="text-xl line-height-3">Unlimited Push Messages</span>
                  </li>
                  <li className="py-2">
                    <i className="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                    <span className="text-xl line-height-3">50 Support Ticket</span>
                  </li>
                  <li className="py-2">
                    <i className="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                    <span className="text-xl line-height-3">Free Shipping</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="py-4 px-4 mx-0 mt-8 lg:mx-8">
          <div className="grid justify-content-between">
            <div className="col-12 md:col-2" style={{ marginTop: "-1.5rem" }}>
              <Link
                href="/"
                className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer"
              >
                <img
                  src={`/layout/images/${
                    layoutConfig.colorScheme === "light" ? "logo-dark" : "logo-white"
                  }.svg`}
                  alt="footer sections"
                  width="50"
                  height="50"
                  className="mr-2"
                />
                <span className="font-medium text-3xl text-900">SAKAI</span>
              </Link>
            </div>

            <div className="col-12 md:col-10 lg:col-7">
              <div className="grid text-center md:text-left">
                <div className="col-12 md:col-3">
                  <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Company</h4>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    About Us
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">News</a>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Investor Relations
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Careers
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer text-700">Media Kit</a>
                </div>

                <div className="col-12 md:col-3 mt-4 md:mt-0">
                  <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Resources</h4>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Get Started
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">Learn</a>
                  <a className="line-height-3 text-xl block cursor-pointer text-700">
                    Case Studies
                  </a>
                </div>

                <div className="col-12 md:col-3 mt-4 md:mt-0">
                  <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Community</h4>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Discord
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Events
                    <img src="/images/landing/new-badge.svg" className="ml-2" alt="badge" />
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">FAQ</a>
                  <a className="line-height-3 text-xl block cursor-pointer text-700">Blog</a>
                </div>

                <div className="col-12 md:col-3 mt-4 md:mt-0">
                  <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Legal</h4>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Brand Policy
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                    Privacy Policy
                  </a>
                  <a className="line-height-3 text-xl block cursor-pointer text-700">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Homepage;
