import React, { useState } from "react";
import "./categoriselect.css"

export default function CategoriesSelect() {
  return (
    <>
      <select className="selectCate" name="category">
      <option value=''>
                                Todas las categorías
                            </option>
                            <option value="Ropa y Accesorios">
                                Ropa y Accesorios
                            </option>
                            <option value="Zapatos">Zapatos</option>
                            <option value="Belleza y Cuidado Personal">
                                Belleza y Cuidado Personal
                            </option>
                            <option value="Electrónicos">Electrónicos</option>
                            <option value="Hogar y Jardín">Hogar y Jardín</option>
                            <option value="Juguetes y Juegos">Juguetes y Juegos</option>
                            <option value="Libros y Música">Libros y Música</option>
                            <option value="Deportes y Actividades al Aire Libre">
                                Deportes y Actividades al Aire Libre
                            </option>
                            <option value="Comida y Bebidas">Comida y Bebidas</option>
                            <option value="Mascotas">Mascotas</option>
                            <option value="Automóviles y Motocicletas">Automóviles y Motocicletas</option>
                            <option value="Joyería y Relojes">Joyería y Relojes</option>
                            <option value="Suministros de Oficina y Papelería">
                                Suministros de Oficina y Papelería
                            </option>
                            <option value="Servicios Financieros y Bancarios">
                                Servicios Financieros y Bancarios
                            </option>
                            <option value="Tiendas de Regalos y Souvenirs">Tiendas de Regalos y Souvenirs</option>
                            <option value="Salud y Bienestar">Salud y Bienestar</option>
                            <option value="Tiendas de Arte y Manualidades">Tiendas de Arte y Manualidades</option>
                            <option value="Tecnología y Gadgets">Tecnología y Gadgets</option>
                            <option value="Viajes y Turismo">Viajes y Turismo</option>
                            <option value="Tiendas de Segunda Mano o de Oportunidad">
                                Tiendas de Segunda Mano o de Oportunidad
                            </option>
                            <option value="Otro">Otro</option>
      </select>
    </>
  );
}
