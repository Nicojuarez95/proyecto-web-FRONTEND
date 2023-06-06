import React from "react";
import "./HeaderShop.css";
import bag from "../../images/bag.png";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ShopModalActions from "../../store/ShopModal/actions";
import ShopModal from "../../components/ShopModal/ShopModal";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";



const { renderModal } = ShopModalActions;

export default function HeaderShop() {
  const dispatch = useDispatch();
  let [shop, setShop] = useState({});
  let shopId = useParams().shopId;

  let banner = {
    background: `rgba(0, 0, 0, 0.7) url(${shop.banner})`,
  };

  let shopUrl = `https://proyecto-web-backend-host.onrender.com/shop/${shopId}`;
  async function getShop() {
    try {
      await axios.get(shopUrl).then((res) => setShop(res.data.shop));
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getShop();
  }, [shopId]);

  function openModal() {
    dispatch(renderModal({ state: true }));
  }

  let modalState = useSelector((store) => store.modalShopReducer.state);

  return (
    <div className="topShop" style={banner}>
      {modalState ? <ShopModal /> : <></>}
      <nav className="navShop">
        <img className="logoShop" src={shop.photo} alt="logo" />
        <div className="anchorsShop">
          <a className="active">{shop.name}</a>
        </div>
        <img onClick={openModal} className="bagShop" src={bag} alt="bag" />
      </nav>
    </div>
  );
}
