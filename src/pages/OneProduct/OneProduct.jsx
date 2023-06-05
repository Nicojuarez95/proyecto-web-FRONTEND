import React from 'react'
import './OneProduct.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import HeaderShop from '../../components/HeaderShop/HeaderShop'
import { Link as Anchor } from 'react-router-dom'
import { ArrowLeft } from '../../components/Icons/Icons'
import toast, { Toaster } from 'react-hot-toast'

export default function OneProduct() {
  let [product, setProduct] = useState({})
  let [quantity, setQuantity] = useState(0)
  let [maxStock, setMaxStock] = useState(1)

  let shopId = useParams().shopId
  let productId = useParams().productId

  let productUrl = `http://localhost:8080/product/${productId}`
  async function getProduct() {
    try {
      await axios.get(productUrl).then(res => setProduct(res.data.product))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    setMaxStock(product.stock)
  }, [product])

  useEffect(() => {
    getProduct()
  }, [productId])

  function handleLessStock() {
    if (quantity !== 0) {
      setQuantity(quantity - 1)
      product.stock++
    }
  }

  function handleMoreStock() {
    if (quantity !== maxStock) {
      setQuantity(quantity + 1)
      product.stock--
    }
  }

  async function handleCart() {
    try {
      let url = `http://localhost:8080/shop/${shopId}/createcartproduct`
      let token = localStorage.getItem('token')
      let headers = { headers: { 'Authorization': `Bearer ${token}` } }
      if (token) {
        if (quantity !== 0) {
          let data = {
            title: product.name,
            unit_price: product.price,
            photo: product.photo,
            quantity: product.stock,
            maxStock: maxStock,
            category: product.category,
            description: product.description,
          }
          data.quantity = quantity
          axios.post(url, data, headers).then(res => {
            toast.success(res.data.message)
            setQuantity(0)
            setMaxStock(product.stock)
          })
        } else {
          toast.error('The stock cannot be 0')
        }
      } else {
        toast.error('You need to Login')
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error('Network Error')
      } else {
        if (typeof error.response.data.message === 'string') {
          toast.error(error.response.data.message)
        } else {
          error.response.data.message.forEach(err => toast.error(err))
        }
      }
    }
  }

  return (
    <>
      <HeaderShop />
      <div className='product-Container'>
        <div className='product-Img'>
          <Anchor to={`/shop/${shopId}`} className='backToShops'>
            <ArrowLeft />
            <p>Back to Products</p>
          </Anchor>
          <img src={product.photo} alt={product?.name} />
        </div>
        <div className='product-Info'>
          <section className='product-Important'>
            <h3>{product.category}</h3>
            <h2>{product.name}</h2>
            <p>${product.price}</p>
          </section>
          <hr />
          <div className='product-Description'>
            {
              maxStock ? <div className='btnStock'>
                <button onClick={handleLessStock}>-</button>
                <p>{quantity}</p>
                <button onClick={handleMoreStock}>+</button>
              </div> : <></>
            }
            {maxStock ? <p className='stockText'>Only {product.stock} items in stock</p> : <p className='noStockText'>No Stock</p>}
            <p className='description-title'>Description</p>
            <p className='description-text'>{product.description}</p>
            {maxStock ? <button className='addToCart' onClick={handleCart}>ADD TO CART</button> : <></>}
          </div>
        </div>
      </div>
      <Toaster
        position="top-right"
      />
    </>
  )
}
