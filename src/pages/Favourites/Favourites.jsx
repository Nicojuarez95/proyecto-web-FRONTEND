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
    const url = `http://localhost:8080/favourites/`;
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
              type="search"
              placeholder="Search for something here..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            name="category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>

            <option value="Clothing and Accessories">
              Clothing and Accessories
            </option>
            <option value="Shoes">Shoes</option>
            <option value="Beauty and Personal Care">
              Beauty and Personal Care
            </option>
            <option value="Electronics">Electronics</option>
            <option value="Home and Garden">Home and Garden</option>
            <option value="Toys and Games">Toys and Games</option>
            <option value="Books and Music">Books and Music</option>
            <option value="Sports and Outdoor Activities">
              Sports and Outdoor Activities
            </option>
            <option value="Food and Beverages">Food and Beverages</option>
            <option value="Pets">Pets</option>
            <option value="Cars and Motorcycles">Cars and Motorcycles</option>
            <option value="Jewelry and Watches">Jewelry and Watches</option>
            <option value="Office Supplies and Stationery">
              Office Supplies and Stationery
            </option>
            <option value="Financial and Banking Services">
              Financial and Banking Services
            </option>
            <option value="Gift and Souvenir Shops">
              Gift and Souvenir Shops
            </option>
            <option value="Health and Wellness">Health and Wellness</option>
            <option value="Art and Craft Stores">Art and Craft Stores</option>
            <option value="Technology and Gadgets">
              Technology and Gadgets
            </option>
            <option value="Travel and Tourism">Travel and Tourism</option>
            <option value="Second-hand or Thrift Stores">
              Second-hand or Thrift Stores
            </option>
            <option value="Other">Other</option>
          </select>
          <div className="buttonClearAll" onClick={deleteAllFavourite}>
            Clear all favourites
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
