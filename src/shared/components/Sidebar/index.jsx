import React from 'react'
import { Button } from 'react-bootstrap'
import { sidebarConfig } from './SidebarConfig'
import MenuItem from './MenuItem'
import useMediaQuery from 'shared/hooks/useMediaQuery'

function SideBar({ isOpen, setIsOpen }) {
  const width = useMediaQuery('(max-width: 800px)')

  return (
    <div className={`side-bar ${width ? !isOpen && 'expanded' : isOpen && 'expanded'}`}>
      <div className='menu'>
        <ul className='p-0 m-0'>
          {sidebarConfig.map((item, index) => {
            return <MenuItem key={index} item={item} isMenuOpen={width ? !isOpen : isOpen} />
          })}
        </ul>
        <Button onClick={() => setIsOpen(!isOpen)} variant='link' className='open-btn square lh-1 p-1'>
          <i className='icon-sidebar'></i>
        </Button>
      </div>
    </div>
  )
}

export default SideBar
