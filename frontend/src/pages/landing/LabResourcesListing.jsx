import React, { useEffect } from 'react'
import { styles } from '../../utils/selectStyles'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { getLabResources } from '../../redux/actions/lab'
import LabResource from '../../components/LabResource'

const LabResourcesListing = () => {
    const dispatch = useDispatch()
    const { items } = useSelector(state => state.lab)
    useEffect(() => {
        dispatch(getLabResources())
    }, [])
    return (
        <section className='w-full min-h-screen bg-gray-100'>
            <div className="flex items-center justify-between title-row">
                <h3 className='text-3xl text-black font-clemente-regular'>Lab Resources</h3>

            </div>

            <div className="w-full grid grid-cols-4 xl:grid-cols-5 mt-[16px] gap-[16px]">
                {items &&
                    items.length > 0 &&
                    items

                        .map((i, index) => (
                            <LabResource
                                key={index}
                                image={i.image.url}
                                title={i.title}
                                status={i.status || "available"}
                                description={i.instructions}
                                id={i._id}
                            />
                        ))}
            </div>




        </section>
    )
}

export default LabResourcesListing
