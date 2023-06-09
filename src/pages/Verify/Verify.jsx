import React from 'react'
import './Verify.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Link as Anchor } from 'react-router-dom'

export default function Verify() {
    const [userlocal, setuserlocal] = useState()
    const user = localStorage.getItem('user')
    const { verify_code } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            if (userlocal?.is_verify) {
                setTimeout(() => {
                    // return navigate('/')
                    console.log('ya estas verificado')
                }, 3000)
            } else {
                if (verify_code) {
                    const response = await axios.get('https://proyecto-web-backend-host.onrender.com/' + 'auth/verify?verify_code=' + verify_code)//apiurl llega hasta api/
                    localStorage.setItem('user', JSON.stringify(response.data))
                    setuserlocal(response.data)
                }
            }
        })()

    }, [verify_code, user])

    return (
        <div className='bodyVerify'>
            <div className='infoVerify'>
                <div className='cont-verify'>
                    <h1>Estás verificado ahora!</h1>
                    <Anchor className='a-redirect' to='/'>De vuelta a Inicio</Anchor>
                </div>
            </div>
        </div>
    )
}