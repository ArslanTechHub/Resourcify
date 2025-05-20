import Facility from "../../components/Facility"
import { facilities } from "../../utils/staticData"

const Facilities = () => {
    return (
        <section className='!h-auto sec-section'>
            <h2>Discover Our Key Facilities</h2>
            <div className="grid grid-cols-3 gap-[16px] mt-[16px]">
                {facilities.map((f, index) => (
                    <Facility key={index} icon={f.icon} title={f.title} description={f.paragraph} />
                ))}
            </div>
        </section>
    )
}

export default Facilities
