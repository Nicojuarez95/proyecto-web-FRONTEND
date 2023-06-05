import React from 'react'
import './goBackToHome.css'
import { Link as Anchor } from 'react-router-dom'
import modalActions from '../../store/ModalForm/actions.js'
import { useDispatch } from 'react-redux'

const {renderModal} = modalActions

export default function GoBackToHome() {
  const dispatch = useDispatch()

  function closeModal(){
        dispatch(renderModal({state: ''}))
    }

  return (
    <p>Vovler a la <Anchor to='/' className='link' onClick={closeModal}>Pagina de inicio</Anchor></p>
  )
}
