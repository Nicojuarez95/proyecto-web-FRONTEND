import React from 'react'
import './AdminProducts.css'
import loupe from '../../images/loupe.png'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { Link as Anchor } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminProducts() {
  let search = useRef()
  let [products, setProducts] = useState([])
  let [cantProducts, setCantProducts] = useState(0)
  let [shops, setShops] = useState([])
  let [reload, setReload] = useState(false)
  const [confirmationToast, setConfirmationToast] = useState(null);
  const token = localStorage.getItem('token');
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  async function getShops() {
    let url = `http://localhost:8080/admin/shops/`
    await axios.get(url, headers).then(res => setShops(res.data.shops))
  }

  useEffect(() => {
    getShops()
  }, [])

  async function getProducts() {
    let url = `http://localhost:8080/admin/products/?name=${search.current.value}`
    await axios.get(url, headers).then(res => {
      setProducts(res.data.products)
      setCantProducts(res.data.cantProducts)
    })
  }

  useEffect(() => {
    getProducts()
  }, [reload])

  async function handleDeleteProductAlert(e) {
    const promise = new Promise(async (resolve, reject) => {
      const toastId = toast(
        <div>
          Are you sure you want to delete this product?
          <div>
            <button className="my-button" onClick={() => reject()}>Cancel</button>
            <button className="my-button-delete" onClick={() => resolve()}>Delete</button>
          </div>
        </div>,
        {
          position: 'top-center',
          icon: '🗑️',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            height: "100px",
          },
        }
      );
      setConfirmationToast(toastId);
    });

    toast.promise(promise, {
      pending: 'Deleting user...',
      error: 'Error deleting user...',
      position: 'top-center',
      icon: '🗑️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        height: "100px",
      },
    }).then(() => {
      deleteOne(e);
      toast.dismiss(confirmationToast);
    }).catch(() => {
      toast.dismiss(confirmationToast);
      setConfirmationToast(null);
    });
  }

  async function deleteOne(e) {
    let productId = e.target.id
    let url = `http://localhost:8080/admin/products/delete/${productId}`
    await axios.delete(url, headers).then(res => toast.success(res.data.message))
    setReload(!reload)
  }

  const user = JSON.parse(localStorage.getItem("user"));
  let navigate = useNavigate()
  useEffect(() => {
    if (!user.admin) {
      navigate('/')
    }
  }, [])

  return (
    <>
      {
        user.admin ? <div className='admin-view'>
          <div className='admin-content'>
            <div className='filter-container'>
              <h3>Products ({cantProducts})</h3>
              <div className='admin-search'>
                <label htmlFor='search'><img src={loupe} alt='loupe' /></label>
                <input type='text' ref={search} id='search' placeholder='Search products by name...' onChange={getProducts} />
              </div>
            </div>
            <div className='adminItem-container'>
              <div className='container-title'>
                <p className='admin-propTitle'>NAME</p>
                <p className='admin-propTitle stock'>STOCK</p>
                <p className='admin-propTitle shop'>SHOP</p>
              </div>
            </div>
            <div className='items-container'>
              {
                products.length ?
                  products.map((product, i) => {
                    let card = <div className='adminItem-container' key={i}>
                      <div className='container-title'>
                        <p className='admin-prop'>{product.name}</p>
                        <p className='admin-prop stock'>{product.stock}</p>
                        {
                          shops.map((shop, i) => {
                            if (shop._id == product.store_id) {
                              return <Anchor to={'/shop/' + shop._id} className='admin-propName shop' key={i}>{shop.name}</Anchor>
                            }
                          })
                        }
                      </div>
                      <div className='admin-btns'>
                        <p className='admin-delete' id={product._id} onClick={handleDeleteProductAlert}>Delete</p>
                      </div>
                    </div>
                    return card
                  })
                  : <></>
              }
            </div>
          </div>
          <Toaster position='top-right' />
        </div> : <></>
      }
    </>
  )
}
