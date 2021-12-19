import React from 'react'
import './StarRatingFilter.css'

import { isArrayNull } from 'lib'

const StarRatingFilter = ({ title, items, searchHotelsWithFilter, querystring }) => {
    const reversedItems = items.sort((a, b) => {
        return a.value - b.value;
      })
    
    return (
        <div className='StarRatingFilter-container'>
            <div className='StarRatingFilter-title'>{title}</div>
            <div className='StarRatingFilter-btns'>
                {!isArrayNull(reversedItems) && reversedItems.map( (item, idx) => {
                    return (
                        <div className='StarRatingFilter-rating' key={item.value} onClick={() => searchHotelsWithFilter(querystring, item.value)}>{item.value}</div>
                    )
                })}
            </div>
        </div>
    )
}

export default StarRatingFilter