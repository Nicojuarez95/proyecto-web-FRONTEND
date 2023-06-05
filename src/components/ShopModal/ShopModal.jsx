import React, { useEffect } from 'react'
import './ShopModal.css'
import { useState } from 'react';
import ShopModalActions from '../../store/ShopModal/actions'
import { useDispatch } from 'react-redux'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import x from '../../images/Union.png'
import toast, { Toaster } from 'react-hot-toast';

const { renderModal } = ShopModalActions

export default function ShopModal() {
    let shopId = useParams().shopId
    let [shop,setShop] = useState({})
    const dispatch = useDispatch()
    let [reload, setReload] = useState(false)
    let [products, setProducts] = useState([])
    let [fullPrice, setFullPrice] = useState(0)
    let token = localStorage.getItem('token')
    let headers = { headers: { 'Authorization': `Bearer ${token}` } }

    async function handleLessStock(e) {
        try {
            let product = products.find(product => product._id == e.target.id)
            if(product.quantity === 1){
                let url = `http://localhost:8080/shop/cart/deleteone/${product._id}`
                await axios.delete(url, headers).then(res => toast.success(res.data.message))
                setReload(!reload)
            }else{
                let data = {
                    quantity: product.quantity -= 1
                }
                let url = `http://localhost:8080/shop/cart/update/${product._id}`
                await axios.put(url, data, headers).then(res => {})
                setReload(!reload)
            }
        } catch (err) {
            console.log(err)
        }
    }

    async function handleMoreStock(e) {
        try {
            let product = products.find(product => product._id == e.target.id)
            if(product.quantity !== product.maxStock){
                let data = {
                    quantity: product.quantity += 1
                }
                let url = `http://localhost:8080/shop/cart/update/${product._id}`
                await axios.put(url, data, headers).then(res => {})
                setReload(!reload)
            }
        } catch (err) {
            console.log(err)
        }
    }

    function closeModal() {
        dispatch(renderModal({ state: false }))
    }

    async function getProducts() {
        try {
            if(token){
                let url = `http://localhost:8080/shop/${shopId}/cart`
                await axios.get(url, headers).then(res => setProducts(res.data.products))
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getProducts()
        handleMaxStock()
    },[reload])

    async function deleteOne(e, id) {
        try {
            let productId = e.target.id
            let url = `http://localhost:8080/shop/cart/deleteone/${productId}`
            await axios.delete(url, headers).then(res => toast.success(res.data.message))
            setReload(!reload)
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

    async function deleteAll() {
        try {
            let url = `http://localhost:8080/shop/${shopId}/cart/deleteall`
            await axios.delete(url, headers).then(res => toast.success(res.data.message))
            setReload(!reload)
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

    function handleMaxStock(){
        try{
            products.forEach( product => {
                if(product.quantity > product.maxStock){
                    let data = {
                        quantity: product.maxStock
                    }
                    let url = `http://localhost:8080/shop/cart/update/${product._id}`
                    axios.put(url, data, headers).then(res => toast.success('Some items stock has been modified because they exceed the limit'))
                }
            })
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        handleMaxStock()
    },[products])

    let shopUrl = `http://localhost:8080/shop/${shopId}`
    async function getShop() {
        try {
            await axios.get(shopUrl).then(res => setShop(res.data.shop))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getShop()
    }, [shopId])

    function handlePay() {
        let data = {
            products,
            token: shop.token,
            shopId: shop._id
        }
        axios.post("http://localhost:8080/payment", data, headers)
            .then( res => window.location.href = res.data.response.body.init_point ); // te redirige al link de pago
    }

    useEffect( () => {
        let template = 0
        products.map(product => {
            template += product.unit_price*product.quantity
        })
        setFullPrice(template)
    },[products])
    
    return (
        <div className='shopModal'>
            <div className='shopModalContainer'>
                <div className='modalTop'>
                    <h3>Cart ({products.length})</h3>
                    <img src={x} onClick={closeModal} className='close-x' />
                </div>
                <hr />
                <div className='modalContent'>
                    {
                        products.length ?
                            products?.map((product, i) => {
                                let card = <section className='modalCard' key={i}>
                                    <img className='imgProduct' src={product.photo} alt={product?.title} />
                                    <section className='detailsProduct'>
                                        <h3>{product.category}</h3>
                                        <h2>{product.title}</h2>
                                        <p>${product.unit_price}</p>
                                        <div className='btnStock'>
                                            <button id={product._id} onClick={handleLessStock}>-</button>
                                            <p>{product.quantity}</p>
                                            <button id={product._id} onClick={handleMoreStock}>+</button>
                                        </div>
                                    </section>
                                    <section className='descriptionProduct'>
                                        <div>
                                            <h3>DESCRIPTION</h3>
                                            <img src={x} id={product._id} onClick={deleteOne} className='close-x' />
                                        </div>
                                        <p>{product.description}</p>
                                    </section>
                                </section>
                                return card
                            })
                            :
                            <div style={{ height: '100%', display: 'flex', 'justifyContent': 'center', 'alignItems': 'center' }}>
                                <h2 style={{ textAlign: 'center' }}>No products in cart</h2>
                            </div>
                    }
                </div>
                <div className='modalBtns'>
                    { products.length ? <p className='buyCart' onClick={handlePay}>BUY CART (${fullPrice})</p> : <></> }
                    { products.length ? <p className='deleteCart' onClick={deleteAll}>CLEAR CART</p> : <></> }
                </div>
            </div>
            <Toaster position='top-right' />
        </div>
    )
}