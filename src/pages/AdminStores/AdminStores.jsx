import React, { useEffect, useRef, useState } from 'react'
import './AdminStores.css'
import loupe from '../../images/loupe.png'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { Link as Anchor } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function AdminStores() {
    let search = useRef()
    let [shops, setShops] = useState([])
    let [cantShops, setCantShops] = useState(0)
    let [users, setUsers] = useState([])
    let [reload, setReload] = useState(false)
    const [confirmationToast, setConfirmationToast] = useState(null);
    let [selectedCategorie, setSelectedCategorie] = useState('')
    const token = localStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    async function getUsers() {
        let url = `http://localhost:8080/admin/users/`
        if (token) {
            await axios.get(url, headers).then(res => {
                setUsers(res.data.users)
            })
        }
    }
    useEffect(() => {
        getUsers()
    }, [])

    async function getShops() {
        if (search.current) {
            let url = `http://localhost:8080/admin/shops/?name=${search.current.value}&category=${selectedCategorie}`
            await axios.get(url, headers).then(res => {
                setShops(res.data.shops)
                setCantShops(res.data.cantShops)
            })
        }
    }

    useEffect(() => {
        getShops()
    }, [reload, selectedCategorie])

    async function handleDeleteShopAlert(e) {
        const promise = new Promise(async (resolve, reject) => {
            const toastId = toast(
                <div>
                    Are you sure you want to delete this shop?
                    <div>
                        <button className="my-button" onClick={() => reject()}>Cancel</button>
                        <button className="my-button-delete" onClick={() => resolve()}>Delete</button>
                    </div>
                </div>,
                {
                    position: 'top-center',
                    duration: 2000,
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
            pending: 'Deleting shop...',
            error: 'Error deleting shop...',
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
        let shopId = e.target.id
        let shop = shops.find(shop => shop._id == shopId)
        let user = users.find(user => user._id == shop.user_id)
        let userId = user._id
        let url = `http://localhost:8080/admin/shops/delete/${shopId}/${userId}`
        await axios.delete(url, headers).then(res => toast.success(res.data.message))
        setReload(!reload)
    }

    async function desactivateOne(e) {
        let shopId = e.target.id
        let url = `http://localhost:8080/admin/shops/desactivate/${shopId}`
        await axios.put(url, null, headers).then(res => toast.success(res.data.message))
        setReload(!reload)
    }

    function handleCategories(e) {
        setSelectedCategorie(e.target.value)
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
                            <h3>Shops ({cantShops})</h3>
                            <div className='admin-search'>
                                <label htmlFor='search'><img src={loupe} alt='loupe' /></label>
                                <input type='text' ref={search} id='search' placeholder='Search shops by name...' onChange={getShops} />
                            </div>
                            <select onChange={handleCategories} className='categorySelect' name="category">
                                <option value=''>
                                    All Categories
                                </option>
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
                                <option value="Gift and Souvenir Shops">Gift and Souvenir Shops</option>
                                <option value="Health and Wellness">Health and Wellness</option>
                                <option value="Art and Craft Stores">Art and Craft Stores</option>
                                <option value="Technology and Gadgets">Technology and Gadgets</option>
                                <option value="Travel and Tourism">Travel and Tourism</option>
                                <option value="Second-hand or Thrift Stores">
                                    Second-hand or Thrift Stores
                                </option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className='adminItem-container'>
                            <div className='container-title'>
                                <p className='admin-propTitle'>NAME</p>
                                <p className='admin-propTitle category'>CATEGORY</p>
                                <p className='admin-propTitle country'>COUNTRY</p>
                            </div>
                        </div>
                        <div className='items-container'>
                            {
                                shops.length ?
                                    shops.map((shop, i) => {
                                        let card = <div className='adminItem-container' key={i}>
                                            <div className='container-title'>
                                                <Anchor to={`/shop/` + shop._id} className='admin-propName'>{shop.name}</Anchor>
                                                <p className='admin-prop category'>{shop.category}</p>
                                                <p className='admin-prop country'>{shop.country}</p>
                                            </div>
                                            <div className='admin-btns'>
                                                {shop.active ? <p className='admin-desactivate' id={shop._id} onClick={desactivateOne}>Desactivate</p> : <p className='admin-desactivate' id={shop._id} onClick={desactivateOne}>Activate</p>}
                                                <p className='admin-delete' id={shop._id} onClick={handleDeleteShopAlert}>Delete</p>
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
