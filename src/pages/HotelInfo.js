import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchHotelsCom, isArrayNull, handleNullObj } from 'lib'
import hotelPhotos from '../hotelPhotos'

import './HotelInfo.css'

const HotelInfo = () => {
    const location = useLocation()
    const { hotelInfo } = handleNullObj(location.state)
    const { id, name, starRating, rating, badgeText, old, current, info, totalPrice, summary } = handleNullObj(hotelInfo)
    console.log(id, name, starRating, rating, badgeText, old, current, info, totalPrice, summary)

    const [photos, setPhotos] = useState([])
    const [index, setIndex] = useState(0)

    useEffect( async () => {
        const photos = await getHotelPhotos(`https://hotels-com-provider.p.rapidapi.com/v1/hotels/photos?hotel_id=${id}`)
        console.log(photos)
        setPhotos(photos)
    }, [])

    const getHotelPhotos = async (url) => {
        // const data = await fetchHotelsCom(url)
        // return data

        return hotelPhotos
    }

    const changePhoto = (index) => {
        setIndex(index)
    }

    return (
        <div className='HotelInfo-container'>
            <div className='HotelInfo-header'>
                <div className='HotelInfo-hotel-name'>{name} <span>{starRating}성급</span></div>
                <div className='HotelInfo-hotel-price'>
                    <div className='HotelInfo-price-per-oneday'><span>{old}</span> {current}</div>
                    <div className='HotelInfo-price-per-oneday-title'>{info}</div>
                    <div className='HotelInfo-price-total'>{totalPrice[1]} {totalPrice[3]}</div>
                    <div className='HotelInfo-price-summary'>{summary}</div>
                </div>
            </div>
            <div className='HotelInfo-photos'>
                <div className='HotelInfo-main-photo'>
                    <img src={!isArrayNull(photos)? photos[index].mainUrl : ''} alt="hotel-main-photo"/>
                </div>
                <div className='HotelInfo-sub-photos'>
                    {!isArrayNull(photos) && photos.map( (photo, index) => {
                        if(index < 4){
                            return (
                                <div className='HotelInfo-sub-photo' key={index} onClick={() => changePhoto(index)}>
                                    <img src={photo.mainUrl} alt='hotel-sub-photo'/>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}

export default HotelInfo