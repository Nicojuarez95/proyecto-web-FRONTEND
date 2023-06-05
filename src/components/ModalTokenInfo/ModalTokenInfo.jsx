import React from "react";
import "./modaltokeninfo.css";
import { Link as Anchor } from "react-router-dom";

export default function ModalTokenInfo(props) {
  const { showModal, setShowModal } = props;

  function navegationMP() {
    window.location.href = "https://www.mercadopago.com.ar/developers/es/docs";
  }
  return (
    <>
      {showModal ? (
        <div className="modalContainer">
          <div className="modalT">
            <div className="modal-content">
              <div className="conttokenX">
                <h2>¿Cómo conseguir este token?</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  X
                </button>
              </div>

              <iframe
                width="100%"
                height="415"
                src="https://www.youtube.com/embed/hJLElbwxnRg"
                title="Mercado Pago Key"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
              ></iframe>
                <Anchor
                  to="https://www.mercadopago.com.ar/developers/es/docs"
                  target="_blank"
                  className="mercadopago"
                >
                 Ir a Mercado Pago Desarrolladores
                </Anchor>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
