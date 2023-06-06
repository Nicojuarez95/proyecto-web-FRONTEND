import React from 'react'
import './RegisterForm.css'
import register from '../../images/signup.png'
import RegisterFieldsets from '../RegisterFieldsets/RegisterFieldsets'
import SignBtn from '../SignBtn/SignBtn'
import { Link as Anchor } from 'react-router-dom'
import GoBackToHome from '../GoBackToHome/GoBackToHome'
import { useRef } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import modalActions from '../../store/ModalForm/actions.js'
import { useDispatch } from 'react-redux'
import close from '../../images/Union.png'

const { renderModal } = modalActions

export default function RegisterForm() {
    const dispatch = useDispatch()

    let formData = useRef()

    async function handleSignUp(e) {
        e.preventDefault()

        let formInputs = []

        Object.values(formData.current).forEach(e => {
            if (e.name) {
                formInputs.push(e.value)
            }
        })

        let data = {
            name: formInputs[0],
            last_name: formInputs[1],
            email: formInputs[2],
            password: formInputs[3],
        }

        let url = 'https://proyecto-web-backend-host.onrender.com/auth/signup'

        try {
            await axios.post(url, data).then(res => {
                toast.success(res.data.message)
                toast.success('Por favor revise su correo electronico para la verificacion de la cuenta')
                setTimeout(() => {
                    dispatch(renderModal({ state: 'login' }))
                }, 2500)
            })
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                toast.error('Network Error')
            } else {
                if (typeof error.response.data.message === 'string') {
                    toast.error(error.response.data.message)
                } else {
                    error.response.data.message.forEach(err => toast.error(err))
                }
            }
        }
    }

    function handleRender() {
        dispatch(renderModal({ state: 'login' }))
    }

    function closeModal() {
        dispatch(renderModal({ state: '' }))
    }

    return (
        <form ref={formData} onSubmit={handleSignUp} className='register-form'>
            <div className='register-img'>
                <img src={register} alt='register-img' />
            </div>
            <div className='register-text'>
                <img src={close} className='register-x' onClick={closeModal}/>
                <h2>Registrarse</h2>
                <RegisterFieldsets />
                <SignBtn text='Registrarse' />
                {/* ACA PONER BOTON GOOGLE */}
                <p>Ya tienes una cuenta? <Anchor className='link' onClick={handleRender}>Iniciá sesión</Anchor></p>
                <GoBackToHome />
            </div>
            <Toaster
                position="top-right"
            />
        </form>
    )
}