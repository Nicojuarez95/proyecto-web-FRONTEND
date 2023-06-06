import React, { useEffect, useState } from "react";
import "./OneStore.css";
import loupe from "../../images/loupe.png";
import arrowDown from "../../images/arrowdown.png";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link as Anchor } from "react-router-dom";
import HeaderShop from "../../components/HeaderShop/HeaderShop";
import { ArrowLeft } from "../../components/Icons/Icons";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import wpp from "../../images/wpp.png"

export default function OneStore() {
  let params = new URLSearchParams(window.location.search);
  let payment_id = params.get("payment_id");
  let status = params.get("status");
  let [products, setProducts] = useState([]);
  let [cartProducts, setCartProducts] = useState([]);
  let [cartPrice, setCartPrice] = useState(0);
  let [categories, setCategories] = useState([]);
  let [shop, setShop] = useState({});
  let shopId = useParams().shopId;
  let search = useRef();
  let [category, setCategory] = useState("");
  let [sort, setSort] = useState(1);
  let user = JSON.parse(localStorage.getItem("user"));
  let token = localStorage.getItem("token");
  let headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (status === "approved" && cartProducts.length) {
      toast.success(`Thanks for buying from us ${user.name}`); // esto tiene que ser un modal
      let template = 0;
      cartProducts.forEach((cartProduct) => {
        template += cartProduct.unit_price * cartProduct.quantity;
      });
      setCartPrice(template);
      handlePayment(template);
    }
  }, [cartProducts]);

  async function handlePayment(price) {
    try {
      let url = `https://proyecto-web-backend-host.onrender.com/payment/${shopId}`;
      let data = {
        payment_id: payment_id,
        totalValue: price,
        products: cartProducts,
      };
      await axios.post(url, data, headers).then((res) => {
        updateProducts();
      });
    } catch (err) {
      console.log(err);
    }
  }

  function updateProducts() {
    try {
      if (status === "approved" && cartProducts.length) {
        cartProducts.forEach((cartProduct) => {
          products.forEach((product) => {
            if (product.name == cartProduct.title) {
              let url = `https://proyecto-web-backend-host.onrender.com/product/update/${product._id}`;
              let data = {
                name: product.name,
                price: product.price,
                photo: product.photo,
                stock: product.stock,
                category: product.category,
                description: product.description,
              };
              data.stock -= cartProduct.quantity;
              axios.put(url, data, headers);
            }
          });
        });
        deleteAll();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteAll() {
    try {
      if (status === "approved" && cartProducts.length) {
        let url = `https://proyecto-web-backend-host.onrender.com/shop/${shopId}/cart/deleteall`;
        await axios.delete(url, headers);
      }
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

  function handleSort() {
    if (sort === 1) {
      setSort(-1);
    }
    if (sort === -1) {
      setSort(1);
    }
  }

  async function getProducts() {
    let productsUrl = `https://proyecto-web-backend-host.onrender.com/shop/${shopId}/products?name=${search.current.value}&category=${category}&sort=${sort}`;
    try {
      await axios
        .get(productsUrl)
        .then((res) => setProducts(res.data.products));
    } catch (err) {
      console.log(err);
    }
  }

  async function getCartProducts() {
    try {
      if (token) {
        let url = `https://proyecto-web-backend-host.onrender.com/shop/${shopId}/cart`;
        await axios.get(url, headers).then((res) => {
          setCartProducts(res.data.products);
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

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
    getProducts();
    getCartProducts();
  }, [shopId]);

  useEffect(() => {
    getProducts();
  }, [sort, category]);

  function handleOptionChange(e) {
    setCategory(e.target.value);
  }

  function handleCategoryChange(e) {
    setCategory(e.target.textContent);
  }

  async function getCategories() {
    let url = `https://proyecto-web-backend-host.onrender.com/categories/${shopId}`;
    try {
      await axios.get(url).then((res) => setCategories(res.data.categories));
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  const phone = shop.phone
  
  return (
    <>
      <HeaderShop />
      <div className="productsContainer">
        <div className="firtsFilterContainer">
          <Anchor to="/shops" className="backToShops">
            <ArrowLeft />
            <p>Regresar a tiendas</p>
          </Anchor>
          <div className="sortContainer" onClick={handleSort}>
            <p>Clasificar</p>
            <img src={arrowDown} alt="arrow down" />
          </div>
        </div>
        <hr />
        <div className="secondFilterContainer">
          <div className="categoriesFilter">
            <div className="searchFilter">
              <div className="containerInput">
                <label htmlFor="search">
                  <img src={loupe} alt="loupe" />
                </label>
                <input
                  ref={search}
                  onChange={getProducts}
                  type="text"
                  id="search"
                  placeholder="Encuentre su producto"
                />
              </div>
            </div>
            <hr />
            <h3>Categorías</h3>
            <select onChange={handleOptionChange}>
              <option value="">Todas las categorías</option>
              {categories.map((category, i) => {
                let card = (
                  <option key={i} value={category.category_name}>
                    {category.category_name}
                  </option>
                );
                return card;
              })}
            </select>
            <h4
              onClick={() => {
                setCategory("");
              }}
            >
              Todas las categorias
            </h4>
            {categories.map((category, i) => {
              let card = (
                <h4 key={i} onClick={handleCategoryChange}>
                  {category.category_name}
                </h4>
              );
              return card;
            })}
            <hr />
          </div>
          <div className="displayedProducts">
            {products?.map((product, i) => {
              let card = (
                <Anchor to={`/shop/${shop._id}/product/${product._id}`} key={i}>
                  <section id={product._id} className="productCard">
                    <img src={product.photo} alt="product" />
                    <div className="infoCardProduct">
                      <h3>{product.name}</h3>
                      <p>${product.price}</p>
                    </div>
                    
                  </section>
                </Anchor>
              );
              return card;
            })}
          </div>
        </div>
        <Anchor to={`https://api.whatsapp.com/send?phone=${phone}`} target="_blank" className="btnWpp"><img src={wpp} /></Anchor>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
