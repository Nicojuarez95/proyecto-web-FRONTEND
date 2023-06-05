import React, { useEffect, useRef, useState } from "react";
import "./modalmystore.css";
import axios from "axios";
import AWS from "aws-sdk";
import { toast } from "react-hot-toast";

export default function Modal({ onClose }) {
  const [shop, setShop] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [reload, setReload] = useState();
  const formInfo = useRef();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  const [confirmationToast, setConfirmationToast] = useState(null);

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
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateShop(e) {
    e.preventDefault();
    const url = "http://localhost:8080/shop/update";
    const data = {
      name: formInfo.current[0].value,
      category: shop.category,
      country: shop.country,
      city: shop.city,
      photo: "" || shop.photo,
      banner: "" || shop.banner,
      description: shop.description,
      token: shop.token,
      phone: shop.phone
    };

    try {
      if (selectedFile || selectedBanner) {
        if (selectedFile) {
          const file = selectedFile;
          const fileName = `${file.name}`;
          const params = {
            Bucket: "lanceapp",
            Key: fileName,
            Body: file,
          };
          const responseS3 = await s3.upload(params).promise();
          data.photo = responseS3.Location;
        }
        if (selectedBanner) {
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
      }
      const res = await axios.put(url, data, headers);
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

  function handleFileSelect(event) {
    setSelectedFile(event.target.files[0]);
  }
  function handleFileBanner(event) {
    setSelectedBanner(event.target.files[0]);
  }

  async function handleDeleteShopAlert(e) {
    e.preventDefault();
    const promise = new Promise(async (resolve, reject) => {
      const toastId = toast(
        <div>
          🗑️ Accept to delete your store?
          <div className="toastButtons">
            <button className="my-button" onClick={() => reject()}>
              Cancel
            </button>
            <button className="my-button-delete" onClick={() => resolve()}>
              Delete
            </button>
          </div>
        </div>,
        {
          position: "top-center",
          style: {
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            width: "20rem",
            background: "#fffff",
            color: "black",
            height: "100px",
          },
        }
      );
      setConfirmationToast(toastId);
    });

    toast
      .promise(promise, {
        pending: "Deleting shop...",
        error: "Error deleting shop...",
        position: "top-center",
        icon: "🗑️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          height: "100px",
        },
      })
      .then(() => {
        handleDeleteShop();
        toast.dismiss(confirmationToast);
      })
      .catch(() => {
        toast.dismiss(confirmationToast);
        setConfirmationToast(null);
      });
  }
  async function handleDeleteShop() {
    try {
      const response = await axios.delete(
        "http://localhost:8080/shop/delete",
        headers
      );
      toast.success(response.data.message, { duration: null });
      toast.dismiss(confirmationToast); // Cerrar el alerta
      setConfirmationToast(null); // Limpiar la variable de estado
      onClose(true);
      setReload(true);
      const user = JSON.parse(localStorage.getItem("user"));
      user.seller = false;
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      toast.error(error.data.message);
    }
  }

  return (
    <div className="modalContainer">
      <div className="contentModal">
        <h3>Edit your shop</h3>
        <div className="containerMyShop">
          <form className="containerMyShop" ref={formInfo}>
            <span>
              <label>Name</label>
              <input type="text" defaultValue={shop.name} />
            </span>
            <span>
              <label>Change your banner</label>
              <input
                type="file"
                name="banner"
                id="file-banner"
                accept="image/png image/jpg image/jpeg image/bmp image/gif"
                className="inputfile inputfile-3"
                onChange={handleFileBanner}
                data-multiple-caption="{count} files selected"
                hidden
              />
              <label htmlFor="file-banner" className="uploadInput">
                <span>Select File</span>
              </label>
            </span>
            <span>
              <label>Change your logo</label>
              <input
                type="file"
                name="photo"
                id="file-logo"
                className="inputfile inputfile-3"
                accept="image/png image/jpg image/jpeg image/bmp image/gif"
                onChange={handleFileSelect}
                data-multiple-caption="{count} files selected"
                hidden
              />
              <label htmlFor="file-logo" className="uploadInput">
                <span>Select File</span>
              </label>
            </span>

            <div className="buttonsContainerModal">
              <button onClick={onClose}>Cancel</button>
              <button onClick={handleUpdateShop}>Save Changes</button>
            </div>
            <div className="buttonsContainerModal">
              <button
                type="submit"
                id="deletebtn"
                onClick={handleDeleteShopAlert}
              >
                Delete shop
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
