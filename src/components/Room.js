import React, { useState } from 'react'
import { isArrayNull, handleNullObj } from 'lib'
import { Modal } from 'components'

import './Room.css'

const Room = ({ room }) => {
    // console.log('Room:', room)

    const { images, name, maxOccupancy, ratePlans, additionalInfo } = handleNullObj(room)
    const { messageTotal, messageChildren } = handleNullObj(maxOccupancy)
    const { description, details } = handleNullObj(additionalInfo)
    const { amenities } = handleNullObj(details)

    const [open, setOpen] = useState(false)

    const controlScrollbar = (control) => {
        document.documentElement.style.overflow = control
    }

    const showAdditionalRoomInfo = () => {
        controlScrollbar('hidden') // 스크롤바 숨기기
        setOpen(true)
    }
    const hideAdditionalRoomInfo = () => {
        controlScrollbar('') // 스크롤바 보여주기
        setOpen(false)
    }
    const RoomThumbnail = () => {
        return (
            <div className='Room-thumbnail'>
                <img src={!isArrayNull(images) && images[0].thumbnailUrl}/>
            </div>
        )
    }
    const RoomInfo = () => {
        return (
            <div className='Room-info'>
                <div className='Room-name'>{name}</div>
                <div className='Room-max-occupancy'>{messageTotal}<br/>{messageChildren}</div>
                <div className='Room-more-info' onClick={showAdditionalRoomInfo}>객실 정보 보기</div>
            </div>
        )
    }
    const RatePlan = ({ ratePlan }) => {
        const { cancellations, features, welcomeRewards, price } = handleNullObj(ratePlan)
        const { current, info, totalPricePerStay } = handleNullObj(price)
        const totalPrice = totalPricePerStay? totalPricePerStay.split(/[<>()]/) : []
        
        return (
            <div className='Room-rateplan'>
                <Modal open={open}>
                    <div className='Modal-header'>
                        <div className='Modal-close' onClick={hideAdditionalRoomInfo}>X</div>
                        <div className='Modal-room-type'>{name}</div>
                    </div>
                    <div className='Modal-body'>
                        <div className='Modal-thumbnail-container'>
                            <div className='Modal-thumbnail'>
                                <img src={images[0].fullSizeUrl} alt='Modal-room-thumbnail'/>
                            </div>
                            <div className='Modal-maxOccupancy'>{messageTotal} {messageChildren}</div>
                        </div>
                        <div className='Modal-room-amenity' dangerouslySetInnerHTML={{ __html: description }}></div>
                        <div className='Modal-room-facility'>
                            <div className='Modal-room-details-text'>객실 세부 정보</div>
                            <div className='Modal-room-details'>{!isArrayNull(amenities) && amenities.map( (amenity, id) => {
                                return (
                                    <li key={id}>{amenity}</li>
                                )
                            })}</div>
                        </div>
                    </div>
                </Modal>
                <div className='Room-features'>
                    <div className='Room-features-title'>{!isArrayNull(cancellations) && handleNullObj(cancellations[0]).title}</div>
                    <div className='Room-features-additionalInfo'>{!isArrayNull(cancellations) && handleNullObj(cancellations[0]).additionalInfo}</div>
                    <div className='Room-features-descriptions'>
                        {!isArrayNull(features) && features.map( (feature, id) => {
                            return (
                                <div key={id} className='Room-features-description'>{feature.title}</div>
                            )
                        })}
                    </div>
                </div>
                <div className='Room-welcomeRewards'>
                    <div>Hotels.com™ 호텔스닷컴 리워드<br/>적립<br/>사용</div>
                </div>
                <div className='Room-price'>
                    <div className='Room-price-per-day'>{current}</div>
                    <div className='Room-price-info'>{info}</div>
                    <div className='Room-price-total'>{totalPrice[3]} : {totalPrice[1].split(':')[0]}</div>
                </div>
            </div>
        )
    }
    const RoomRatePlans = () => {
        return (
            <>{!isArrayNull(ratePlans) && ratePlans.map( (ratePlan, id) => {
                return (
                    <RatePlan key={id} ratePlan={ratePlan}/>
                )
            })}
            </>
        )
    }
    return ( 
        <div className='Room-container'>
            <div className='Room-summary'>
                <RoomThumbnail/>
                <RoomInfo/>
            </div>
            <div className='Room-plan'>
                <RoomRatePlans/>
            </div>
        </div>
    )
}
export default Room