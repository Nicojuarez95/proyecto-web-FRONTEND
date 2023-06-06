import React, { useState } from "react";
import axios from "axios";
import { Link as Anchor, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import "./headerHome.css";
import BtnSign from "../BtnSign/BtnSign";
import BtnLogo from "../../images/Menu.png";
import BtnClose from "../../images/Union.png";
import UserImage from "../../images/user.jpg";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LiveHelpRoundedIcon from "@mui/icons-material/LiveHelpRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import modalActions from "../../store/ModalForm/actions.js";
import { Admin } from "../Icons/Icons.js";
import logoheader from "../../images/Proyecto__2_-removebg-preview.png"

const { renderModal } = modalActions;

export default function HeaderHome() {
  const [activeButton, setActiveButton] = useState("Home");

  function handleSignIn() {
    dispatch(renderModal({ state: "login" }));
  }
  function handleSignUp() {
    dispatch(renderModal({ state: "register" }));
  }

  function handleSignInModal() {
    dispatch(renderModal({ state: "login" }));
    setIsOpen(!isOpen);
  }
  function handleSignUpModal() {
    dispatch(renderModal({ state: "register" }));
    setIsOpen(!isOpen);
  }

  // Navbar
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  let url = "https://proyecto-web-backend-host.onrender.com/auth/signout";
  let token = localStorage.getItem("token");
  let headers = { headers: { Authorization: `Bearer ${token}` } };

  async function handleSignOut() {
    try {
      await axios
        .post(url, null, headers)
        .then((res) => localStorage.setItem("token", ""));
      localStorage.setItem(
        "user",
        JSON.stringify({
          // id:'',
          admin: "",
          name: "",
          photo: "",
          seller: "",
        })
      );
      toast.success("¡La sesión se cerró con éxito!");
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      toast.error("Ya has cerrado sesión o no has iniciado sesión");
    }
  }

  async function handleSignOutModal() {
    try {
      await axios
        .post(url, null, headers)
        .then((res) => localStorage.setItem("token", ""));
      localStorage.setItem(
        "user",
        JSON.stringify({
          // id:'',
          admin: "",
          name: "",
          photo: "",
          seller: "",
        })
      );
      toast.success("¡La sesión se cerró con éxito!");
      setTimeout(() => {
        setIsOpen(!isOpen);
      }, 1000);
    } catch (error) {
      toast.error("Ya has cerrado sesión o no has iniciado sesión");
    }
  }

  if (!token) {
    localStorage.setItem(
      "user",
      JSON.stringify({
        // id:'',
        admin: "",
        name: "",
        photo: "",
        seller: "",
      })
    );
  }

  let user = JSON.parse(localStorage.getItem("user"));
  let name = user.name;
  let photo = user.photo;

  let HomeRef = useSelector((store) => store.refHomeReducer.reference);
  function handleHomeUs() {
    setActiveButton("Home");
    HomeRef.scrollIntoView({ behavior: "smooth" });
  }

  let AboutRef = useSelector((store) => store.refAboutReducer.reference);
  function handleAboutUs() {
    setActiveButton("About Us");
    AboutRef.scrollIntoView({ behavior: "smooth" });
  }

  let CustomerRef = useSelector((store) => store.refCustomersReducer.reference);
  function handleCustomer() {
    CustomerRef.scrollIntoView({ behavior: "smooth" });
    setActiveButton("Stories");
  }

  let ContactRef = useSelector((store) => store.refContactReducer.reference);
  function handleContact() {
    ContactRef.scrollIntoView({ behavior: "smooth" });
    setActiveButton("Contact");
  }

  return (
    <>
      <div className="Header_Home">
        <Anchor to="/">
          <img
            className="logo"
            src={logoheader}
            alt="logo"
          />
        </Anchor>
        <div className="cont_headerHome">
          <Anchor
            className={activeButton === "Home" ? "btn_nav active" : "btn_nav"}
            onClick={handleHomeUs}
          >
            Inicio
          </Anchor>
          <Anchor
            to="/shops"
            className={activeButton === "Stores" ? "btn_nav active" : "btn_nav"}
            onClick={() => setActiveButton("Stores")}
          >
            Tiendas
          </Anchor>
          <Anchor
            className={
              activeButton === "About Us" ? "btn_nav active" : "btn_nav"
            }
            onClick={handleAboutUs}
          >
            Acerca de
          </Anchor>
          <Anchor
            className={
              activeButton === "Stories" ? "btn_nav active" : "btn_nav"
            }
            onClick={handleCustomer}
          >
            Comentarios
          </Anchor>
          <Anchor
            className={
              activeButton === "Contact" ? "btn_nav active" : "btn_nav"
            }
            onClick={handleContact}
          >
            Contacto
          </Anchor>
          {user.admin ? <Anchor className="btn_nav" to="/admin/shops">
            Admin
          </Anchor> : <></>}
        </div>
        <div className="cont_BtnSing">
          {token ? <></> : <BtnSign name="Iniciar Sesión" onClick={handleSignIn} />}
          {token ? <></> : <BtnSign name="Registrarse" onClick={handleSignUp} />}
          {token ? <BtnSign name="Cerrar Sesión" onClick={handleSignOut} /> : <></>}
        </div>
      </div>
      <div className="header-container">
        <div className="nav-toggler">
          <img
            src={BtnLogo}
            alt="logo"
            className="logo"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        <div className={`nav ${isOpen && "open"}`}>
          <div className="nav-top">
            <div className="nav-close-btn">
              <button onClick={() => setIsOpen(!isOpen)}>
                <img src={BtnClose} alt="logo" className="logo" />
              </button>
            </div>
            <div className="nav-user">
              <img src={photo ? photo : UserImage} alt="userimage" />
            </div>
            <div className="user-info">
              <p className="username">{name ? name : "Username"}</p>
              <div className="cont_foll">
                <p className="foll">{"280 Followers"}</p>
                <PeopleAltRoundedIcon />
              </div>
            </div>
          </div>
          <div className="cont_route">
            <div className="nav-btn">
              <Anchor className="a-btn">
                <HomeRoundedIcon />
                Inicio
              </Anchor>
            </div>
            <div className="nav-btn">
              <Anchor className="a-btn" to="/shops">
                <ShoppingBagRoundedIcon />
                Tiendas
              </Anchor>
            </div>
            {
              user.admin ? <div className="nav-btn">
                <Anchor className="a-btn" to="/admin/shops">
                <Admin />
                  Admin
                </Anchor>
              </div> : <></>
            }
            {
              token ?
                <></>
                :
                <div className="nav-btn">
                  <Anchor className="a-btn" onClick={handleSignUpModal}>
                    <PersonAddAltRoundedIcon />
                    Registro
                  </Anchor>
                </div>

            }
            {
              token ?
                <></>
                :
                <div className="nav-btn">
                  <Anchor className="a-btn" onClick={handleSignInModal}>
                    <PersonRoundedIcon />
                    Acceso
                  </Anchor>
                </div>
            }
          </div>
          <div className="cont_footNav">
            <div className="nav-btn">
              <Anchor className="a-btn">
                <LiveHelpRoundedIcon />
                Ayuda
              </Anchor>
            </div>
            {
              token ?
                <div className="nav-btn">
                  <Anchor className="a-btn" onClick={handleSignOutModal}>
                    <ExitToAppRoundedIcon />
                    Cerrar sesión
                  </Anchor>
                </div>
                :
                <></>
            }
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
