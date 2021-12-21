import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { Review, Room } from 'components'
import { fetchHotelsCom, isArrayNull, handleNullObj } from 'lib'

import hotelPhotos from '../hotelPhotos'
import hotelReviews from '../hotelReviews'
import hotelDetail from '../hotelDetail'

import './HotelInfo.css'

const HotelInfo = () => {
    const location = useLocation()
    const { hotelInfo, bookingInfo } = handleNullObj(location.state)
    const { id, name, starRating, rating, badgeText, old, current, info, totalPrice, summary } = handleNullObj(hotelInfo)
    const { checkIn, checkOut, adultsNumber } = handleNullObj(bookingInfo)
    console.log(id, name, starRating, rating, badgeText, old, current, info, totalPrice, summary)
    console.log(checkIn, checkOut, adultsNumber)

    const [photos, setPhotos] = useState([])
    const [index, setIndex] = useState(0)
    const [reviews, setReviews] = useState([])
    const [details, setDetails] = useState(null)

    useEffect( async () => {
        const photos = await getHotelPhotos(`https://hotels-com-provider.p.rapidapi.com/v1/hotels/photos?hotel_id=${id}`)
        const reviews = await getReviews(`https://hotels-com-provider.p.rapidapi.com/v1/hotels/reviews?locale=en_US&hotel_id=${id}`)
        const details = await getDetailsOfHotel(`https://hotels-com-provider.p.rapidapi.com/v1/hotels/booking-details?adults_number=${adultsNumber}&checkin_date=${checkIn}&locale=ko_KR&currency=KRW&hotel_id=${id}&checkout_date=${checkOut}`)
        setPhotos(photos)
        setReviews(reviews)
        setDetails(details)
        console.log(details)
    }, [])

    const getHotelPhotos = async (url) => {
        // const data = await fetchHotelsCom(url)
        // return data

        return hotelPhotos
    }

    const changePhoto = (index) => {
        setIndex(index)
    }

    const getReviews = async (url) => {
        // const data = await fetchHotelsCom(url)
        // return data

        const { groupReview } = handleNullObj(hotelReviews)
        const { reviews } = !isArrayNull(groupReview) ? handleNullObj(groupReview[0]) : []

        return reviews
    }

    const getDetailsOfHotel = async (url) => {
        // const data = await fetchHotelsCom(url)
        // return data 

        return hotelDetail
    }

    const Rooms = () => {
        if(details){
            const { roomsAndRates } = handleNullObj(details)
            const { rooms } = handleNullObj(roomsAndRates)

            return (
                <>{!isArrayNull(rooms) && rooms.map( (room, id) => {
                    return (
                        <Room key={id} room={room}/>
                    )
                })}</>
            )
        }else{
            return <></>
        }
    }

    return (
        <div className='HotelInfo-container'>
            {/* 호텔 정보 보여주기 */}
            <div className='HotelInfo-header'>
                <div className='HotelInfo-hotel-name'>{name} <span>{starRating}성급</span></div>
                <div className='HotelInfo-hotel-price'>
                    <div className='HotelInfo-price-per-oneday'><span>{old}</span> {current}</div>
                    <div className='HotelInfo-price-per-oneday-title'>{info}</div>
                    <div className='HotelInfo-price-total'>{totalPrice[1]} {totalPrice[3]}</div>
                    <div className='HotelInfo-price-summary'>{summary}</div>
                </div>
            </div>

            {/* 호텔 사진 보여주기 */}
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

            {/* 호텔룸 정보 보여주기 */}
            <Rooms/>

            {/* 호텔 리뷰 보여주기 */}
            <div className='HotelInfo-reviews'>
                <div className='HotelInfo-total-review'>
                    <div className={`HotelInfo-rating-badge ${parseInt(rating) < 8 ? 'HotelInfo-rating-badge-gray' : ''}`}>{rating}</div>
                    <div className='HotelInfo-rating-badgeText'> {badgeText}</div>
                </div>
                <div className='HotelInfo-user-reviews'>{!isArrayNull(reviews) && reviews.map( (review, index) => {
                    return (
                        <Review key={index} review={review}/>
                    )
                })}</div>
            </div>
        </div>
    )
}

export default HotelInfo