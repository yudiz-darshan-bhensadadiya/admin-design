import { getDirtyFormValues, toaster } from 'helper/helper'
import { editGameFeature, getGameFeatureById } from 'query/feature/feature.query'
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import CommonInput from 'shared/components/CommonInput'
import CommonViewInput from 'shared/components/CommonViewInput'
import { Loader } from 'shared/components/Loader'
import TopBar from 'shared/components/Topbar'
import Wrapper from 'shared/components/Wrap'
import { validationErrors } from 'shared/constants/ValidationErrors'
import config from 'config'

function TermsAndCondition() {
  const id = config?.FEATURE_ID
  const query = useQueryClient()

  const [page, setPage] = useState('view')
  const [tearmsAndConditionData, setTearmsandConditionData] = useState()
  const [payload, setpayload] = useState()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, dirtyFields }
  } = useForm({
    mode: 'all'
  })

  const { isLoading, isFetching } = useQuery(['featureById'], () => getGameFeatureById(id), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setTearmsandConditionData(response)
    }
  })

  const { isLoading: updateLoading, mutate } = useMutation(editGameFeature, {
    onSuccess: (res) => {
      toaster('Terms And Condition Updated')
      setPage('view')
      query.invalidateQueries('featureById')
    }
  })

  useEffect(() => {
    const isDirtyData = {
      sDescriptionTermsAndCondition: watch('sDescriptionTermsAndCondition')
    }
    const payloaddata = getDirtyFormValues(dirtyFields, isDirtyData)
    setpayload(payloaddata)
  }, [dirtyFields, watch('sDescriptionTermsAndCondition')])

  function onSubmit() {
    if (payload) {
      mutate({
        id,
        sDescriptionTermsAndCondition: payload?.sDescriptionTermsAndCondition
      })
    }
  }

  useEffect(() => {
    document.title = 'Term and Condition'
  }, [])

  return (
    <>
      {page === 'view' && (
        <TopBar
          buttons={[
            {
              text: 'Edit',
              icon: 'edit',
              type: 'primary',
              clickEventName: 'editpolicy'
            }
          ]}
          btnEvent={() => {
            setPage('edit')
            reset({
              sDescriptionTermsAndCondition: tearmsAndConditionData?.sDescriptionTermsAndCondition
            })
          }}
        />
      )}
      {isFetching || isLoading ? (
        <Loader />
      ) : (
        <Wrapper>
          <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <div className='personal-details'>
              <div className='user-form'>
                <Col>
                  {page === 'view' ? (
                    <CommonViewInput
                      disabled
                      type='textarea'
                      label='trmsandcondition'
                      value={tearmsAndConditionData?.sDescriptionTermsAndCondition}
                      className='description'
                    />
                  ) : (
                    <CommonInput
                      type='textarea'
                      name='sDescriptionTermsAndCondition'
                      label='trmsandcondition'
                      placeholder='Enter Privacy Policy'
                      className={`form-control description ${errors?.sDescriptionTermsAndCondition && 'error'}`}
                      required
                      register={register}
                      errors={errors}
                      validation={{
                        maxLength: {
                          value: 1000000,
                          message: validationErrors.rangeLength(100, 1000000)
                        },
                        minLength: {
                          value: 100,
                          message: validationErrors.rangeLength(100, 1000000)
                        },
                        required: {
                          value: true,
                          message: validationErrors.tandcRequired
                        }
                      }}
                    />
                  )}
                </Col>
              </div>
            </div>
            {page === 'edit' && (
              <>
                <Button
                  variant='secondary'
                  onClick={() => {
                    setPage('view')
                  }}
                >
                  Cancel
                </Button>
                <Button variant='primary' type='submit' className='m-2' disabled={updateLoading || !isDirty}>
                  <FormattedMessage id='Update Terms And Condition' />
                  {updateLoading && <Spinner animation='border' size='sm' />}
                </Button>
              </>
            )}
          </Form>
        </Wrapper>
      )}
    </>
  )
}

export default TermsAndCondition
