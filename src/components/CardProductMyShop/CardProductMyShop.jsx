import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import "./cardproductMyShop.css";
import toast from 'react-hot-toast';

export default function CardProductMyShop(props) {
  const { product, setReload, reload } = props;

  const productNameRef = useRef();
  const productStockRef = useRef();
  const productPriceRef = useRef();

  const [confirmationToast, setConfirmationToast] = useState(null);

  async function handleDeleteProduct() {
    const toastId = toast(
      <div>
        Are you sure you want to delete this product?
        <div>
          <button className="my-button" onClick={() => toast.dismiss(toastId)}>Cancel</button>
          <button className="my-button-delete" onClick={deleteProduct}>Delete</button>
        </div>
      </div>,
      {
        position: 'top-center',
        duration: 8000,
        icon: '🗑️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          height:"100px",
        },
      }
    );
    setConfirmationToast(toastId);
  }

  async function deleteProduct() {
    const token = localStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.delete(`http://localhost:8080/product/delete/${product._id}`, headers);
      toast.success(res.data.message);
      setReload(!reload);
    } catch (error) {
      toast.error(error.data.message);
    } finally {
      // Cierra la alerta de confirmación
      toast.dismiss(confirmationToast);
    }
  }
  
  
  async function handleSaveProduct(){
    const productBody = {
      name: productNameRef.current.value,
      stock: productStockRef.current.value,
      price: productPriceRef.current.value,
      description: product.description,
      photo: product.photo,
      category: product.category
    }
    const token = localStorage.getItem("token");
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.put(`http://localhost:8080/product/update/${product._id}`, productBody, headers);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Error");
    }
  };


  return (
    <div className="CardProduct">
      <div className="img-card-product">
        <img src={product.photo} className='img-product-card' />
      </div>
      <div className="details-card-product">
        <div className="contInputProduct">
          <p className="text-inputs">Edit title</p>
          <input ref={productNameRef} className="input-edit-product" type="text" defaultValue={product.name}  />
          <div className="cont-2-input">
            <div className="stock">
              <p className="text-inputs">Stock</p>
              <div className='stock-units'>
                <p>Units</p>
                <input ref={productStockRef} className="input-edit-product-priceStock" type="text" defaultValue={product.stock} />
              </div>
            </div>
            <div className="price">
              <p className="text-inputs">Price</p>
              <div className='price-ar'>
                <p>AR$</p>
                <input ref={productPriceRef} className="input-edit-product-priceStock" type="text" defaultValue={product.price} />
              </div>
              
            </div>
          </div>
        </div>
        <div className="buttonsProducts">
          <button className="button-product-delete" onClick={handleDeleteProduct}>Delete</button>
          <button className="button-product" id={product._id} onClick={handleSaveProduct}>Save</button>
        </div>
      </div>
    </div>
  );
}


