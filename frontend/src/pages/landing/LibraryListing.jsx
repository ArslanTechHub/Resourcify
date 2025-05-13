import React, { useEffect } from 'react'
import Select from 'react-select'
import { styles } from '../../utils/selectStyles'
import { useDispatch, useSelector } from 'react-redux'
import { getAllLibraryItems } from '../../redux/actions/library'
import LibraryItem from '../../components/LibraryItem'
const LibraryListing = () => {
    const { items } = useSelector(state => state.library)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getAllLibraryItems())
    }, [])
    return (
        <section className='w-full min-h-screen bg-gray-100'>
            <div className="flex items-center justify-between title-row">
                <h3 className='text-3xl text-black font-clemente-regular'>Library Items</h3>

            </div>

            <div className="w-full grid grid-cols-4 xl:grid-cols-5 mt-[16px] gap-[16px]">
                {items &&
                    items.length > 0 &&
                    items
                        .slice(0, 5)
                        .map((i, index) => (
                            <LibraryItem
                                key={index}
                                image={i.file.url}
                                title={i.title}
                                status={i.status}
                                description={i.subtitle}
                                id={i._id}
                            />
                        ))}
            </div>




        </section>
    )
}

export default LibraryListing
