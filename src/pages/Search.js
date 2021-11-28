import React, { useState } from 'react'

import { Input, Button, Caption } from 'components'
import { fetchHotelsCom, isArrayNull } from 'lib'
import { useNavigate } from 'react-router-dom'

import queryData from '../queryData'

import './Search.css'

const Search = () => {
    const [destination, setDestination] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [adultsNumber, setAdultsNumber] = useState(1) 

    const [captions, setCaptions] = useState([]) // 자동완성 메뉴 
    const [open, setOpen] = useState('hide')   // 자동완성 메뉴 온오프
    const [index, setIndex] = useState(0)     // 자동완성 메뉴 하이라이트 변경
    const [destinationId, setDestinationId] = useState(0)

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        console.log(name, value)

        switch(name){
            case 'destination':
                value ? setOpen('show') : setOpen('hide')
                executeAutoCaption(value)
                setDestination(value)
                break;
            case 'check-in':
                setCheckIn(value)
                break;
            case 'check-out':
                setCheckOut(value)
                break;
            case 'adults-number':
                setAdultsNumber(value)
                break;
        }
        

    }

    // 자동완성 기능 구현
    const executeAutoCaption = async (query) => {
        //  const data = await getCaptions(query)
        //  const { suggestions } = data
        const { suggestions } = queryData
        const captionsItems = []

        if(!isArrayNull(suggestions)){
            suggestions.map(suggestion => {
                const { entities } = suggestion
                captionsItems.push(...entities)
            })
        }
        // console.log('captions: ',captionsItems)
        setCaptions(captionsItems)
        setHighlight() // 사용자 검색에 따라 하이라이트 변경
    }
    const getCaptions = async (query) => {
        console.log('get captions ...')
        // const data = await fetchHotelsCom(`https://hotels-com-provider.p.rapidapi.com/v1/destinations/search?query=${query}&currency=KRW&locale=ko_KR`)
        // return data
    }
    const setCaption = (e) => {
        const target = e.target.closest('.Caption-container')
        console.log(target)
        // console.log(target.dataset.destinationid)

        setDestination(target.innerText)
        setDestinationId(target.dataset.destinationid)
        setOpen('hide')
    }
    const setHighlight = () => {
        captions.map( (captionItem, id) => {
            captionItem.caption.includes(destination) ? setIndex(id) : null
        })
    }
    const changeCaptionHightlight = (e) => {
        // console.log(e.keyCode)
        const captionsLength = captions.length

        if(e.keyCode === 40){
            index < captionsLength - 1 ? setIndex(index+1) : setIndex(0)
        }else if(e.keyCode === 38){
            index > 0 ? setIndex(index-1) : setIndex(captionsLength - 1)
        }else if(e.keyCode === 13){
            const target = document.getElementById(index)
            console.log(target)
            // console.log(target.dataset.destinationid)

            setDestination(target.innerText)
            setDestinationId(target.dataset.destinationid)
            setOpen('hide')
        }
    }

    const searchHotels = () => {
        console.log('search hotels ...')
        console.log(destinationId, checkIn, checkOut, adultsNumber)
        navigate('/hotels', { state : { destinationId, checkIn, checkOut, adultsNumber } })
    }

    const Captions = ({captions}) => {
        let captionUI = null;
        // console.log('captionUI: ',captions)
        if(!isArrayNull(captions)){
            captionUI = captions.map( (captionItem, id) => {
                return <Caption key={captionItem.destinationId} id={id} destinationId={captionItem.destinationId} caption={captionItem.caption} setCaption={setCaption} highlight={index}></Caption>
            })
        }
        return <>{captionUI}</>
    }

    return (
        <div className='Search-container'>
           <div className='Search-inputs'>
                <div className='destination-container'>
                    <Input name='destination' type='text' placeholder='목적지를 입력하세요 ...' width='large' value={destination} onChange={handleChange} onKeyUp={changeCaptionHightlight}/>
                    <div className={`captions ${open}`}>{<Captions captions={captions}/>}</div>
                </div>
                <Input name='check-in' type='date' placeholder='체크인' width='small' value={checkIn} onChange={handleChange}/>
                <Input name='check-out' type='date' placeholder='체크아웃' width='small' value={checkOut} onChange={handleChange}/> 
                <Input name='adults-number' type='number' placeholder='인원수' width='middle' min={1} max={7} value={adultsNumber} onChange={handleChange}/>
                <Button handleClick={searchHotels} color='blue' size='long'>검색</Button>
           </div>
        </div>
    )
}

export default Search