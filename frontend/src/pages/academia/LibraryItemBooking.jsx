import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../other/Loading'
import { createLendItemsRequest } from '../../redux/actions/library'
import { useParams } from 'react-router-dom'
import { useAlert } from '../../utils/alert'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

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
    const { loading, error, message, lendItems } = useSelector(state => state.library)
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createLendItemsRequest(id, name, regNo, department, email, phone, startDate, endDate))
    }

    const { user, isAuthenticated } = useSelector(state => state.user)
    const alert = useAlert()
    useEffect(() => {
        alert(message, error, "/library")
    }, [message, error])

    // Donut chart data (simulate loading and dynamic data)
    const [donutLoading, setDonutLoading] = useState(true);
    const [donutData, setDonutData] = useState(null);

    useEffect(() => {
        // Remove the 800ms timeout, load immediately
        setDonutLoading(true);
        let statusCounts = { approved: 0, pending: 0, rejected: 0, unknown: 0 };
        if (lendItems && Array.isArray(lendItems)) {
            lendItems.forEach(item => {
                const status = (item.status || "unknown").toLowerCase();
                if (status === "approved") statusCounts.approved += 1;
                else if (status === "pending") statusCounts.pending += 1;
                else if (status === "rejected") statusCounts.rejected += 1;
                else statusCounts.unknown += 1;
            });
        } else {
            // fallback static data
            statusCounts = { approved: 5, pending: 3, rejected: 2, unknown: 1 };
        }
        setDonutData({
            labels: ['Approved', 'Pending', 'Rejected', 'Unknown'],
            datasets: [
                {
                    label: 'Requests',
                    data: [
                        statusCounts.approved,
                        statusCounts.pending,
                        statusCounts.rejected,
                        statusCounts.unknown,
                    ],
                    backgroundColor: ['#4ade80', '#facc15', '#f87171', '#94a3b8'],
                    borderWidth: 1,
                },
            ],
        });
        setDonutLoading(false);
    }, [lendItems]);

    return (
        loading ? <Loading /> : <section className='bg-zinc-200 min-h-screen'>
            {/* Donut Chart loads with spinner, like on tile click */}
            <div className="p-6 mb-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
                <h2 className="mb-4 text-xl font-semibold">Lending Requests Status Overview</h2>
                <div className="max-w-xs mx-auto min-h-[220px] flex items-center justify-center">
                    {donutLoading || !donutData ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="inline-block w-12 h-12 border-4 border-current rounded-full spinner-border animate-spin border-t-transparent" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <Doughnut data={donutData} />
                    )}
                </div>
            </div>

            <form onSubmit={submitHandler} className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <label htmlFor="" className="block mb-4">
                    <span>Name</span>
                    <input placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full border rounded px-3 py-2 mt-1" />
                </label>

                <label className={`${isAuthenticated && user.role === "student" ? "block" : "hidden"} mb-4`}>
                    <span>Registration No</span>
                    <input placeholder='Enter Your Registration No' value={regNo} onChange={(e) => setRegNo(e.target.value)} type="text" className="w-full border rounded px-3 py-2 mt-1" />
                </label>

                <label htmlFor="" className="block mb-4">
                    <span>Department</span>
                    <input placeholder='Enter Your Department' value={department} onChange={(e) => setDepartment(e.target.value)} type="text" className="w-full border rounded px-3 py-2 mt-1" />
                </label>

                <label htmlFor="" className="block mb-4">
                    <span>Email</span>
                    <input placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full border rounded px-3 py-2 mt-1" />
                </label>

                <label htmlFor="" className="block mb-4">
                    <span>Phone</span>
                    <input placeholder='Enter Your Phone Number' value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="w-full border rounded px-3 py-2 mt-1" />
                </label>

                <label htmlFor="" className="block mb-4">
                    <span>Start Date</span>
                    <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className="w-full border rounded px-3 py-2 mt-1" />
                </label>

                <label htmlFor="" className="block mb-6">
                    <span>End Date</span>
                    <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" className="w-full border rounded px-3 py-2 mt-1" />
                </label>

                <button className='!w-full primary-btn'>Submit</button>
            </form>
        </section>
    )
}

export default LibraryItemBooking