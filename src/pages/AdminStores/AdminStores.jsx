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
                    Estás seguro que quieres eliminar esta tienda?
                    <div>
                        <button className="my-button" onClick={() => reject()}>Cancelar</button>
                        <button className="my-button-delete" onClick={() => resolve()}>Eliminar</button>
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
                            <h3>Tiendas ({cantShops})</h3>
                            <div className='admin-search'>
                                <label htmlFor='search'><img src={loupe} alt='loupe' /></label>
                                <input type='text' ref={search} id='search' placeholder='Buscar tienda por nombre...' onChange={getShops} />
                            </div>
                            <select onChange={handleCategories} className='categorySelect' name="category">
                            <option value=''>
                                Todas las categorías
                            </option>
                            <option value="Ropa y Accesorios">
                                Ropa y Accesorios
                            </option>
                            <option value="Zapatos">Zapatos</option>
                            <option value="Belleza y Cuidado Personal">
                                Belleza y Cuidado Personal
                            </option>
                            <option value="Electrónicos">Electrónicos</option>
                            <option value="Hogar y Jardín">Hogar y Jardín</option>
                            <option value="Juguetes y Juegos">Juguetes y Juegos</option>
                            <option value="Libros y Música">Libros y Música</option>
                            <option value="Deportes y Actividades al Aire Libre">
                                Deportes y Actividades al Aire Libre
                            </option>
                            <option value="Comida y Bebidas">Comida y Bebidas</option>
                            <option value="Mascotas">Mascotas</option>
                            <option value="Automóviles y Motocicletas">Automóviles y Motocicletas</option>
                            <option value="Joyería y Relojes">Joyería y Relojes</option>
                            <option value="Suministros de Oficina y Papelería">
                                Suministros de Oficina y Papelería
                            </option>
                            <option value="Servicios Financieros y Bancarios">
                                Servicios Financieros y Bancarios
                            </option>
                            <option value="Tiendas de Regalos y Souvenirs">Tiendas de Regalos y Souvenirs</option>
                            <option value="Salud y Bienestar">Salud y Bienestar</option>
                            <option value="Tiendas de Arte y Manualidades">Tiendas de Arte y Manualidades</option>
                            <option value="Tecnología y Gadgets">Tecnología y Gadgets</option>
                            <option value="Viajes y Turismo">Viajes y Turismo</option>
                            <option value="Tiendas de Segunda Mano o de Oportunidad">
                                Tiendas de Segunda Mano o de Oportunidad
                            </option>
                            <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div className='adminItem-container'>
                            <div className='container-title'>
                                <p className='admin-propTitle'>NOMBRE</p>
                                <p className='admin-propTitle category'>CATEGORIA</p>
                                <p className='admin-propTitle country'>PAIS</p>
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
                                                {shop.active ? <p className='admin-desactivate' id={shop._id} onClick={desactivateOne}>Desactivar</p> : <p className='admin-desactivate' id={shop._id} onClick={desactivateOne}>Activate</p>}
                                                <p className='admin-delete' id={shop._id} onClick={handleDeleteShopAlert}>Eliminar</p>
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
