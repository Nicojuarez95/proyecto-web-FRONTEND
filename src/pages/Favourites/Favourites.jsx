import React, { useEffect, useRef, useState } from "react";
import "./favourites.css";
import NavBarStores from "../../components/NavBarStores/NavBarStores";
import CardStoreView from "../../components/CardStoreView/CardStoreView";
import { Delete, Search } from "../../components/Icons/Icons";
import { useDispatch, useSelector } from "react-redux";
import Auth from "../../components/Auth/Auth";
import CategoriesSelect from "../../components/CategoriesSelect/CategoriesSelect";
import captureFavourites from "../../store/CaptureFavourites/actions";
import CardStoreFavourites from "../../components/CardStoreFavourites/CardStoreFavourites";
import axios from "axios";

const actions = captureFavourites;

export default function StoresView() {
  let modalState = useSelector((store) => store.modalFormReducer.state);
  const captureFavourites = useSelector(
    (store) => store.favouritesReducer.favourites
  );
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFavourite, setFilteredFavourite] = useState(captureFavourites);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.captureFavourites());
  }, []);

  useEffect(() => {
    const filtered = handleFilter();
    setFilteredFavourite(filtered);
  }, [captureFavourites, searchTerm, selectedCategory]);

  async function deleteAllFavourite(e) {
    const favouritesCards = captureFavourites;
    const url = `https://proyecto-web-backend-host.onrender.com/favourites/`;
    try {
      await axios.delete(url, headers, favouritesCards);
      dispatch(actions.captureFavourites());
    } catch (error) {
      console.log(error);
    }
  }

  function handleFilter() {
    if (!searchTerm.length && !selectedCategory.length)
      return captureFavourites;
    const filterByCategory = captureFavourites.filter((fav) =>
      fav.store_id.category
        .toLowerCase()
        .includes(selectedCategory.toLowerCase())
    );
    const filterByText = filterByCategory.filter((fav) =>
      fav.store_id.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filterByText;
  }

  return (
    <>
      <NavBarStores />
      <div className="containerContent">
        {modalState === "register" ? <Auth /> : <></>}
        {modalState === "login" ? <Auth /> : <></>}
        <div className="containerCategoriesFav">
          <div className="inputContainer">
            <Search />
            <input
              className="buscaAlgo"
              type="search"
              placeholder="Busca algo aquí..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            name="category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
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
          <div className="buttonClearAll" onClick={deleteAllFavourite}>
            Limpiar favoritos
          </div>
        </div>
        <div className="containerCardsStoresFavourites">
          <div className="alignCardsFavourites">
            {filteredFavourite?.map((card, i) => (
              <CardStoreFavourites key={i} card={card.store_id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
