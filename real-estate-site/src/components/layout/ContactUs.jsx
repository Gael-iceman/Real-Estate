import React from "react";
import { Helmet } from "react-helmet";
import {
  FaEnvelope,
  FaPhone,
  FaYoutube,
  FaInstagram,
  FaWhatsapp
} from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

const ContactUs = () => (
  <div className="container mt-4 mb-5">
    <Helmet>
      <title>Contact Us | Real Estate</title>
    </Helmet>
    <h1>Contact Us</h1>
    <p className="text-muted">
      Reach out for listings, partnerships, or general questions.
    </p>

    <div className="row mt-4">
      <div className="col-12 col-md-6 mb-3">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Reachout</h5>
            <p className="mb-2">
              <FaEnvelope className="mr-2" />
              <a href="mailto:lynerealestate24@gmail.com">
                lynerealestate24@gmail.com
              </a>
            </p>
            <p className="mb-0">
              <FaPhone className="mr-2" />
              <a href="tel:+250796194997">+250 796 194 997</a>
            </p>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 mb-3">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">Socials</h5>
            <div className="d-flex flex-column gap-2">
              <a href="https://www.youtube.com/@lynerealestates" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="mr-2" />
                YouTube
              </a>
              <a href="https://www.instagram.com/lynerealestate/" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="mr-2" />
                Instagram
              </a>
              <a href="https://www.tiktok.com/@lynerealestate" target="_blank" rel="noopener noreferrer">
                <FaTiktok className="mr-2" />
                TikTok
              </a>
              <a href="https://wa.me/250796194997" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="mr-2" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ContactUs;
