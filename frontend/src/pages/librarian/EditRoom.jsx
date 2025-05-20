import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createRoom, getRoomById, updateRoom } from "../../redux/actions/room"
import Loading from "../other/Loading"
import { useAlert } from "../../utils/alert"
import { useParams } from "react-router-dom"

const EditRoom = () => {
    const [name, setName] = useState("")
    const [capacity, setCapacity] = useState(0)
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [file, setFile] = useState("")
    const { loading, error, message, room } = useSelector(state => state.room)
    const changeImageHandler = (e) => {
        setFile(e.target.files[0])
    }


    const { id } = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getRoomById(id))
        setName(room?.name)
        setCapacity(room?.capacity)
        setStartTime(room?.availabilityHours.start)
        setEndTime(room?.availabilityHours.end)
    }, [])

    const submitHandler = (e) => {
        e.preventDefault()
        const myForm = new FormData()
        myForm.append("name", name)
        myForm.append("capacity", capacity)
        myForm.append("startTime", startTime)
        myForm.append("endTime", endTime)
        myForm.append("file", file)

        dispatch(updateRoom(id, myForm))
    }

    const alert = useAlert()


    useEffect(() => {
        alert(message, error, "/librarian/rooms")
    }, [message, error])


    return (
        loading ? <Loading /> : <section className='w-full !p-0'>
            <form onSubmit={submitHandler} action="">
                <label htmlFor="">
                    <span>Name</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Enter Room Name' />
                </label>

                <label htmlFor="">
                    <span>Capacity</span>
                    <input value={capacity} onChange={(e) => setCapacity(e.target.value)} type="number" placeholder='Enter Room Capacity' />
                </label>

                <label htmlFor="">
                    <span>Start Time</span>
                    <input value={startTime} onChange={(e) => setStartTime(e.target.value)} type="time" placeholder='Enter Room Name' />
                </label>

                <label htmlFor="">
                    <span>End Time</span>
                    <input value={endTime} onChange={(e) => setEndTime(e.target.value)} type="time" placeholder='Enter Room Name' />
                </label>

                <label htmlFor="">
                    <span>Cover Image</span>
                    <input onChange={changeImageHandler} type="file" placeholder='Enter Room Name' />
                </label>

                <button className='w-full bg-accent p-2 text-white rounded-md mt-2'>Submit</button>
            </form>
        </section>
    )
}

export default EditRoom
