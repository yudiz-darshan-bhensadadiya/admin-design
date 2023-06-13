import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { PASSWORD } from 'shared/constants'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { useMutation } from 'react-query'
import { resetPassWord } from 'query/auth/auth.query'
import { useNavigate, useParams } from 'react-router-dom'
import { toaster } from 'helper/helper'
import { checkToken } from 'query/profile/profile.query'
import { Loader } from 'shared/components/Loader'
import NotFound from 'shared/components/404'

function ResetPassword() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState({ newPassword: true, confirmPassword: true })
  const sNewPassword = useRef({})
  const { token } = useParams()
  const [tokneWrong, setTokenWrong] = useState(false)

  const { mutate: tokenMutation, isLoading: tokenLoading } = useMutation(checkToken, {
    onError: () => {
      setTokenWrong(true)
    }
  })

  useEffect(() => {
    tokenMutation({ sVerifyToken: token })
  }, [token])

  const {
    register: fields,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ mode: 'onTouched' })
  sNewPassword.current = watch('sNewPassword')

  function handlePasswordToggle(name) {
    if (name === 'newPassword') {
      setShowPassword({ ...showPassword, newPassword: !showPassword.newPassword })
    } else {
      setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })
    }
  }

  const { mutate, isLoading } = useMutation(resetPassWord, {
    onSuccess: (response) => {
      navigate('/login')
      toaster(response?.data?.message)
    }
  })

  function onSubmit(data) {
    mutate({ sNewPassword: data.sConfirmNewPassword, token })
  }

  useEffect(() => {
    document.title = 'Reset Password'
  }, [])

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} className='login-form'>
      {tokenLoading ? (
        <Loader />
      ) : (
        <>
          <div className='title-b'>
            <h2 className='title'>
              <FormattedMessage id='resetPassword' />
            </h2>
          </div>
          {tokneWrong ? (
            <div className='reset_expire'>
              <h5>Your Reset Password Link is expired</h5>
              <NotFound />
            </div>
          ) : (
            <>
              <Form.Group className='form-group'>
                <Form.Label>
                  <FormattedMessage id='newPassword' />
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword.newPassword ? 'password' : 'text'}
                    required
                    name='sNewPassword'
                    onPaste={(e) => {
                      e.preventDefault()
                      return false
                    }}
                    placeholder='Enter your new password'
                    className={errors.sNewPassword && 'error'}
                    {...fields('sNewPassword', {
                      required: validationErrors.newPasswordRequired,
                      pattern: {
                        value: PASSWORD,
                        message: validationErrors.passwordRegEx
                      },
                      maxLength: { value: 15, message: validationErrors.rangeLength(8, 15) },
                      minLength: { value: 8, message: validationErrors.rangeLength(8, 15) },
                      onChange: (e) => {
                        e.target.value = e?.target?.value?.trim()
                      }
                    })}
                  />
                  <Button onClick={() => handlePasswordToggle('newPassword')} variant='link' className='icon-right'>
                    <i className={showPassword.newPassword ? 'icon-visibility' : 'icon-visibility-off'}></i>
                  </Button>
                </InputGroup>
                {errors.sNewPassword && <Form.Control.Feedback type='invalid'>{errors.sNewPassword.message}</Form.Control.Feedback>}
              </Form.Group>
              <Form.Group className='form-group'>
                <Form.Label>
                  <FormattedMessage id='confirmNewPassword' />
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword.confirmPassword ? 'password' : 'text'}
                    required
                    name='sConfirmNewPassword'
                    onPaste={(e) => {
                      e.preventDefault()
                      return false
                    }}
                    placeholder='Enter same new password'
                    className={errors.sConfirmNewPassword && 'error'}
                    {...fields('sConfirmNewPassword', {
                      required: validationErrors.confirmRequired,
                      validate: (value) => value === sNewPassword.current || validationErrors.passwordNotMatch,
                      onChange: (e) => {
                        e.target.value = e?.target?.value?.trim()
                      }
                    })}
                  />
                  <Button onClick={() => handlePasswordToggle('confirmPassword')} variant='link' className='icon-right'>
                    <i className={showPassword.confirmPassword ? 'icon-visibility' : 'icon-visibility-off'}></i>
                  </Button>
                </InputGroup>
                {errors.sConfirmNewPassword && (
                  <Form.Control.Feedback type='invalid'>{errors.sConfirmNewPassword.message}</Form.Control.Feedback>
                )}
              </Form.Group>
              <Button variant='primary' type='submit' disabled={isLoading}>
                <FormattedMessage id='submit' /> {isLoading && <Spinner animation='border' size='sm' />}
              </Button>
            </>
          )}
        </>
      )}
    </Form>
  )
}
export default ResetPassword
