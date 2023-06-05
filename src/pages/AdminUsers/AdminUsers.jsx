import React from 'react'
import './AdminUsers.css'
import loupe from '../../images/loupe.png'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { Link as Anchor } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import arrowDown from '../../images/arrowdown.png'
import { useNavigate } from 'react-router-dom'

export default function AdminUsers() {
    let search = useRef()
    let [users, setUsers] = useState([])
    let [cantUsers, setCantUsers] = useState(0)
    let [shops, setShops] = useState([])
    let [reload, setReload] = useState(false)
    let [sort, setSort] = useState(-1)
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

    async function getUsers() {
        let url = `http://localhost:8080/admin/users/?name=${search.current.value}&sort=${sort}`
        await axios.get(url, headers).then(res => {
            setUsers(res.data.users)
            setCantUsers(res.data.cantUsers)
        })
    }

    useEffect(() => {
        getUsers()
    }, [reload, sort])

    async function handleDeleteUserAlert(e) {
        const promise = new Promise(async (resolve, reject) => {
            const toastId = toast(
                <div>
                    Are you sure you want to delete this user?
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
        let userId = e.target.id
        let url = `http://localhost:8080/admin/users/delete/${userId}`
        await axios.delete(url, headers).then(res => toast.success(res.data.message))
        setReload(!reload)
    }

    function handleSeller() {
        if (sort === 1) {
            setSort(-1)
        }
        if (sort === -1) {
            setSort(1)
        }
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
                            <h3>Users ({cantUsers})</h3>
                            <div className='admin-search'>
                                <label htmlFor='search'><img src={loupe} alt='loupe' /></label>
                                <input type='text' ref={search} id='search' placeholder='Search users by name...' onChange={getUsers} />
                            </div>
                        </div>
                        <div className='adminItem-container'>
                            <div className='container-title'>
                                <p className='admin-propTitle '>NAME</p>
                                <div className='sort seller' onClick={handleSeller}>
                                    <p>IS SELLER</p>
                                    <img src={arrowDown} />
                                </div>
                                <p className='admin-propTitle shop users'>SHOP</p>
                            </div>
                        </div>
                        <div className='items-container'>
                            {
                                users.length ?
                                    users.map((user, i) => {
                                        let userShop = false
                                        let card = <div className='adminItem-container' key={i}>
                                            <div className='container-title'>
                                                <p className='admin-prop'>{user.name + " " + user.last_name}</p>
                                                {user.is_seller ? <p className='admin-prop seller'>Yes</p> : <p className='admin-prop seller'>No</p>}
                                                {
                                                    shops.map((shop, i) => {
                                                        if (shop.user_id == user._id) {
                                                            userShop = true
                                                            return <Anchor to={'/shop/' + shop._id} className='admin-propName shop' key={i}>{shop.name}</Anchor>
                                                        }
                                                    })
                                                }
                                                {userShop ? <></> : <p className='admin-prop shop'>-</p>}
                                            </div>
                                            <div className='admin-btns'>
                                                <p className='admin-delete' id={user._id} onClick={handleDeleteUserAlert}>Delete</p>
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