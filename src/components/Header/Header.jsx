import React from "react";
import "./header.css";
import { Search } from "../Icons/Icons.js";
import Logo from "../../images/Proyecto__2_-removebg-preview.png";
import { useLocation } from "react-router-dom";
import { Link as Anchor } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const hideSearch = location.pathname === "/profile";

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const name = user ? user.name : "";
  const mail = user ? user.mail : "";
  const photo = user ? user.photo : "";
  const lastname = user ? user.lastname : "";

  return (
    <div className="header">
      <div className="containerLogoInput">
        <Anchor to="/" className="containerLogo">
          <img src={Logo} alt="" />
        </Anchor>
        {token ? (
          <Anchor to="/profile" className="profileAnchor">
            <div className="profileContainer">
              <span className="nameProfile">
                {name} {lastname}
              </span>
              <img className="profileImage" src={photo} alt="" />
            </div>
          </Anchor>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
