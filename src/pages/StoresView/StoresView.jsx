import React, { useEffect, useRef, useState } from "react";
import "./storesview.css";
import NavBarStores from "../../components/NavBarStores/NavBarStores";
import CardStoreView from "../../components/CardStoreView/CardStoreView";
import { Delete, Search } from "../../components/Icons/Icons";
import Auth from "../../components/Auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import actions from "../../store/Shops/actions";
import inputActions from "../../store/InputText/actions";
import categoriesActions from "../../store/CaptureCategories/actions";
import axios from "axios";

const { captureShop } = actions;

export default function StoresView() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [shopFavourites, setShopFavourites] = useState([]);
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const text = useRef("");
  const modalState = useSelector((store) => store.modalFormReducer.state);
  const shopsData = useSelector((store) => store.shopsReducer.shop);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      captureShop({
        captureCategories: selectedCategory,
        inputText: searchTerm,
      })
    );
  }, [selectedCategory, searchTerm]);

  async function getFavourites() {
    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    const url = `https://proyecto-web-backend-host.onrender.com/favourites/`;
    try {
      if(token){
        const response = await axios.get(url, headers);
        setShopFavourites(response.data.favourites);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function addFavourite(id) {
    const url = `https://proyecto-web-backend-host.onrender.com/favourites/${id}`;
    try {
      if(token){
        const response = await axios.post(url, "", headers);
        getFavourites();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteFavourite(id) {
    const url = `https://proyecto-web-backend-host.onrender.com/favourites/${id}`;
    try {
      await axios.delete(url, headers);
      const newFilter = shopFavourites.filter(
        (favourite) => favourite.store_id._id !== id
      );

      setShopFavourites(newFilter);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getFavourites();
  }, []);

  return (
    <>
      <NavBarStores />
      <div className="containerContent">
        {modalState === "register" || modalState === "login" ? <Auth /> : null}
        <div className="containerCategories">
          <div className="inputContainer">
            <Search />
            <input
              type="search"
              ref={text}
              placeholder="Busca algo aquí..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            name="category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value=''>
                                Categorías
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
        </div>
        <div className="containerCardsStores">
          <div className="alignCards">
            {shopsData?.map((shop, i) => (
              <CardStoreView
                key={i}
                data={shop}
                deleteFavourite={deleteFavourite}
                addFavourite={addFavourite}
                isFavourite={shopFavourites.some(
                  (favourite) => favourite.store_id._id == shop._id
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
