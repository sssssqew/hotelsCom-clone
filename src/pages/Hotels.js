import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { fetchHotelsCom, isArrayNull, handleNullObj } from 'lib'
import hotelsData from '../hotelsData'
import { HotelItem, Accordion } from 'components'

import './Hotels.css'

const Hotels = () => {
    const location = useLocation()
    const { destinationId, checkIn, checkOut, adultsNumber } = handleNullObj(location.state)
    console.log(destinationId, checkIn, checkOut, adultsNumber)

    const [hotels, setHotels] = useState([])
    const [mapObj, setMapObj] = useState(null)
    const [filters, setFilters] = useState(null)

    useEffect( async () => {
        const { results, filters } = await getHotels()
        setHotels(results)
        setFilters(filters)

        const m = L.map('map')
        setMapObj(m)
    }, [])

    const getHotels = async () => {
        // const data = await fetchHotelsCom(`https://hotels-com-provider.p.rapidapi.com/v1/hotels/search?checkin_date=${checkIn}&checkout_date=${checkOut}&sort_order=STAR_RATING_HIGHEST_FIRST&destination_id=${destinationId}&adults_number=${adultsNumber}&locale=ko_KR&currency=KRW`)
        // console.log(data)

        const {searchResults: {results}, filters } = hotelsData
        
        return { results, filters }
    }

    
    const displayLocation = (lat, lon, msg) => {
        // console.log('inside:', mapObj)

        if(mapObj){
            const map = mapObj.setView([lat, lon], 13)

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map)

            L.marker([lat, lon]).addTo(map)
                .bindPopup(msg)
                .openPopup()
        }
    }

    const displayFilter = (e) => {
        const target = e.target.closest('.Accordion-container')
        const arrow = target.querySelector('.Accordion-arrow')
        const items = target.querySelector('.Accordion-items')
        console.log(target)
        console.log(arrow, items)

        arrow.classList.toggle('change-arrow')
        items.classList.toggle('expand-filter')

    }

    const AccordionList = () => {
        if(filters){
            const { neighbourhood, landmarks, accommodationType, facilities, themesAndTypes, accessibility } = handleNullObj(filters)
            const filterTypes = [
                {items: handleNullObj(neighbourhood).items, title: '위치 및 주변 지역'},
                {items: handleNullObj(landmarks).items, title: '랜드마크'},
                {items: handleNullObj(accommodationType).items, title: '숙박 시설 유형'},
                {items: handleNullObj(facilities).items, title: '시설'},
                {items: handleNullObj(themesAndTypes).items, title: '테마/유형'},
                {items: handleNullObj(accessibility).items, title: '장애인 편의 시설'},
            ]

            return (
                <div>{filterTypes.map( (filterType, id) => {
                    return (
                        <Accordion key={id} title={filterType.title} items={filterType.items} displayFilter={displayFilter}/>
                    )
                })}</div>
            )
        }else{
            return <></>
        }
    }

    const getLocation = (hotel) => {
        const { name, address, coordinate } = handleNullObj(hotel)
        const { streetAddress, locality, countryName } = handleNullObj(address)
        const { lat, lon } = handleNullObj(coordinate)
        const msg = `${name}<br/>${streetAddress}, ${locality}, ${countryName}`

        return { lat, lon, msg }
    }

    return (
        <div className='Hotels-container'>
            <div className='Hotels-filtered'>
                <AccordionList/>
            </div>
            <div className='Hotels-searched'>
                <div id="map"></div>
                {!isArrayNull(hotels) && hotels.map( hotel => {
                    const { lat, lon, msg } = getLocation(hotel)
                    displayLocation(lat, lon, msg)
                    return (
                        <HotelItem hotel={hotel} key={hotel.id}/>
                    )
                })}
            </div>
        </div>
    )
}

export default Hotels