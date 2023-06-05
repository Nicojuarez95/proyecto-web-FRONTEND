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
    const url = `http://localhost:8080/favourites/`;
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
    const url = `http://localhost:8080/favourites/${id}`;
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
    const url = `http://localhost:8080/favourites/${id}`;
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
