import React from 'react'
import './LoginFieldsets.css'
import email from '../../images/@.png'
import lock from '../../images/lock.png'

export default function LoginFieldsets() {
    return (
        <>
            <fieldset className='fieldset'>
                <legend>Gmail</legend>
                <div className='input-container'>
                    <input type='email' name='email' placeholder='email@gmail.com' />
                    <img src={email} alt='@' />
                </div>
            </fieldset>

            <fieldset className='fieldset'>
                <legend>Contraseña</legend>
                <div className='input-container'>
                    <input type='password' name='password' placeholder='......................' />
                    <img src={lock} alt='lock' />
                </div>
            </fieldset>
        </>
    )
}
