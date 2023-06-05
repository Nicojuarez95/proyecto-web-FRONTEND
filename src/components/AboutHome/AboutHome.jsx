import React, { useEffect } from 'react'
import './aboutHome.css'
import Diseño from '../../images/Diseño.jpg'
import BtnAnchor from '../BtnAnchor/BtnAnchor'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import refAboutActions from '../../store/RefAbout/actions'

const {refAbout} = refAboutActions

export default function AboutHome() {
  let AboutRef = useRef()

  const dispatch = useDispatch()

  useEffect( () => {
    dispatch(refAbout({reference: AboutRef.current}))
  },[])

  let ContactRef = useSelector(store => store.refContactReducer.reference)
  function handleContact(){
    ContactRef.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className='AboutHome' ref={AboutRef}>

        <div className='cont-title'>
            <h2 className='title-about' id='about'>Encuéntrame</h2>
            <img className='img-about' src={Diseño} alt="" />
        </div>
        <div className='cont-infoAbout'>
            <div className='cont-text'>
                <h2 className='text_about'>Editar todo en línea te da una sensación de control que no has sentido con ninguna otra herramienta.</h2>
            </div>
            <BtnAnchor handleContact={handleContact} name='Contáctanos' class='color_2'/>
        </div>
        
    </div>
  )
}
