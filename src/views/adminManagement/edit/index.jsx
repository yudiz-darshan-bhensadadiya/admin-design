// react+library
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import moment from 'moment'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
// component
import Wrapper from 'shared/components/Wrap'
import CommonInput from 'shared/components/CommonInput'
import CommonViewInput from 'shared/components/CommonViewInput'
import CustomModal from 'shared/components/Modal'
import { Loader } from 'shared/components/Loader'
// constants
import { validationErrors } from 'shared/constants/ValidationErrors'
import { getDirtyFormValues, toaster } from 'helper/helper'

import {
  createCustomPackage,
  getAdminById,
  getPackageSelectList,
  modifyPackage,
  renewPackage,
  updateAdminById
} from 'query/admin/admin.query'
import { getGameSelectList, getPackageById } from 'query/package/package.query'
import { ONLY_NUMBER } from 'shared/constants'
import { route } from 'shared/constants/AllRoutes'

export default function EditAdmin () {
  const { id } = useParams()
  const query = useQueryClient()
  const navigate = useNavigate()

  const customPackage = {
    _id: 'custom-package',
    sName: 'Custom Package'
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    reset,
    watch
  } = useForm({ mode: 'all' })

  const {
    handleSubmit: modalHandleSubmit,
    formState: { errors: modalErrors },
    reset: modalReset,
    control: modalControl
  } = useForm({ mode: 'all' })

  const {
    handleSubmit: modalCustomHandleSubmit,
    register: modalCustomRegister,
    formState: { errors: modalCustomErrors },
    control: modalCustomControl,
    reset: modalCustomReset
  } = useForm({ mode: 'all' })

  const [show, setShow] = useState(false)
  const [showRenew, setShowRenew] = useState(false)
  const [viewAdminData, setViewAdminData] = useState()
  const [packageID, setPackageID] = useState()
  const [packageData, setPackageData] = useState()
  const [gameArray, setGameArray] = useState([])
  const [packageArray, setPackageArray] = useState([])
  const [modalGamerray, setModalGameArray] = useState([])
  const [modalPackageID, setModalPackageID] = useState()
  const [modifyPackageData, setModifyPackageData] = useState()
  const [modify, setModify] = useState(false)
  const [disableRenew, setDisableRenew] = useState(true)
  const [customMode, setCustomMode] = useState(false)
  const [payload, setpayload] = useState({})

  const handleClose = () => setShow(false)
  const handleCloseRenew = () => setShowRenew(false)

  // get admin by id
  const { isLoading: getLoading, isFetching: fetchLoading } = useQuery('adminDataById', () => getAdminById(id), {
    select: (data) => data?.data?.data,
    onSuccess: (response) => {
      setViewAdminData(response)
      if (response.nTotalRemainingDays <= 0) {
        setDisableRenew(false)
      }
      setPackageID(response?.iPackageId)
      query.invalidateQueries('packageById')
      reset({
        sSchoolName: response?.sSchoolName,
        nOrganizationNumber: response?.nOrganizationNumber.toString(),
        sAddress: response?.sAddress,
        sFirstName: response?.sFirstName,
        sSurname: response?.sSurname
      })
    }
  })

  // get package by Id
  const { isLoading: getPackageLoading, isFetching: fetchPackageLoading } = useQuery('packageById', () => getPackageById(packageID), {
    enabled: packageID ? true : false,
    select: (data) => data?.data?.data,
    onSuccess: (response) => {
      setPackageData(response)
      setGameArray(response?.aGame)
    }
  })

  // package listing
  const { isLoading: dropDownLoading, isFetching: dropDownFetching } = useQuery('packageList', () => getPackageSelectList(id), {
    enabled: modify,
    select: (data) => data?.data?.data,
    onSuccess: (response) => {
      const arrayWithCustomPackage = [...response, customPackage]
      setPackageArray(arrayWithCustomPackage)
    }
  })

  // Game listing
  const { isLoading: gameDropDownLoading, isFetching: gameDropDownFetching } = useQuery('gameList', () => getGameSelectList(), {
    enabled: customMode,
    select: (data) => data?.data?.data,
    onSuccess: (response) => {
      setModalGameArray(response)
    }
  })

  // get package by id for modal data
  const { isLoading: modalPackageLoading, isFetching: modalPackageFetching } = useQuery(
    ['modalPackageById', modalPackageID?._id],
    () => getPackageById(modalPackageID?._id),
    {
      enabled: !!modalPackageID?._id,
      select: (data) => data?.data?.data,
      onSuccess: (response) => {
        setModifyPackageData(response)
      }
    }
  )

  // Update
  const { mutate: updateAdmin, isLoading: updateLoading } = useMutation(updateAdminById, {
    onSuccess: () => {
      toaster('Admin details updated successfully')
      setPackageID()
      query.invalidateQueries('adminDataById')
    }
  })

  useEffect(() => {
    const isDirtyData = {
      sSchoolName: watch('sSchoolName'),
      nOrganizationNumber: watch('nOrganizationNumber'),
      sAddress: watch('sAddress'),
      sFirstName: watch('sFirstName'),
      sSurname: watch('sSurname')
    }
    const payloaddata = getDirtyFormValues(dirtyFields, isDirtyData)
    setpayload(payloaddata)
  }, [dirtyFields, watch('sSchoolName'), watch('nOrganizationNumber'), watch('sAddress'), watch('sFirstName'), watch('sSurname')])

  const onSubmit = (data) => {
    if (data) {
      updateAdmin({ payload, id })
    }
  }

  // Renew
  const { mutate: mutateRenewPackage, isLoading: renewLoading } = useMutation(renewPackage, {
    onSuccess: (response) => {
      toaster(response?.data?.message)
      setPackageID()
      setShowRenew(false)
      setDisableRenew(true)
      query.invalidateQueries('adminDataById')
    }
  })

  const handleConfirmRenew = (id) => {
    mutateRenewPackage(id)
  }

  // Modify
  const { mutate: mutateModifyPackage, isLoading: modifyLoading } = useMutation(modifyPackage, {
    onSuccess: (response) => {
      toaster(response?.data?.message)
      setPackageID()
      setShow(false)
      query.invalidateQueries('adminDataById')
    }
  })

  const onModifiedPackageSubmit = (data) => {
    const adminId = id
    const packageID = data?.sPackageName?._id
    if (packageID) {
      mutateModifyPackage({ iPackageId: packageID, iAdminId: adminId })
    }
  }

  // Modify
  const { mutate: createCustomPackageMutate, isLoading: createCustomPackageLoading } = useMutation(createCustomPackage, {
    onSuccess: (response) => {
      mutateModifyPackage({ iPackageId: response.data?.data?.iPackageId, iAdminId: id })
    }
  })

  const onCustomPackageSubmit = (data) => {
    if (data) {
      createCustomPackageMutate({
        nAllowedMember: data.nTotalAccounts,
        nAllowDays: data.sSubcription,
        sName: data.sPackageName,
        nPrice: data.nPrice,
        aGame: data.sGames
      })
    }
  }

  useEffect(() => {
    document.title = 'Edit Admin'
  }, [])


  const [showCancel, setShowCancel] = useState(false)

  const handleCancel = () => setShowCancel(!showCancel)
  const handleCloseCancel = () => setShowCancel(false)
  const handleConfirmCancel = () => {
    reset()
    navigate(route.adminManagement)
    setShowCancel(false)
  }

  return (
    <section className='edit-management'>
      <Row>
        <Col lg='10' xxl='8'>
          <Row>
            <Col lg='6' className='d-flex'>
              {getLoading || fetchLoading ? (
                <Loader />
              ) : (
                <Wrapper>
                  <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <div className='user-form'>
                      <Col sm='12'>
                        <h3 className='mb-2 text-secondary text-secondary'>Personal Details</h3>
                      </Col>
                      <Col sm='12'>
                        <CommonViewInput type='text' label='emailAddressLang' value={viewAdminData?.sEmail} disabled />
                      </Col>
                      <Col sm='12'>
                        <CommonInput
                          type='text'
                          register={register}
                          errors={errors}
                          className={`form-control ${errors?.sFirstName && 'error'}`}
                          name='sFirstName'
                          label='First Name'
                          required
                          placeholder='Enter First Name'
                          onChange={(e) => {
                            e.target.value = e.target.value?.trim() && e.target.value.replace(/^[0-9]+$/g, '')
                          }}
                          validation={{
                            minLength: { value: 2, message: 'Please enter a value more than 2 characters ' },
                            required: { value: true, message: validationErrors.firstNameRequired }
                          }}
                        />
                      </Col>
                      <Col sm='12'>
                        <CommonInput
                          type='text'
                          register={register}
                          errors={errors}
                          className={`form-control ${errors?.sSurname && 'error'}`}
                          name='sSurname'
                          label='Surname'
                          required
                          placeholder='Enter Surname'
                          onChange={(e) => {
                            e.target.value = e.target.value?.trim() && e.target.value.replace(/^[0-9]+$/g, '')
                          }}
                          validation={{
                            required: { value: true, message: 'Surname is required' },
                            minLength: { value: 2, message: 'Please enter a value more than 2 characters ' }
                          }}
                        />
                      </Col>
                      <Col sm='12'>
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
                            maxLength: { value: 20, message: validationErrors.rangeLength(4, 20) },
                            minLength: { value: 4, message: validationErrors.rangeLength(4, 20) }
                          }}
                        />
                      </Col>
                      <Col sm='12'>
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
                      <Col sm='12'>
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
                      <Col sm='12'>
                        <CommonViewInput type='text' label='referenceNumber' value={viewAdminData?.nReferenceNumber} disabled />
                      </Col>
                    </div>
                    <Col sm='12'>
                      <Button variant='secondary' className='me-2' disabled={!isDirty || updateLoading}
                        onClick={() => {
                          handleCancel()
                        }}
                      >
                        Cancel
                      </Button>
                      <Button variant='primary' type='submit' disabled={!isDirty || updateLoading}>
                        Update Details
                        {updateLoading && <Spinner animation='border' size='sm' />}
                      </Button>
                    </Col>
                  </Form>
                </Wrapper>
              )}
            </Col>
            <Col lg='6' className='d-flex'>
              {getPackageLoading || fetchPackageLoading ? (
                <Loader />
              ) : (
                packageID && (
                  <Wrapper>
                    <Col sm='12'>
                      <h3 className='mb-2 text-secondary text-secondary'>Package Details</h3>
                    </Col>
                    <Col sm='12'>
                      <CommonViewInput type='text' label='packageName' value={packageData?.sName} disabled />
                    </Col>
                    <Col sm='12'>
                      <CommonViewInput
                        type='text'
                        label='Prenumerationsperiod (i dagar)(Subscription Period [In Days])'
                        value={packageData?.nAllowDays}
                        disabled
                      />
                    </Col>
                    <Col sm='12'>
                      <CommonViewInput
                        type='text'
                        label='expiresOn'
                        value={moment(viewAdminData?.dPackageEndDate).format('MM-DD-YYYY')}
                        disabled
                      />
                    </Col>
                    <Col sm='12'>
                      <CommonViewInput type='text' label='Total No of Accounts*' value={packageData?.nAllowedMember} disabled />
                    </Col>
                    <Col sm='12'>
                      <CommonViewInput
                        type='text'
                        label='packageDaysLeft'
                        value={viewAdminData?.nTotalRemainingDays <= 0 ? '0' : viewAdminData?.nTotalRemainingDays}
                        disabled
                      />
                    </Col>
                    <Col sm='12'>
                      <div className='form-group'>
                        <Form.Label>
                          <FormattedMessage id='numberOfGames' />
                        </Form.Label>
                        <Select
                          isDisabled
                          isMulti
                          value={gameArray}
                          getOptionValue={(option) => option.iGameId}
                          getOptionLabel={(option) => option.sGameName}
                          name='sPackage'
                        />
                      </div>
                    </Col>
                    <Col sm='12'>
                      <Button
                        onClick={() => {
                          setShowRenew(!showRenew)
                        }}
                        disabled={disableRenew || renewLoading}
                      >
                        Renew Package
                      </Button>
                      <Button
                        variant='primary'
                        type='submit'
                        className='m-2'
                        onClick={() => {
                          setShow(!show)
                          setModify(!modify)
                        }}
                        disabled={modifyLoading}
                      >
                        Modify Package
                        {modifyLoading && <Spinner animation='border' size='sm' />}
                      </Button>
                    </Col>
                  </Wrapper>
                )
              )}
            </Col>
          </Row>
        </Col>
      </Row>

      <CustomModal
        open={showRenew}
        handleClose={handleCloseRenew}
        handleConfirm={handleConfirmRenew}
        disableHeader
        bodyTitle='Confirm Renew ?'
        isLoading={renewLoading}
        confirmValue={id}
      >
        <article>
          <h5>
            <div>Are you sure want to Renew this package ?</div>
          </h5>
        </article>
      </CustomModal>

      <CustomModal
        disableHeader
        disableFooter
        bodyTitle={customMode ? 'Create Custom Package' : 'Modify Package'}
        open={show}
        handleClose={handleClose}
      >
        {!customMode ? (
          <>
            <Form autoComplete='off' className='package-modal-wrapper' onSubmit={modalHandleSubmit(onModifiedPackageSubmit)}>
              <Form.Group className='form-group w-100'>
                <Form.Label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#445774' }}>
                    Select Package
                    <span className='inputStar'>*</span>
                  </span>
                  <span style={{ marginRight: '10px', color: '#445774' }}>?</span>
                </Form.Label>
                <Controller
                  name='sPackageName'
                  control={modalControl}
                  rules={{ required: 'Package is required' }}
                  render={({ field: { onChange, value, ref } }) => (
                    <Select
                      ref={ref}
                      placeholder='Select Package'
                      className={`react-select border-0 ${modalErrors.sPackageName && 'error'}`}
                      classNamePrefix='select'
                      isSearchable={true}
                      value={value}
                      onChange={(data) => {
                        onChange(data)
                        if (data?._id === 'custom-package') {
                          setCustomMode(true)
                        } else {
                          setCustomMode(false)
                          setModalPackageID(data)
                        }
                      }}
                      options={packageArray}
                      getOptionValue={(option) => option._id}
                      getOptionLabel={(option) => option.sName}
                      isLoading={dropDownLoading || dropDownFetching ? true : false}
                    />
                  )}
                />
                {modalErrors.sPackageName && (
                  <Form.Control.Feedback type='invalid'>{modalErrors.sPackageName.message}</Form.Control.Feedback>
                )}
              </Form.Group>
              <CommonViewInput
                isLoading={modalPackageLoading || modalPackageFetching}
                type='text'
                label='packageName'
                value={modifyPackageData?.sName || '-'}
                disabled
              />
              <CommonViewInput
                isLoading={modalPackageLoading || modalPackageFetching}
                type='text'
                label='Total Games in a package'
                value={modifyPackageData?.aGame.length || '-'}
                disabled
              />
              <CommonViewInput
                isLoading={modalPackageLoading || modalPackageFetching}
                type='text'
                label='Subscription Period ( In Days )'
                value={modifyPackageData?.nAllowDays || '-'}
                disabled
              />
              <CommonViewInput
                isLoading={modalPackageLoading || modalPackageFetching}
                type='text'
                label='No of Users'
                value={modifyPackageData?.nAllowedMember || '-'}
                disabled
              />
              <Modal.Footer>
                <Button
                  variant='secondary'
                  onClick={() => {
                    handleClose()
                    modalReset()
                    setModifyPackageData()
                  }}
                >
                  Cancel
                </Button>
                <Button variant='primary' type='submit' disabled={modifyLoading}>
                  <FormattedMessage id='confirm' />
                  {modifyLoading && <Spinner animation='border' size='sm' />}
                </Button>
              </Modal.Footer>
            </Form>
          </>
        ) : (
          <Form autoComplete='off' onSubmit={modalCustomHandleSubmit(onCustomPackageSubmit)}>
            <CommonInput
              type='text'
              name='sPackageName'
              label='Custom Package Name'
              placeholder='Enter package name'
              className={`form-control ${modalCustomErrors?.sPackageName && 'error'}`}
              required
              register={modalCustomRegister}
              errors={modalCustomErrors}
              validation={{
                maxLength: { value: 15, message: validationErrors.rangeLength(4, 15) },
                minLength: { value: 4, message: validationErrors.rangeLength(4, 15) },
                required: { value: true, message: 'Package Name is Required' }
              }}
            />
            <CommonInput
              type='text'
              name='nTotalAccounts'
              label='packageTotalName'
              placeholder='Enter Total accounts'
              className={`form-control ${modalCustomErrors?.nTotalAccounts && 'error'}`}
              required
              register={modalCustomRegister}
              errors={modalCustomErrors}
              validation={{
                pattern: { value: ONLY_NUMBER, message: 'Only numbers are allowed' },
                min: { value: 1, message: 'Minimum account 1' },
                max: { value: 999, message: 'Maximum account 999' },
                required: { value: true, message: validationErrors.noOfAccoutnRequired }
              }}
            />

            <Form.Group className='form-group w-100'>
              <Form.Label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#445774' }}>
                  <FormattedMessage id='games' />

                  <span className='inputStar'>*</span>
                </span>
                <span style={{ marginRight: '10px', color: '#445774' }}>?</span>
              </Form.Label>
              <Controller
                name='sGames'
                control={modalCustomControl}
                rules={{
                  required: {
                    value: true,
                    message: validationErrors.gamesRequired
                  }
                }}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                  <>
                    <Select
                      ref={ref}
                      placeholder='Select games'
                      options={modalGamerray}
                      getOptionValue={(option) => option._id}
                      getOptionLabel={(option) => option.sGameName}
                      className={`react-select custom-select border-0 ${error && 'error'}`}
                      classNamePrefix='select'
                      isSearchable={true}
                      isMulti
                      isLoading={gameDropDownLoading || gameDropDownFetching}
                      closeMenuOnSelect={false}
                      value={value}
                      onChange={onChange}
                    />
                    {error?.message && <Form.Control.Feedback type='invalid'>{error?.message}</Form.Control.Feedback>}
                  </>
                )}
              />
            </Form.Group>
            <CommonInput
              type='text'
              name='sSubcription'
              label='Subscription Period in Days'
              placeholder='Enter subscription period'
              className={`form-control ${modalCustomErrors?.sSubcription && 'error'}`}
              required
              register={modalCustomRegister}
              errors={modalCustomErrors}
              validation={{
                pattern: { value: ONLY_NUMBER, message: 'Only numbers are allowed' },
                min: { value: 1, message: 'Minimum 1 day required' },
                max: { value: 1000, message: 'Maximum 1000 days required' },
                required: { value: true, message: validationErrors.subscriptionRequired }
              }}
            />

            <CommonInput
              type='text'
              name='nPrice'
              label='packagePrice'
              placeholder='Enter package price'
              errors={modalCustomErrors}
              className={`form-control ${modalCustomErrors?.nPrice && 'error'}`}
              required
              register={modalCustomRegister}
              validation={{
                pattern: { value: /^\d*(\.\d{0,2})?$/, message: 'Only numbers with two decimals are allowed' },
                min: { value: 0, message: '0 is minimum price' },
                max: { value: 100000000, message: '100000000 is maximum price' },
                required: { value: true, message: validationErrors.priceRequired }
              }}
            />

            <Modal.Footer>
              <Button
                variant='secondary'
                onClick={() => {
                  setCustomMode(false)
                  modalReset()
                  modalCustomReset()
                  setModifyPackageData()
                }}
              >
                Cancel
              </Button>
              <Button variant='primary' type='submit' disabled={createCustomPackageLoading || modifyLoading}>
                <FormattedMessage id='create' />
                {(createCustomPackageLoading || modifyLoading) && <Spinner animation='border' size='sm' />}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </CustomModal>
      <CustomModal show={showCancel}
        handleClose={handleCloseCancel}
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
    </section>
  )
}
