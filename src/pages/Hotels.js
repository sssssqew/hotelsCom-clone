import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { fetchHotelsCom, isArrayNull, handleNullObj } from 'lib'
import hotelsData from '../hotelsData'
import { HotelItem, Accordion, Button, StarRatingFilter } from 'components'

import './Hotels.css'

const Hotels = () => {
    let query = {}
    const location = useLocation()
    const { destinationId, checkIn, checkOut, adultsNumber } = handleNullObj(location.state)
    console.log(destinationId, checkIn, checkOut, adultsNumber)

    const BASE_URL = `https://hotels-com-provider.p.rapidapi.com/v1/hotels/search?checkin_date=${checkIn}&checkout_date=${checkOut}&sort_order=STAR_RATING_HIGHEST_FIRST&destination_id=${destinationId}&adults_number=${adultsNumber}&locale=ko_KR&currency=KRW`

    const [hotels, setHotels] = useState([])
    const [mapObj, setMapObj] = useState(null)
    const [filters, setFilters] = useState(null)
    const [queryURL, setQueryURL] = useState(null)

    useEffect( async () => {
        console.log(BASE_URL)
        // 새로고침해도 필터값이 적용되려면 초기 렌더링시에는 BASE_URL 을 적용하고 queryURL 상태가 null 이 아니면 queryURL 을 적용하면 되지 않을까?
        const { results, filters } = await getHotels(BASE_URL)
        setHotels(results)
        setFilters(filters)

        const m = L.map('map')
        setMapObj(m)
    }, [])

    useEffect( async () => {
        console.log('query: ', queryURL)
        console.log(BASE_URL)
        let url = BASE_URL
        
        for(let prop in queryURL){
            const queryvalue = encodeURIComponent(queryURL[prop].join(','))
            url += `&${prop}=${queryvalue}`
            console.log(prop, queryvalue)
        }
        console.log('total url: ', url)

        const { results } = await getHotels(url)
        setHotels(results)
    }, [queryURL])

    const getHotels = async (url) => {
        // const data = await fetchHotelsCom(url)
        // console.log(data)
        // const {searchResults: {results}, filters } = data

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

    const searchHotelsWithFilter = (querystring, value) => {
        console.log('search with filter', querystring, value)
        query = {...query, [querystring]: [...query[querystring] ?? [] , value]}
        console.log('query in filter function: ', query)

    }

    const searchHotels = () => {
        setQueryURL(query)
        console.log('seach ')
    }

    const FilterList = () => {
        if(filters){
            const { neighbourhood, landmarks, accommodationType, facilities, themesAndTypes, accessibility, starRating } = handleNullObj(filters)
            const starRatingTypes = {items: handleNullObj(starRating).items, title: '숙박 시설 등급', querystring: 'star_rating_ids'}
            const filterTypes = [
                {items: handleNullObj(neighbourhood).items, title: '위치 및 주변 지역', querystring: 'landmark_id'},
                {items: handleNullObj(landmarks).items, title: '랜드마크', querystring: 'landmark_id'},
                {items: handleNullObj(accommodationType).items, title: '숙박 시설 유형', querystring: 'accommodation_ids'},
                {items: handleNullObj(facilities).items, title: '시설', querystring: 'amenity_ids'},
                {items: handleNullObj(themesAndTypes).items, title: '테마/유형', querystring: 'theme_ids'},
                {items: handleNullObj(accessibility).items, title: '장애인 편의 시설', querystring: 'amenity_ids'},
            ]

            return (
                <>
                    <StarRatingFilter title={starRatingTypes.title} items={starRatingTypes.items} searchHotelsWithFilter={searchHotelsWithFilter} querystring={starRatingTypes.querystring}/>
                    <div>{filterTypes.map( (filterType, id) => {
                        return (
                            <Accordion key={id} title={filterType.title} items={filterType.items} displayFilter={displayFilter} searchHotelsWithFilter={searchHotelsWithFilter} querystring={filterType.querystring}/>
                        )
                })}</div>
                </>
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
                <FilterList/>
                <Button handleClick={searchHotels}>호텔 검색</Button>
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