
import Select from "react-select"
import { styles } from '../../utils/selectStyles'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { requestBooking } from "../../redux/actions/room"
import { useParams } from "react-router-dom"
import { useAlert } from "../../utils/alert"
import Loading from "../other/Loading"
const DiscussionRoomBooking = () => {
  const { user, isAuthenticated } = useSelector(state => state.user)
  console.log(user)
  const [name, setName] = useState(isAuthenticated && user ? user.name : "")
  const [rollNo, setRollNo] = useState(isAuthenticated && user ? user.rollNo : "")
  const [email, setEmail] = useState(isAuthenticated && user ? user.email : "")
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()
  const [purpose, setPurpose] = useState("")
  const dispatch = useDispatch()
  const { id } = useParams()
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(requestBooking(id, name, rollNo, email, startTime, endTime, purpose))
  }
  const { loading, error, message } = useSelector(state => state.room)
  const alert = useAlert()
  useEffect(() => {
    alert(message, error, "/my-requests")
  }, [error, message])
  return (
    loading ? <Loading /> : <section className='w-full h-screen bg-zinc-200'>
      <form action="" onSubmit={submitHandler}>

        <label htmlFor="">
          <span>Name</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} ></input>
        </label>

        {isAuthenticated && user.role === "student" ? <label htmlFor="">
          <span>Roll No</span>
          <input type="text" value={rollNo} onChange={(e) => setRollNo(e.target.value)} ></input>
        </label> : ""}

        <label htmlFor="">
          <span>Email</span>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} ></input>
        </label>

        <label htmlFor="">
          <span>Start Time</span>
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} ></input>
        </label>

        <label htmlFor="">
          <span>End Time</span>
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} ></input>
        </label>

        <label htmlFor="">
          <span>Purpose</span>
          <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} name="" id="" placeholder="Write purpose here"></textarea>
        </label>
        <button className='!w-full primary-btn'>Submit</button>
      </form>
    </section>
  )
}

export default DiscussionRoomBooking