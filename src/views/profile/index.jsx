import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import EditProfileComponent from 'shared/components/Profile'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { profile, UpdateProfile } from 'query/profile/profile.query'
import { toaster } from 'helper/helper'
import { useNavigate } from 'react-router-dom'
import { Loader } from 'shared/components/Loader'
import Wrapper from 'shared/components/Wrap'
import { route } from 'shared/constants/AllRoutes'

function EditProfile() {
  const navigate = useNavigate()
  const query = useQueryClient()
  const [isChanged, setIsChanged] = useState(false)
  const [profileData, setProfileData] = useState({})

  const {
    register,
    control,
    formState: { errors },
    clearErrors,
    trigger,
    getValues,
    reset,
    handleSubmit,
    setValue
  } = useForm({
    mode: 'all',
    defaultValues: {
      sProfilePicture: '',
      sPanPicture: '',
      aSocialProfiles: [{ eSocialNetworkType: '', sDisplayName: '', sLink: '' }]
    }
  })

  const { isLoading: getLoading, isFetching } = useQuery('getProfile', profile, {
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      setProfileData(data)
      reset({
        sUserName: data?.sUserName,
        sMobile: data?.sMobile
      })
    },
    onError: () => {
      setProfileData({})
    }
  })

  const { mutate, isLoading } = useMutation(UpdateProfile, {
    onSuccess: (response) => {
      toaster(response?.data?.message || 'Profile updated successfully')
      navigate('/dashboard')
      query.invalidateQueries({ queryKey: ['profile'] })
    }
  })

  function handleChange(e) {
    const { name, value } = e.target
    setIsChanged(true)
    setProfileData({ ...profileData, [name]: value })
  }

  const onsubmit = () => {
    mutate({
      sUserName: profileData.sUserName,
      sMobile: profileData.sMobile
    })
  }

  useEffect(() => {
    document.title = 'My Profile'
  }, [])
  return (
    <>
      {getLoading || isFetching ? (
        <Loader />
      ) : (
        <Row>
          <Col xxl={8}>
            <Wrapper>
              <div className='edit-profile'>
                <Form onSubmit={handleSubmit(onsubmit)} autoComplete='off'>
                  <EditProfileComponent
                    register={register}
                    control={control}
                    errors={errors}
                    clearErrors={clearErrors}
                    trigger={trigger}
                    values={getValues()}
                    profileData={profileData}
                    handleChange={(e) => handleChange(e)}
                    setValue={setValue}
                  />
                  <Button variant='secondary' className='me-2' disabled={isLoading} onClick={() => navigate(route.dashboard)}>
                    Cancel
                  </Button>
                  <Button variant='primary' type='submit' disabled={!isChanged || isLoading}>
                    <FormattedMessage id='update' />
                    {isLoading && <Spinner animation='border' size='sm' />}
                  </Button>
                </Form>
              </div>
            </Wrapper>
          </Col>
        </Row>
      )}
    </>
  )
}

export default EditProfile
