import React, { useEffect } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { useMutation } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword } from 'query/auth/auth.query'
import { EMAIL } from 'shared/constants'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { route } from 'shared/constants/AllRoutes'
import { toaster } from 'helper/helper'

function ForgotPassword() {
  const navigate = useNavigate()
  const {
    register: fields,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'onSubmit' })

  const { mutate, isLoading } = useMutation(forgotPassword, {
    onSuccess: (response) => {
      navigate(route.login)
      toaster(response?.data?.message)
    }
  })
  function onSubmit(data) {
    mutate({ sEmail: data?.sEmail })
  }

  useEffect(() => {
    document.title = 'Forgot Password'
  }, [])
  return (
    <>
      <Form noValidate className='login-form' onSubmit={handleSubmit(onSubmit)}>
        <div className='title-b'>
          <h2 className='title'>
            <FormattedMessage id='forgotPassword' />
          </h2>
        </div>
        <Form.Group className='form-group'>
          <Form.Label>
            <FormattedMessage id='emailAddress' />
          </Form.Label>
          <Form.Control
            type='text'
            required
            placeholder='Enter your email address'
            name='sEmail'
            className={errors.sEmail && 'error'}
            {...fields('sEmail', {
              required: { value: true, message: validationErrors.emailRequired },
              pattern: { value: EMAIL, message: validationErrors.email }
            })}
          />
          {errors.sEmail && <Form.Control.Feedback type='invalid'>{errors.sEmail.message}</Form.Control.Feedback>}
        </Form.Group>
        <Button variant='primary' type='submit' disabled={isLoading}>
          <FormattedMessage id='submit' /> {isLoading && <Spinner animation='border' size='sm' />}
        </Button>
      </Form>
      <Link to={'/login'} className='b-link'>
        <FormattedMessage id='backToLogin' />
      </Link>
    </>
  )
}

export default ForgotPassword
