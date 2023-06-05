import React from 'react'
import { Link as Anchor } from "react-router-dom";
import {
    Home,
    Store,
    Profile,
    SupportAgent,
    LogOut,
    ArrowLeft,
    ArrowRight,
} from "../../components/Icons/Icons.js";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

export default function NavBarAdmin() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const navigate = useNavigate();

    function toggleNav() {
        setIsNavOpen(!isNavOpen);
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
            toast.error("Ya has cerrado sesión o no has iniciado sesión")
        }
    }

    return (
        <>
            <div className="arrowContainerLeft" onClick={toggleNav}>
                <ArrowRight />
            </div>

            <div
                className={`containerNavStore  ${!isNavOpen && "containerNavStoreClosed"
                    } `}
            >
                <div className="arrowContainer" onClick={toggleNav}>
                    <ArrowLeft />
                </div>
                <div className="anchorsContainer">
                    <span className="buttonEffect">
                        <Anchor to='/' className="buttonAnchor">
                            <Home />
                            Inicio
                        </Anchor>
                    </span>
                    <span className="buttonEffect">
                        <Anchor to='/profile' className="buttonAnchor">
                            <Profile />
                            Perfil
                        </Anchor>
                    </span>
                    <hr style={{ width: '100%' }} />
                    <span className="buttonEffect">
                        <Anchor to='/admin/shops' className="buttonAnchor">
                            <Store />
                            Tiendas
                        </Anchor>
                    </span>
                    <span className="buttonEffect">
                        <Anchor to='/admin/users' className="buttonAnchor">
                            <Profile />
                            Usuarios
                        </Anchor>
                    </span>
                    <span className="buttonEffect">
                        <Anchor to='/admin/products' className="buttonAnchor">
                            <Store />
                            Productos
                        </Anchor>
                    </span>
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
                                    Cerrar sesión
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
    )
}
