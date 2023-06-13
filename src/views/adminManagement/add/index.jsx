import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import CommonInput from 'shared/components/CommonInput'
import { validationErrors } from 'shared/constants/ValidationErrors'
import Select from 'react-select'
import { useMutation, useQuery } from 'react-query'
import { addAdmin, getPackageSelectListAdd } from 'query/admin/admin.query'
import { EMAIL, PASSWORD } from 'shared/constants'
import { toaster } from 'helper/helper'
import { useNavigate } from 'react-router-dom'
import { route } from 'shared/constants/AllRoutes'
import Wrapper from 'shared/components/Wrap'
import CustomModal from 'shared/components/Modal'

export default function AddAdminPage () {
  const navigate = useNavigate()
  const [packageOptions, setPackageOptions] = useState()
  const [showCancel, setShowCancel] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
    reset
  } = useForm({ mode: 'all' })



  const { mutate, isLoading } = useMutation(addAdmin, {
    onSuccess: (response) => {
      toaster(response.data.message)
      navigate(route.adminManagement)
    }
  })

  useQuery('packageList', () => getPackageSelectListAdd(), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setPackageOptions(response)
    }
  })

  function onSubmit (data) {
    if (data) {
      mutate({
        sFirstName: data.sFirstName,
        sSurname: data.sSurName,
        sEmail: data.sEmail,
        sPassword: data.sPassword,
        sSchoolName: data.sSchoolName,
        iPackageId: data.sPackageName,
        nOrganizationNumber: data.nOrganizationNumber,
        nReferenceNumber: data.nReferenceNumber,
        sAddress: data.sAddress
      })
    }
  }

  useEffect(() => {
    document.title = 'Add Admin'
  }, [])

  const handleCancel = () => isDirty ? setShowCancel(!showCancel) : navigate(route.adminManagement)
  const handleClose = () => setShowCancel(false)
  const handleConfirmCancel = () => {
    reset()
    navigate(route.adminManagement)
    setShowCancel(false)
  }

  return (
    <>
      <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <div className='personal-details'>
          <div className='user-form'>
            <Row>
              <Col xxl={8}>
                <Wrapper>
                  <Row>
                    <Col sm={6}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.sEmail && 'error'}`}
                        name='sEmail'
                        label='emailAddressLang'
                        placeholder='Enter email address'
                        required
                        validation={{
                          pattern: { value: EMAIL, message: validationErrors.email },
                          required: { value: true, message: validationErrors?.emailRequired }
                        }}
                      />
                    </Col>
                    <Col sm={6}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.sPassword && 'error'}`}
                        name='sPassword'
                        label='password'
                        placeholder='Enter password'
                        required
                        validation={{
                          pattern: { value: PASSWORD, message: validationErrors.passwordRegEx },
                          required: { value: true, message: validationErrors.passwordRequired },
                          maxLength: { value: 12, message: validationErrors.rangeLength(8, 12) },
                          minLength: { value: 8, message: validationErrors.rangeLength(8, 12) }
                        }}
                      />
                    </Col>
                    <Col sm={6}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.sFirstName && 'error'}`}
                        name='sFirstName'
                        label='firstName'
                        placeholder='Enter first name'
                        required
                        onChange={(e) => {
                          e.target.value = e.target.value?.trim() && e.target.value.replace(/^[0-9]+$/g, '')
                        }}
                        validation={{
                          minLength: { value: 2, message: 'Please enter a value more than 2 characters' },
                          required: { value: true, message: validationErrors.firstNameRequired }
                        }}
                      />
                    </Col>
                    <Col sm={6}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.sSurName && 'error'}`}
                        name='sSurName'
                        label='surName'
                        required
                        placeholder='Enter Surname'
                        onChange={(e) => {
                          e.target.value = e.target.value?.trim() && e.target.value.replace(/^[0-9]+$/g, '')
                        }}
                        validation={{
                          minLength: { value: 2, message: 'Please enter a value more than 2 characters ' },
                          required: { value: true, message: validationErrors.surNameRequired }
                        }}
                      />
                    </Col>
                    <Col sm={6}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.sSchoolName && 'error'}`}
                        name='sSchoolName'
                        label='schoolName'
                        required
                        placeholder='Enter school name'
                        validation={{
                          required: { value: true, message: validationErrors.schoolRequired },
                          maxLength: { value: 20, message: validationErrors.rangeLength(2, 20) },
                          minLength: { value: 2, message: validationErrors.rangeLength(2, 20) }
                        }}
                      />
                    </Col>
                    <Col sm={6}>
                      <Form.Group className='form-group'>
                        <Form.Label style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#445774' }}>
                            <FormattedMessage id='packageDetail' />
                            <span className='inputStar'>*</span>
                          </span>
                          <span style={{ marginRight: '10px', color: '#445774' }}>?</span>
                        </Form.Label>
                        <Controller
                          name='sPackageName'
                          control={control}
                          rules={{ required: { value: true, message: validationErrors.packageRequired } }}
                          render={({ field: { onChange, value, ref } }) => (
                            <Select
                              placeholder='Select package'
                              ref={ref}
                              options={packageOptions}
                              getOptionLabel={(option) => option?.sName}
                              getOptionValue={(option) => option?._id}
                              className={`react-select border-0 ${errors.sPackageName && 'error'}`}
                              classNamePrefix='select'
                              isSearchable={false}
                              value={value}
                              onChange={onChange}
                            />
                          )}
                        />
                        {errors.sPackageName && <Form.Control.Feedback type='invalid'>{errors.sPackageName.message}</Form.Control.Feedback>}
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.nOrganizationNumber && 'error'}`}
                        name='nOrganizationNumber'
                        label='organizationNumber'
                        placeholder='Enter organization number'
                        required
                        validation={{
                          pattern: {
                            value: /^[0-9]+$/,
                            message: 'Only numbers are allowed'
                          },
                          required: { value: true, message: validationErrors.organizationNumberRequired }
                        }}
                        onChange={(e) => {
                          e.target.value = e.target.value?.trim() && e.target.value.replace(/^[a-zA-z]+$/g, '')
                        }}
                      />
                    </Col>
                    <Col sm={6}>
                      <CommonInput
                        type='text'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.nReferenceNumber && 'error'}`}
                        name='nReferenceNumber'
                        label='referenceNumber'
                        placeholder='Enter reference number'
                        required
                        referenceNumberRequired
                        validation={{
                          pattern: {
                            value: /^[0-9]+$/,
                            message: 'Only numbers are allowed'
                          },
                          required: { value: true, message: validationErrors.referenceNumberRequired }
                        }}
                        onChange={(e) => {
                          e.target.value = e.target.value?.trim() && e.target.value.replace(/^[a-zA-z]+$/g, '')
                        }}
                      />
                    </Col>
                    <Col sm={6}>
                      <CommonInput
                        type='textarea'
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.sAddress && 'error'}`}
                        name='sAddress'
                        label='address'
                        placeholder='Enter address'
                        required
                        validation={{
                          required: { value: true, message: validationErrors.addressRequired }
                        }}
                      />
                    </Col>
                    <Row>
                      <Col sm={6}>
                        <Button variant='secondary' className='me-2' disabled={isLoading} onClick={() => {
                          handleCancel()
                        }}>
                          Cancel
                        </Button>
                        <Button variant='primary' type='submit' disabled={isLoading}>
                          <FormattedMessage id='createAdmin' />
                          {isLoading && <Spinner animation='border' size='sm' />}
                        </Button>
                      </Col>
                    </Row>
                  </Row>
                </Wrapper>
              </Col>
            </Row>
          </div>
        </div>
      </Form>
      <CustomModal
        show={showCancel}
        handleClose={handleClose}
        handleConfirm={handleConfirmCancel}
        disableHeader
        bodyTitle='Confirm Cancel?'
      >
        <article>
          <h5>
            <>
              <div>
                Are you sure, you want to cancel the form?
              </div>
            </>
          </h5>
        </article>
      </CustomModal>
    </>
  )
}
