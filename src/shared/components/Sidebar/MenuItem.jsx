import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

function MenuItem({ item, isMenuOpen }) {
  const [isOpen, setIsOpen] = useState(false)
  const childPaths = item.children && item?.children?.map((i) => i?.path?.split('/')[1])
  const location = useLocation()
  const currentPathSlashIndex = location.pathname.split('/').length
  useEffect(() => {
    !isMenuOpen && setIsOpen(false)
  }, [isMenuOpen])

  return (
    <li className={isOpen ? 'open' : ''}>
      <NavLink
        to={item.path}
        activeclassName={`active ${!item.children && 'pe-none'} `}
        className={childPaths?.includes(location.pathname.split('/')[1]) ? 'active pe-none' : ''}
      >
        <i>
          <img src={item.icon} alt={isMenuOpen && item.title} />
        </i>
        {isMenuOpen && item.title}
        {item.children && isMenuOpen && (
          <i
            onClick={() => {
              setIsOpen(!isOpen)
            }}
            className='icon-arrow-drop-down drop-icon'
          ></i>
        )}
      </NavLink>
      {item.children && (
        <>
          <ul className={`left-arrow sidebar-dropdown dropdown-menu show big`}>
            {item?.children?.map((subItem) => {
              return (
                <li key={subItem.path}>
                  <NavLink
                    to={subItem.path}
                    activeclassName={`active ${(currentPathSlashIndex === 3 || currentPathSlashIndex === 2) && 'pe-none'}`}
                  >
                    {subItem.title}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </li>
  )
}
MenuItem.propTypes = {
  item: PropTypes.object,
  isMenuOpen: PropTypes.bool
}
export default MenuItem
