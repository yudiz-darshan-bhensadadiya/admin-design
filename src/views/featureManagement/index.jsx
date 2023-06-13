import React, { useEffect, useRef, useState } from 'react'
import Wrapper from 'shared/components/Wrap'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import CommonViewInput from 'shared/components/CommonViewInput'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { editGameFeature, getGameFeatureById } from 'query/feature/feature.query'
import { Loader } from 'shared/components/Loader'
import Slider from 'react-slick'
import { FormattedMessage } from 'react-intl'
import TopBar from 'shared/components/Topbar'
import CommonInput from 'shared/components/CommonInput'
import { useForm } from 'react-hook-form'
import { validationErrors } from 'shared/constants/ValidationErrors'
import Axios from 'axios.js'
import axios from 'axios'
import { toaster } from 'helper/helper'
import config from 'config'

function FeatureManagement() {
  const id = config?.FEATURE_ID

  const addExtra = useRef()
  const query = useQueryClient()
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }

  const [gameFeatureData, setGameFeatureData] = useState()
  const [pageState, setPageState] = useState('view')
  const [existingImageArray, setexistingImageArray] = useState([])
  const [extraImages, setExtraImages] = useState([])
  const [mediaUploadLoading, setMediaUploadLoading] = useState(false)
  const [sizeError, setSizeError] = useState(false)
  const [totalLength, setTotalLength] = useState()
  const [limit, setLimit] = useState(false)
  const [minimum, setMinimum] = useState(false)
  const [relevent, setRelevent] = useState(false)
  const [disable, setdisable] = useState(true)

  useEffect(() => {
    setTotalLength(extraImages?.length + existingImageArray?.length)
  }, [extraImages, existingImageArray])

  useEffect(() => {
    if (totalLength === 5) {
      setLimit(true)
    }
    if (totalLength === 0) {
      setMinimum(true)
    }
    if (totalLength >= 1) {
      setMinimum(false)
    }
  }, [totalLength])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ mode: 'all' })

  async function onSubmit(data) {
    setMediaUploadLoading(true)
    const aMedia = [...existingImageArray]
    if (extraImages?.length) {
      for await (const value of extraImages) {
        if (value.name && value.type) {
          const presign_for_aMedia = await Axios.post(`/cms/cms-game-presign-url?key=${value.name}&sMedia=${value.type}`)
          const res = await axios.put(presign_for_aMedia?.data?.data?.sUrl, value, { headers: { 'Content-Type': value.type } })
          if (res.status === 200) {
            aMedia.push(presign_for_aMedia?.data?.data?.sPath)
          }
        }
      }
    }
    setMediaUploadLoading(false)
    if (totalLength > 0) {
      mutate({
        id,
        sFeatureDescription: data.sFeatureDescription,
        aFeatureImage: aMedia
      })
    }
  }

  const handleExtra = (e) => {
    if (e.target.files[0]?.type === 'image/jpeg') {
      if (e.target.files[0]?.size > 2 * 1024 * 1024) {
        setSizeError(true)
      } else {
        const selectedFiles = Object.entries(e.target.files)
        let ImagesArray = selectedFiles.map((e) => e[1])
        setExtraImages([...extraImages, ...ImagesArray])
      }
    } else {
      setRelevent(true)
    }
  }

  useEffect(() => {
    if (sizeError || limit || relevent) {
      setTimeout(() => {
        setSizeError(false)
        setLimit(false)
        setRelevent(false)
      }, 2000)
    }
  }, [sizeError || limit || relevent])

  // Data fetching
  const { isLoading, isFetching } = useQuery(['featureById'], () => getGameFeatureById(id), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setGameFeatureData(response)
      setexistingImageArray(response?.aFeatureImage)
    }
  })

  const { isLoading: updateLoading, mutate } = useMutation(editGameFeature, {
    onSuccess: (res) => {
      toaster('Feature updated successfully.')
      setPageState('view')
      setdisable(true)
      setexistingImageArray([])
      setExtraImages([])
      query.invalidateQueries('featureById')
    }
  })

  useEffect(() => {
    document.title = 'Feature Management'
  }, [])

  return (
    <>
      {pageState === 'view' && (
        <TopBar
          buttons={[
            {
              text: 'Edit',
              icon: 'edit',
              type: 'primary',
              clickEventName: 'editFeature'
            }
          ]}
          btnEvent={() => {
            setPageState('edit')
            reset({
              sFeatureDescription: gameFeatureData?.sFeatureDescription
            })
          }}
        />
      )}
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <Wrapper>
          <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <div className='user-form feature-wrapper'>
              <Row>
                <Col lg='11' className='mx-auto'>
                  <Row>
                    <Col sm='12'>
                      <Slider {...settings}>
                        {existingImageArray?.map((data, i) => {
                          return (
                            <div className='feature-img' key={i}>
                              <img src={gameFeatureData?.s3URL + data} alt='Game Feature' />
                              {pageState === 'edit' && (
                                <Button
                                  className='close'
                                  onClick={(e) => {
                                    e.preventDefault()
                                    const newData = [...existingImageArray]
                                    newData.splice(i, 1)
                                    setexistingImageArray(newData)
                                    setdisable(false)
                                  }}
                                  disabled={updateLoading || mediaUploadLoading}
                                >
                                  x
                                </Button>
                              )}
                            </div>
                          )
                        })}
                        {extraImages?.map((item, i) => {
                          return (
                            <div className='feature-img' key={URL.createObjectURL(item)}>
                              <img src={URL.createObjectURL(item)} alt='altImage' />
                              {pageState === 'edit' && (
                                <Button
                                  className='close'
                                  onClick={(e) => {
                                    e.preventDefault()
                                    const newExtraImages = [...extraImages]
                                    newExtraImages.splice(i, 1)
                                    setExtraImages(newExtraImages)
                                  }}
                                  disabled={updateLoading || mediaUploadLoading}
                                >
                                  x
                                </Button>
                              )}
                            </div>
                          )
                        })}
                      </Slider>
                      <div>
                        {pageState === 'edit' && sizeError && (
                          <Form.Control.Feedback className='d-flex' type='invalid'>
                            File must be less than 2 MB
                          </Form.Control.Feedback>
                        )}
                        {pageState === 'edit' && limit && (
                          <Form.Control.Feedback className='d-flex' type='invalid'>
                            You can only upload 5 Images
                          </Form.Control.Feedback>
                        )}
                        {pageState === 'edit' && minimum && (
                          <Form.Control.Feedback className='d-flex' type='invalid'>
                            Minimum 1 Image is required
                          </Form.Control.Feedback>
                        )}
                        {pageState === 'edit' && relevent && (
                          <Form.Control.Feedback className='d-flex' type='invalid'>
                            Irrelevant File Type
                          </Form.Control.Feedback>
                        )}
                      </div>
                    </Col>
                    {pageState === 'edit' && (
                      <Col sm='12' className='mt-2'>
                        <Button
                          onClick={() => {
                            addExtra.current.click()
                            setdisable(false)
                          }}
                          disabled={totalLength >= 5 || updateLoading || mediaUploadLoading}
                        >
                          Add Images
                        </Button>
                        <div style={{ display: 'none' }}>
                          <input
                            type='file'
                            ref={addExtra}
                            onChange={(e) => {
                              handleExtra(e)
                            }}
                            accept='image/jpeg'
                          />
                        </div>
                      </Col>
                    )}
                    <Col sm='12'>
                      {pageState === 'view' ? (
                        <CommonViewInput
                          label='description'
                          className='description-message'
                          disabled
                          value={gameFeatureData?.sFeatureDescription}
                        />
                      ) : (
                        <CommonInput
                          label='description'
                          placeholder='Enter Description'
                          name='sFeatureDescription'
                          type='textarea'
                          register={register}
                          errors={errors}
                          className={`form-control description-message${errors?.sFeatureDescription && 'error'}`}
                          required
                          validation={{
                            required: {
                              value: true,
                              message: validationErrors.featureDescriptionRequired
                            },
                            maxLength: {
                              value: 1000,
                              message: validationErrors.rangeLength(100, 1000)
                            },
                            minLength: {
                              value: 100,
                              message: validationErrors.rangeLength(100, 1000)
                            }
                          }}
                          disabled={updateLoading || mediaUploadLoading}
                          onChange={() => setdisable(false)}
                        />
                      )}
                    </Col>
                    <Col sm='12' className='mt-3'>
                      {pageState === 'edit' && (
                        <>
                          <Button
                            variant='secondary'
                            onClick={() => {
                              setPageState('view')
                              query.invalidateQueries('featureById')
                              setdisable(true)
                            }}
                            disabled={updateLoading || mediaUploadLoading}
                          >
                            Cancel
                          </Button>
                          <Button variant='primary' type='submit' className='m-2' disabled={updateLoading || mediaUploadLoading || disable}>
                            {!mediaUploadLoading ? <FormattedMessage id='updateFeature' /> : 'Uploading...'}
                            {(updateLoading || mediaUploadLoading) && <Spinner animation='border' size='sm' />}
                          </Button>
                        </>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Form>
        </Wrapper>
      )}
    </>
  )
}

export default FeatureManagement
