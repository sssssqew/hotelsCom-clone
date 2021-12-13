import React from 'react'
import './AccordionItem.css'

const AccordionItem = ({ children, searchHotelsWithFilter, value, querystring }) => {
    return (
        <div className='AccordionItem-container'>
            <div className='AccordionItem-checker' onClick={() => searchHotelsWithFilter(querystring, value)}><input type='checkbox'/></div>
            <div className='AccordionItem-filter'>{children}</div>
        </div>
    )
}

export default AccordionItem