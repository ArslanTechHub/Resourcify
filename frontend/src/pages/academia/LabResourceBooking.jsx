import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createLendLabResourceRequest } from '../../redux/actions/lab'
import { useParams } from 'react-router-dom'
import Loading from '../other/Loading'
import { useAlert } from '../../utils/alert'

const LabResourceBooking = () => {
    const [name, setName] = useState("")
    const [regNumber, setRegNumber] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [department, setDepartment] = useState("")
    const [purpose, setPurpose] = useState("")
    const { user, isAuthenticated } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const { id } = useParams()
    const { loading, error, message } = useSelector(state => state.lab)

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createLendLabResourceRequest(name, regNumber, email, phone, department, id, purpose))
    }

    const alert = useAlert()

    useEffect(() => {
        alert(message, error, "/")
    }, [message, error])

    return (
        loading ? <Loading /> : (
            <section className='bg-zinc-200 min-h-screen'>
                <form onSubmit={submitHandler}>
                    <label>
                        <span>Name</span>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Your Name' />
                    </label>

                    <label className={`${isAuthenticated && user.role === "student" ? "block" : "hidden"}`}>
                        <span>Registration Number</span>
                        <input type="text" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} placeholder='Enter Your Registration Number' />
                    </label>

                    <label>
                        <span>Email</span>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Your Email' />
                    </label>

                    <label>
                        <span>Phone Number</span>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='Enter Your Phone Number' />
                    </label>

                    <label>
                        <span>Department</span>
                        <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder='Enter Your Department' />
                    </label>

                    <label>
                        <span>Purpose</span>
                        <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Write a proper purpose" className='!h-[150px]'></textarea>
                    </label>

                    <button className='!w-full primary-btn'>Submit</button>
                </form>
            </section>
        )
    )
}

export default LabResourceBooking
