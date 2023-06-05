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

  let url = 'http://localhost:8080/auth/signout'
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
      toast.error("You're already signed out or not signed in")
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
              Home
            </Anchor>
          </span>
          <span className="buttonEffect">
            <Anchor to='/shops' className="buttonAnchor">
              <Store />
              Shops
            </Anchor>
          </span>
          {
            token ? <span className="buttonEffect">
              <Anchor to='/myshop' className="buttonAnchor">
                <Stores />
                My Shop
              </Anchor>
            </span>
              : <></>
          }
          {
            token ? <span className="buttonEffect">
              <Anchor to='/profile' className="buttonAnchor">
                <Profile />
                Profile
              </Anchor>
            </span>
              : <></>
          }
          {
            token ? <span className="buttonEffect">
              <Anchor className="buttonAnchor" to="/favourites">
                <Favourite />
                Favourites
              </Anchor>
            </span>
              : <></>
          }
          {
            token ? <></> :
              <span className="buttonEffect">
                <Anchor className="buttonAnchor" onClick={handleSignUp}>
                  <Profile />
                  Register
                </Anchor>
              </span>
          }
          {
            token ? <></> :
              <span className="buttonEffect">
                <Anchor className="buttonAnchor" onClick={handleSignIn}>
                  <Profile />
                  Login
                </Anchor>
              </span>
          }
          <div className="logOutHelp">
            <span className="buttonEffect">
              <Anchor className="buttonAnchor">
                <SupportAgent />
                Support Center
              </Anchor>
            </span>
            {
              token ? <span className="buttonEffect">
                <Anchor className="buttonAnchor" onClick={handleSignOutModal}>
                  <LogOut />
                  Logout
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
