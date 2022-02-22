import React from 'react'

const TreeTitle = React.memo(({ title, visible }) => {
  return <>
    <div className='title'>
      {title}
    </div>
    <div className='visible'>
      {visible}
    </div>
  </>
})

export default TreeTitle