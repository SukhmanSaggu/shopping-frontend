import React from 'react'

const SectionTitle = ({SectionTitle1, SectionTitle2}) => {
  return (
    <div className='section-heading'>
        <h2>{SectionTitle1} <span>{SectionTitle2}</span></h2>
    </div>
  )
}

export default SectionTitle