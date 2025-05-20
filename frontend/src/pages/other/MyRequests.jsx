import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyRequests } from '../../redux/actions/user'
import { formatDateAndTime } from '../../utils/date'
import { Link } from 'react-router-dom'

const MyRequests = () => {
    const dispatch = useDispatch()
    const { libraryItems, labResources, roomBookings } = useSelector(state => state.other)
    useEffect(() => {
        dispatch(getMyRequests())
    }, [])


    return (
        <section className='w-full flex flex-col gap-4 bg-gray-100 min-h-screen'>
            <div className='w-full border border-zinc-200 p-4 rounded-md bg-white'>
                <h2 className='mb-4 text-3xl'>Library Items Requests</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Sr</th>
                            <th>Date</th>
                            <th>Item</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {libraryItems && libraryItems.length > 0 && libraryItems.map((item, index) => <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{formatDateAndTime(item.createdAt).formattedDate}</td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <img src={item?.item?.file?.url} alt="" className="w-[56px] h-[56px] rounded object-cover object-center" />
                                    <span>{item?.item?.title}</span>
                                </div>
                            </td>
                            <td className='capitalize'>{item.status}</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>

            <div className='w-full border border-zinc-200 p-4 rounded-md bg-white'>
                <h2 className='mb-4 text-3xl'>Lab Resources Requests</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Sr</th>
                            <th>Date</th>
                            <th>Item</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {labResources && labResources.length > 0 && labResources.map((item, index) =>
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{formatDateAndTime(item.createdAt).formattedDate}</td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <img src={item?.item?.image?.url} alt="" className="w-[56px] h-[56px] rounded object-cover object-center" />
                                        <span>{item?.item?.title}</span>
                                    </div>
                                </td>
                                <td className='capitalize'>{item.status}</td>
                                <td className='capitalize'>
                                    <div className="actions">
                                        {
                                            item.status === "approved" ? <Link target='_blank' to={item.item.link} className='bg-accent p-2 rounded-md text-white w-[100px] text-center'>Get</Link> : ""
                                        }
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className='w-full border border-zinc-200 p-4 rounded-md bg-white'>
                <h2 className='mb-4 text-3xl'>Discussion Rooms Request</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Sr</th>
                            <th>Date</th>
                            <th>Room</th>
                            <th>Time Duration</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {roomBookings && roomBookings.length > 0 && roomBookings.map((item, index) => <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{formatDateAndTime(item.createdAt).formattedDate}</td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <img src={item?.room?.coverImage?.url} alt="" className="w-[56px] h-[56px] rounded object-cover object-center" />
                                    <span>{item?.item?.title}</span>
                                </div>
                            </td>
                            <td>{formatDateAndTime(item.startTime).formattedTime} to {formatDateAndTime(item.endTime).formattedTime}</td>
                            <td className='capitalize'>{item.status}</td>
                        </tr>)}
                    </tbody>

                </table>
            </div>
        </section>
    )
}

export default MyRequests
