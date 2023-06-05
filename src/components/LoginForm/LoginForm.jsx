import React from 'react'
import './LoginForm.css'
import login from '../../images/login.png'
import LoginFieldsets from '../LoginFieldsets/LoginFieldsets'
import SignBtn from '../SignBtn/SignBtn'
import { Link as Anchor } from 'react-router-dom'
import GoBackToHome from '../GoBackToHome/GoBackToHome'
import { useRef } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import modalActions from '../../store/ModalForm/actions.js'
import { useDispatch } from 'react-redux'
import close from '../../images/Union.png'

const { renderModal } = modalActions;

export default function LoginForm({ setRenderModal }) {
  const dispatch = useDispatch();

  let formData = useRef();

  async function handleSignIn(e) {
    e.preventDefault();

    let formInputs = [];

    Object.values(formData.current).forEach((e) => {
      if (e.name) {
        formInputs.push(e.value);
      }
    })

    let data = {
      email: formInputs[0],
      password: formInputs[1],
    };

    let url = "http://localhost:8080/auth/signin";
    let admin;
    let seller;
    try {
      await axios.post(url, data).then((res) => {
        res.data.user.is_admin ? (admin = true) : (admin = false);
        res.data.user.is_seller ? (seller = true) : (seller = false);
        localStorage.setItem("token", res.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify({
            // id: res.data.user._id,
            name: res.data.user.name,
            lastname: res.data.user.last_name,
            mail: res.data.user.email,
            photo: res.data.user.photo,
            admin,
            seller,
          })
        );
        toast.success(res.data.message);
        setTimeout(() => {
          dispatch(renderModal({ state: "" }));
        }, 1500);
      });
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Network Error");
      } else {
        if (typeof error.response.data.message === "string") {
          toast.error(error.response.data.message);
        } else {
          error.response.data.message.forEach((err) => toast.error(err));
        }
      }
    }
  }

  function handleRender() {
    dispatch(renderModal({ state: "register" }));
  }

  function closeModal() {
    dispatch(renderModal({ state: "" }));
  }

    return (
        <form ref={formData} onSubmit={handleSignIn} className='login-form'>
            <div className='login-text'>
                <img src={close} className='login-x' onClick={closeModal}/>
                <h2>Log In</h2>
                <LoginFieldsets />
                <SignBtn text='Sign In' />
                {/* ACA PONER BOTON GOOGLE */}
                <p>You don´t have an account yet? <Anchor className='link' onClick={handleRender}>Sign Up</Anchor></p>
                <GoBackToHome />
            </div>
            <div className='login-img'>
                <img src={login} alt='login-img' />
            </div>
            <Toaster
                position="top-right"
            />
        </form>
    )
}
