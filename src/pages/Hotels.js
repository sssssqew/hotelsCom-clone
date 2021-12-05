import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { fetchHotelsCom, isArrayNull } from 'lib'
import hotelsData from '../hotelsData'
import { HotelItem } from 'components'

import './Hotels.css'

const Hotels = () => {
    const location = useLocation()
    const { destinationId, checkIn, checkOut, adultsNumber } = location.state
    console.log(destinationId, checkIn, checkOut, adultsNumber)

    const [hotels, setHotels] = useState([])

    useEffect( async () => {
        const hotelsList = await getHotels()
        setHotels(hotelsList)
    }, [])

    const getHotels = async () => {
        // const data = await fetchHotelsCom(`https://hotels-com-provider.p.rapidapi.com/v1/hotels/search?checkin_date=${checkIn}&checkout_date=${checkOut}&sort_order=STAR_RATING_HIGHEST_FIRST&destination_id=${destinationId}&adults_number=${adultsNumber}&locale=ko_KR&currency=KRW`)
        // console.log(data)

        const {searchResults: {results}} = hotelsData
        console.log(results)
        
        return results
    }

    return (
        <div className='Hotels-container'>
            {!isArrayNull(hotels) && hotels.map( hotel => {
                return (
                    <HotelItem hotel={hotel} key={hotel.id}/>
                )
            })}
        </div>
    )
}

export default Hotels