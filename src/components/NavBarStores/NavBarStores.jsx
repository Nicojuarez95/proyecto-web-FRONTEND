import React, { useState } from "react";
import "./navbarstores.css";
import { Link as Anchor } from "react-router-dom";
import {
  Home,
  Store,
  Stores,
  Profile,
  Favourite,
  SupportAgent,
  LogOut,
  ArrowLeft,
  ArrowRight,
} from "../Icons/Icons.js";
import Header from "../Header/Header";
import { useDispatch } from "react-redux";
import modalActions from '../../store/ModalForm/actions.js'
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom'

const { renderModal } = modalActions

export default function NavBarStores() {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [isNavOpen, setIsNavOpen] = useState(true);

  function toggleNav() {
    setIsNavOpen(!isNavOpen);
  }

  function handleSignIn() {
    dispatch(renderModal({ state: 'login' }))
    setTimeout(() => {
      setIsNavOpen(!isNavOpen);
    }, 200)
  }

  function handleSignUp() {
    dispatch(renderModal({ state: 'register' }))
    setTimeout(() => {
      setIsNavOpen(!isNavOpen);
    }, 200)
  }

  let url = 'https://proyecto-web-backend-host.onrender.com/auth/signout'
  let token = localStorage.getItem('token')
  let headers = { headers: { 'Authorization': `Bearer ${token}` } }

  async function handleSignOutModal() {
    try {
      await axios.post(url, null, headers).then(res =>
        localStorage.setItem('token', ''));
      localStorage.setItem('user', JSON.stringify({
        // id:'',
        admin: '',
        name: '',
        photo: '',
        seller: ''
      }))
      toast.success('¡La sesión se cerró con éxito!')
      setTimeout(() => {
        setIsNavOpen(!isNavOpen)
        navigate("/")
      }, 1000)
    } catch (error) {
      toast.error("Ya has cerrado sesión o no has iniciado sesión")
    }
  }

  return (
    <>
      <Header />
      <div className="arrowContainerLeft" onClick={toggleNav}>
        <ArrowRight />
      </div>

      <div
        className={`containerNavStore  ${isNavOpen && "containerNavStoreClosed"
          } `}
      >
        <div className="arrowContainer" onClick={toggleNav}>
          <ArrowLeft />
        </div>
        <div className="anchorsContainer">
          <span className="buttonEffect">
            <Anchor to='/' className="buttonAnchor">
              <Home />
              inicio
            </Anchor>
          </span>
          <span className="buttonEffect">
            <Anchor to='/shops' className="buttonAnchor">
              <Store />
              Tiendas
            </Anchor>
          </span>
          {
            token ? <span className="buttonEffect">
              <Anchor to='/myshop' className="buttonAnchor">
                <Stores />
                Mi Tienda
              </Anchor>
            </span>
              : <></>
          }
          {
            token ? <span className="buttonEffect">
              <Anchor to='/profile' className="buttonAnchor">
                <Profile />
                Perfil
              </Anchor>
            </span>
              : <></>
          }
          {
            token ? <span className="buttonEffect">
              <Anchor className="buttonAnchor" to="/favourites">
                <Favourite />
                Favoritos
              </Anchor>
            </span>
              : <></>
          }
          {
            token ? <></> :
              <span className="buttonEffect">
                <Anchor className="buttonAnchor" onClick={handleSignUp}>
                  <Profile />
                  Registrarse
                </Anchor>
              </span>
          }
          {
            token ? <></> :
              <span className="buttonEffect">
                <Anchor className="buttonAnchor" onClick={handleSignIn}>
                  <Profile />
                  Iniciar Sesión
                </Anchor>
              </span>
          }
          <div className="logOutHelp">
            <span className="buttonEffect">
              <Anchor className="buttonAnchor">
                <SupportAgent />
                Centro de ayuda
              </Anchor>
            </span>
            {
              token ? <span className="buttonEffect">
                <Anchor className="buttonAnchor" onClick={handleSignOutModal}>
                  <LogOut />
                  Cerrar Sesión
                </Anchor>
              </span> : <></>
            }
          </div>
        </div>
      </div>
      <Toaster
        position="top-right"
      />
    </>
  );
}
