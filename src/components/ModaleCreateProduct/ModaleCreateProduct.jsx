import React, { useEffect, useRef, useState } from "react";
import "./modaleCreateProduc.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AWS from "aws-sdk";

export default function Modal({ onClose }) {
  const formInfo = useRef();
  const [reload, setReload] = useState();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [shop, setShop] = useState({});
  const [categories, setCategories] = useState([]);

  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    region: "sa-east-1",
  });

  useEffect(() => {
    getMyShop();
  }, []);

  async function getMyShop() {
    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const url = "http://localhost:8080/shop/me";
      const response = await axios.get(url, headers);
      setShop(response.data.shop);
      setReload(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function createProduct(e) {
    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    e.preventDefault();
    const url = "http://localhost:8080/product/create";
    const data = {
      name: formInfo.current[0].value,
      category: formInfo.current[1].value,
      price: formInfo.current[2].value,
      stock: formInfo.current[3].value,
      photo: formInfo.current[4].value,
      description: formInfo.current[5].value,
    };
    try {
      if (selectedPhoto) {
        const photo = selectedPhoto;
        const photoName = `${photo.name}`;
        const params = {
          Bucket: "lanceapp",
          Key: photoName,
          Body: photo,
        };
        const responseS3 = await s3.upload(params).promise();
        data.photo = responseS3.Location;
      }
      const res = await axios.post(url, data, headers);
      toast.success(res.data.message);
      onClose(true);
      setReload(true);
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

  function handlePhotoSelect(event) {
    setSelectedPhoto(event.target.files[0]);
  }

  async function getCategories() {
    let url = `http://localhost:8080/categories/${shop._id}`;
    try {
      if (shop._id) {
        await axios.get(url).then((res) => setCategories(res.data.categories));
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getCategories();
  }, [shop._id]);

  return (
    <div className="modalContainer2">
      <div className="contentModal2">
        <h3>Agregá tu producto</h3>
        <div className="containerMyShop">
          <form className="containerMyShop2" ref={formInfo}>
            <span>
              <label>Nombre</label>
              <input type="text" />
            </span>
            <span className="selecCategory">
              <label>Categoria</label>
              <select className="selectCate" name="" id="">
                {categories.map((category, i) => {
                  let card = (
                    <option
                      className="optionCate"
                      key={i}
                      value={category.category_name}
                    >
                      {category.category_name}
                    </option>
                  );
                  return card;
                })}
              </select>
            </span>
            <span>
              <label>Precio</label>
              <input type="number"  placeholder='Ej:5000'/>
            </span>
            <span>
              <label>Stock</label>
              <input type="number" />
            </span>
            <span>
              <label>Seleccionar foto</label>
              <input
                type="file"
                name="banner"
                id="file-banner"
                accept="image/png image/jpg image/jpeg image/bmp image/gif"
                className="inputfile inputfile-3"
                onChange={handlePhotoSelect}
                data-multiple-caption="{count} files selected"
                hidden
              />
              <label htmlFor="file-banner" className="uploadInput">
                <span>Seleccionar archivo</span>
              </label>
            </span>
            <span>
              <label>Descripción</label>
              <textarea
                className="textAreaModal"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
            </span>

            <div className="buttonsContainerModal">
              <button onClick={onClose}>Cancelar</button>
              <button onClick={createProduct}>Crear</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
