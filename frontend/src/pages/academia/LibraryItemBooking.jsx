import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../other/Loading'
import { createLendItemsRequest } from '../../redux/actions/library'
import { useParams } from 'react-router-dom'
import { useAlert } from '../../utils/alert'

const LibraryItemBooking = () => {
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [name, setName] = useState("")
    const [regNo, setRegNo] = useState("")
    const [department, setDepartment] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const dispatch = useDispatch()
    const { id } = useParams()
    const { loading, error, message } = useSelector(state => state.library)
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createLendItemsRequest(id, name, regNo, department, email, phone, startDate, endDate))
    }

    const { user, isAuthenticated } = useSelector(state => state.user)
    const alert = useAlert()
    useEffect(() => {
        alert(message, error, "/library")
    }, [message, error])
    return (
        loading ? <Loading /> : <section className='bg-zinc-200 min-h-screen'>

            <form onSubmit={submitHandler}>
                <label htmlFor="">
                    <span>Name</span>
                    <input placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} type="text" />
                </label>

                <label className={`${isAuthenticated && user.role === "student" ? "block" : "hidden"}`}>
                    <span>Registration No</span>
                    <input placeholder='Enter Your Registration No' value={regNo} onChange={(e) => setRegNo(e.target.value)} type="text" />
                </label>

                <label htmlFor="">
                    <span>Department</span>
                    <input placeholder='Enter Your Department' value={department} onChange={(e) => setDepartment(e.target.value)} type="text" />
                </label>

                <label htmlFor="">
                    <span>Email</span>
                    <input placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                </label>

                <label htmlFor="">
                    <span>Phone</span>
                    <input placeholder='Enter Your Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
                </label>


                <label htmlFor="">
                    <span>Start Date</span>
                    <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" />
                </label>

                <label htmlFor="">
                    <span>End Date</span>
                    <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" />
                </label>

                <button className='!w-full primary-btn'>Submit</button>
            </form>

        </section>
    )
}

export default LibraryItemBooking
