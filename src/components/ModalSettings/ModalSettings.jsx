import React from "react";
import "./modalsettings.css";

export default function Modal() {
  return (
    <div className="modalContainer">
      <div className="contentModal">
        <div className="buttonDeleteAll">Eliminar todos los productos</div>
        <div className="buttonDeleteAll">Elimiar Tienda</div>
        <span>
          <label>Mercado Pago</label>
          <label>Inserta tu clave de acceso</label>
        </span>
      </div>
    </div>
  );
}
