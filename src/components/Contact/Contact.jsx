import React, { useEffect, useRef } from 'react'
import "./contact.css"
import { useDispatch } from 'react-redux'
import refContactActions from '../../store/RefContact/actions'

const {refContact} = refContactActions

export default function Contact() {
    let contactRef = useRef()

    const dispatch = useDispatch()

    useEffect( () => {
        dispatch(refContact({reference: contactRef.current}))
    },[])

  return (
    <div className='contenedor-contacto'>
        <div className='cont-contact'>
            <div className='cont-title-contact'>
                <h1>Contacto</h1>
            </div>
            <div className='cont-info-contact'>
                <div className='details-contact'>
                    <div>
                        <p className='title-info'>Dirección</p>
                    </div>
                    <div>
                        <p className='info'>Coardoba, Argentina</p>
                    </div>
                </div>
                <div className='details-contact'>
                     <div>
                        <p className='title-info'>Gmail</p>
                    </div>
                    <div>
                        <a className='info' href="mailto:asdasdasd@gmail.com">proyectowebdevelopment@gmail.com</a>
                    </div>
                </div>
                <div className='details-contact'>
                     <div>
                        <p className='title-info'>Celular</p>
                    </div>
                    <div ref={contactRef}>
                        <a className='info' href="tel: +543584834589">+543584834859</a>
                    </div>
                </div>
            </div>
        </div>

        <div className='cont-images'>

            <div className='cont-img1'>
                
            </div>

            <div className='cont-img'>

                <div className='cont-1'>
                </div>

                <div className='cont-2'>
                </div>
            </div>

            <div className='cont-img'>

                <div className='cont-3'>
                </div>

                <div className='cont-4'>
                </div>
            </div>
        </div>
    </div>
  )
}
