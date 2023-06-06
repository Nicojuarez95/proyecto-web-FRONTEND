import React, { useEffect, useRef, useState } from "react";
import NavBarStores from "../../components/NavBarStores/NavBarStores";
import "./mystore.css";
import { UpLoad } from "../../components/Icons/Icons";
import { useDispatch, useSelector } from "react-redux";
import Auth from "../../components/Auth/Auth";
import CategoriesSelect from "../../components/CategoriesSelect/CategoriesSelect";
import loginbg from "../../images/login-bg.png";
import axios from "axios";
import AWS from "aws-sdk";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../../components/ModalMyStore/ModalMyStore";
import ModalCreateProduct from "../../components/ModaleCreateProduct/ModaleCreateProduct";
import ModalTokenInfo from "../../components/ModalTokenInfo/ModalTokenInfo";
import CardProductMyShop from "../../components/CardProductMyShop/CardProductMyShop";
import { useNavigate } from "react-router-dom";

export default function MyStore() {
  let modalState = useSelector((store) => store.modalFormReducer.state);
  const user = JSON.parse(localStorage.getItem("user"));
  const seller = user.seller;
  const formInfo = useRef();
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [reload, setReload] = useState(false);
  const [shop, setShop] = useState({});
  const [isOpen, setIsOpen] = useState(!true);
  const [open, setOpen] = useState(!true);
  const [isClosed, setIsClosed] = useState(false);
  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const inputCategory = useRef();
  const [showModal, setShowModal] = useState(false);

  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    region: "sa-east-1",
  });

  function openModal() {
    setIsOpen(true);
  }

  function openSettings() {
    setOpen(true);
  }

  useEffect(() => {
    getMyShop();
  }, [reload]);

  useEffect(() => {
    if (isClosed) {
      getMyShop();
    }
    setIsClosed(false);
  }, [isClosed]);

  function closeModal2() {
    setOpen(false);
    setIsClosed(true);
  }

  function closeModal() {
    setIsOpen(false);
    setIsClosed(true);
  }

  async function getMyShop() {
    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    try {
      if (user.seller) {
        const url = "https://proyecto-web-backend-host.onrender.com/shop/me";
        const response = await axios.get(url, headers);
        setShop(response.data.shop);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMyProducts(shop);
  }, [shop]);

  async function getMyProducts(shop) {
    setReload(false);
    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (shop._id) {
        const url = `https://proyecto-web-backend-host.onrender.com/shop/${shop._id}/products`;
        const response = await axios.get(url, headers);
        setProduct(response.data.products);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function createCategory() {
    const url = "https://proyecto-web-backend-host.onrender.com/categories/create";
    const data = {
      category_name: inputCategory.current?.value,
    };
    try {
      const response = await axios.post(url, data, headers);
      setCategories(response.data);
      toast.success(response.data.message);
      inputCategory.current.value = "";
    } catch (error) {
      toast.error(error.data.message);
    }
  }
  async function handleNewShop(e) {
    e.preventDefault();
    const url = "https://proyecto-web-backend-host.onrender.com/shop/create";
    const data = {
      name: formInfo.current?.name?.value || "",
      category: formInfo.current?.category?.value || "",
      country: formInfo.current?.country?.value || "",
      city: formInfo.current?.city?.value || "",
      token: formInfo.current?.token?.value || "",
      photo: "",
      banner: "",
      phone: formInfo.current?.phone?.value,
      description: formInfo.current?.description?.value || "",
    };

    try {
      if (selectedFile && selectedBanner) {
        const file = selectedFile;
        const fileName = `${file.name}`;
        const params = {
          Bucket: "lanceapp",
          Key: fileName,
          Body: file,
        };
        const responseS3 = await s3.upload(params).promise();
        data.photo = responseS3.Location;

        const banner = selectedBanner;
        const bannerName = `${banner.name}`;
        const bannerParams = {
          Bucket: "lanceapp",
          Key: bannerName,
          Body: banner,
        };
        const bannerResponseS3 = await s3.upload(bannerParams).promise();
        data.banner = bannerResponseS3.Location;
      }
      const res = await axios.post(url, data, headers);
      localStorage.setItem("user", JSON.stringify({ ...user, seller: true }));
      toast.success(res.data.message);
      setTimeout(() => {
        setReload(!reload);
      }, 1000);
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Network Error");
      } else {
        if (typeof error.response.data.message === "string") {
          toast.error(error.response.data.message);
        } else {
          error.response.data.message.forEach((err) => toast.error(err));
        }
      }
    }
  }

  function handleFileSelect(event) {
    setSelectedFile(event.target.files[0]);
  }
  function handleFileBanner(event) {
    setSelectedBanner(event.target.files[0]);
  }

  function showInfoToken() {
    setShowModal(true);
  }

  let navigate = useNavigate();
  function handleCustomer() {
    navigate(`/shop/${shop._id}`);
  }

  return (
    <>
      <NavBarStores />
      <div className="containerContent">
        {modalState === "register" ? <Auth /> : <></>}
        {modalState === "login" ? <Auth /> : <></>}
        {seller === true ? (
          <>
            <div className="myStoreBanner">
              <span className="containerBannerMyStore">
                <img src={shop.banner} alt="" />
              </span>

              <div className="profileImageMyStore">
                <img src={shop.photo} alt="" />
              </div>
            </div>
            <div className="infoMyStore">
              <span className="buttonsContainer">
                <div className="buttonCustomer" onClick={handleCustomer}>
                Mirar como cliente
                </div>
                <div className="buttonEditStore" onClick={openModal}>
                  Editar la tienda
                </div>
                {isOpen && <Modal key={isClosed} onClose={closeModal} />}

                <div className="buttonEditStore" onClick={openSettings}>
                  Agregar producto
                </div>
                {open && (
                  <ModalCreateProduct key={isClosed} onClose={closeModal2} />
                )}
              </span>
            </div>
            <div className="viewContentMyStore">
              <div className="headerViewContentMyStore">
                <div className="title-cate">
                  <p className="title-shop">{shop.name}</p>
                  <p className="cate-shop">{shop.category}</p>
                </div>
                <div className="create-category">
                  <input
                    ref={inputCategory}
                    type="text"
                    placeholder="Crea una categoría para tus productos!"
                  />
                  <button onClick={createCategory}>Crear</button>
                </div>
              </div>
              <div className="cont-cards-products">
                {product.map((product) => (
                  <CardProductMyShop
                    key={product._id}
                    product={product}
                    setReload={setReload}
                    reload={reload}
                  />
                ))}
              </div>

              <div className="containerCardsMyStore"></div>
            </div>
          </>
        ) : (
          <div className="viewCreateNewStore">
            <h2 className="newShop">Nueva Tienda</h2>
            <div className="viewNewShopIMG">
              <img src={loginbg} alt="" className="loginBg" />
            </div>
            <div className="viewNewShop">
              <form ref={formInfo} className="contInputNewStore">
                <span>
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="name"
                    onChange={(e) => e.target.value}
                    required
                  />
                </span>
                <span>
                  <label>Seleccioná la categoría</label>
                  <CategoriesSelect style="selectMyStore" />
                </span>
                <span>
                  <label>País</label>
                  <input type="text" required name="country" />
                </span>
                <span>
                  <label>Ciudad</label>
                  <input type="text" name="city" required />
                </span>
                <span>
                  <label>Celular</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Ej: 3584834852"
                    onChange={(e) => e.target.value}
                    required
                  />
                </span>
                <span className="tokenClass">
                  <label>Token Mercado Pago</label>
                  <div className="contTokenInpBtn">
                    <input
                      className="inputToken"
                      type="text"
                      name="token"
                      required
                    />
                    <button
                      className="buttonToken"
                      type="button"
                      onClick={showInfoToken}
                    >
                      Cómo conseguir este token?
                    </button>
                  </div>
                </span>
                <ModalTokenInfo
                  showModal={showModal}
                  setShowModal={setShowModal}
                />
                <span>
                  <label>Cargar Logo</label>
                  <input
                    type="file"
                    name="photo"
                    id="file-logo"
                    className="inputfile inputfile-3"
                    accept="image/png image/jpg image/jpeg image/bmp image/gif"
                    data-multiple-caption="{count} files selected"
                    onChange={handleFileSelect}
                    hidden
                  />
                  <label htmlFor="file-logo" className="logoUpload">
                    <span>Seleccionar archivo</span>
                  </label>
                </span>
                <span>
                  <label>Cargar Banner</label>
                  <input
                    type="file"
                    name="banner"
                    id="file-banner"
                    accept="image/png image/jpg image/jpeg image/bmp image/gif"
                    className="inputfile inputfile-3"
                    data-multiple-caption="{count} files selected"
                    onChange={handleFileBanner}
                    hidden
                  />
                  <label htmlFor="file-banner" className="logoUpload">
                    <span>Seleccionar archivo</span>
                  </label>
                </span>
                <span>
                  <label>Descripción</label>
                  <textarea
                    name="description"
                    id=""
                    cols="30"
                    rows="5"
                    required
                  ></textarea>
                </span>
                <button className="submitButton" onClick={handleNewShop}>
                  Crear
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
