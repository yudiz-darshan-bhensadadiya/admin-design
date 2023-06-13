import React, { useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import { logout } from 'query/auth/auth.query'
import { route } from 'shared/constants/AllRoutes'
import { toaster } from 'helper/helper'
import CustomModal from 'shared/components/Modal'
import UserIcon from 'assets/images/User'
import logo from 'assets/images/logo.svg'
import { profile } from 'query/profile/profile.query'

function Header({ isOpen }) {
  const navigate = useNavigate()
  const query = useQueryClient()
  const [clickedLogOut, setClickedLogOut] = useState(false)
  const [show, setShow] = useState(false)
  const [profileName, setProfileName] = useState('')
  const handleClose = () => setShow(false)

  const { isLoading, isFetching } = useQuery('logoutUser', () => logout(), {
    enabled: clickedLogOut,
    onSuccess: (res) => {
      localStorage.clear()
      navigate('/login')
      toaster(res?.data?.message)
    },
    onError: () => {
      localStorage.clear()
      navigate('/login')
    }
  })

  useQuery('profile', () => profile(), {
    select: (data) => data?.data?.data,
    onSuccess: (res) => {
      setProfileName(res.sUserName)
    },
    onError: () => {
      setProfileName('')
    }
  })

  const handleLogout = () => setShow(!show)

  const handleConfirmLogout = () => {
    setClickedLogOut(true)
    query.invalidateQueries('logoutUser')
  }

  function handleEditProfile() {
    navigate(route.editProfile)
  }

  function handleChangePass() {
    navigate(route.changePassword)
  }

  return (
    <header className='header'>
      <div className='header-left'>
        <Link className='logo' to={route.dashboard}>
          <img src={logo} alt='run to learn' />
          <b style={{ fontSize: '20px' }}>RUN TO LEARN</b>
        </Link>
      </div>
      <div className='header-right'>
        <div className='user-name'>{profileName}</div>
        <Dropdown>
          <Dropdown.Toggle className='header-btn'>
            <div className='img d-flex align-items-center justify-content-center'>
              <UserIcon />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu className='up-arrow'>
            <Dropdown.Item onClick={handleEditProfile}>
              <i className='icon-account'></i>
              <FormattedMessage id='myProfile' />
            </Dropdown.Item>
            <Dropdown.Item onClick={handleChangePass}>
              <i className='icon-lock'></i>
              <FormattedMessage id='changePassword' />
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleLogout()}>
              <i className='icon-logout'></i>
              <FormattedMessage id='logout' />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button className='header-btn user-btn'>
          <i className='icon-notifications'></i>
        </Button>
      </div>
      <CustomModal
        open={show}
        handleClose={handleClose}
        handleConfirm={handleConfirmLogout}
        disableHeader
        bodyTitle='Are you sure you want to logout ?'
        isLoading={isLoading || isFetching}
      />
    </header>
  )
}

export default Header
