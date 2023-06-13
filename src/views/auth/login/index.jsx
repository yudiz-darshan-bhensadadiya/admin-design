import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { login } from 'query/auth/auth.query'
import { route } from 'shared/constants/AllRoutes'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { useMutation } from 'react-query'
import { toaster } from 'helper/helper'
import { EMAIL } from 'shared/constants'

function Login() {
  const navigate = useNavigate()
  const {
    register: fields,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'onSubmit' })
  const [showPassword, setShowPassword] = useState(true)

  function handlePasswordToggle() {
    setShowPassword(!showPassword)
  }

  const { mutate, isLoading } = useMutation(login, {
    onSuccess: (response) => {
      localStorage.setItem('token', response?.headers?.authorization)
      toaster(response?.data?.message, 'success')
      navigate(route.dashboard)
    }
  })

  function onSubmit(data) {
    mutate({ sEmail: data.sEmail, sPassword: data.sPassword })
  }

  useEffect(() => {
    document.title = 'Login'
  }, [])

  return (
    <>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} className='login-form'>
        <div className='title-b'>
          <div className='d-flex align-items-center'>
            <h2 className='title me-2 m-0'>
              <FormattedMessage id='signIn' />
            </h2>
            <b style={{ fontSize: 14, color: 'grey', fontStyle: 'italic' }}>( as Super Admin )</b>
          </div>
        </div>
        <Form.Group className='form-group'>
          <Form.Label>
            <FormattedMessage id='emailAddress' />
          </Form.Label>
          <Form.Control
            type='text'
            required
            name='sEmail'
            placeholder='Enter your email address'
            autoFocus
            className={errors.sEmail && 'error'}
            {...fields('sEmail', {
              required: { value: true, message: validationErrors.emailRequired },
              pattern: { value: EMAIL, message: validationErrors.email }
            })}
          />
          {errors.sEmail && <Form.Control.Feedback type='invalid'>{errors.sEmail.message}</Form.Control.Feedback>}
        </Form.Group>
        <Form.Group className='form-group'>
          <Form.Label>
            <FormattedMessage id='password' />
          </Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'password' : 'text'}
              required
              onPaste={(e) => {
                e.preventDefault()
                return false
              }}
              name='sPassword'
              placeholder='Enter your password'
              className={errors.sPassword && 'error'}
              {...fields('sPassword', {
                required: { value: true, message: validationErrors.passwordRequired },
                onChange: (e) => {
                  e.target.value = e?.target?.value?.trim()
                }
              })}
            />
            <Button onClick={handlePasswordToggle} variant='link' className='icon-right'>
              <i className={showPassword ? 'icon-visibility' : 'icon-visibility-off'}></i>
            </Button>
          </InputGroup>
          {errors.sPassword && <Form.Control.Feedback type='invalid'>{errors.sPassword.message}</Form.Control.Feedback>}
        </Form.Group>
        <Button variant='primary' type='submit' disabled={isLoading}>
          <FormattedMessage id='Login' /> {isLoading && <Spinner animation='border' size='sm' />}
        </Button>
      </Form>
      <Link to={route.forgotPassword} className='b-link'>
        <FormattedMessage id='forgotPassword' />?
      </Link>
    </>
  )
}

export default Login
