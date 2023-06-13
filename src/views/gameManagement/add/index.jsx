/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import CommonInput from 'shared/components/CommonInput'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { useMutation, useQuery } from 'react-query'
import { URL_REGEX } from 'shared/constants'
import { getDirtyFormValues, toaster } from 'helper/helper'
import { useNavigate, useParams } from 'react-router-dom'
import { route } from 'shared/constants/AllRoutes'
import Wrapper from 'shared/components/Wrap'
import Media from 'shared/components/Media'
import { iconMediaIcon, iconMediaImg, iconMediaVideo } from 'assets/images/icons'
import Axios from 'axios.js'
import axios from 'axios'
import { addGame, getGameById, updateGame } from 'query/game/game.query'
import { Loader } from 'shared/components/Loader'
import NotFound from 'shared/components/404'

export default function AddGamePage () {
  const navigate = useNavigate()
  const { id, type } = useParams()

  const [mediaUploadLoading, setMediaUploadLoading] = useState(false)
  const [fileIcon, setFileIcon] = useState([])
  const [fileImages, setFileImages] = useState([])
  const [fileVideos, setFileVideos] = useState([])
  const [videoLinks, setVideoLinks] = useState()
  const [imageLinks, setImageLinks] = useState()
  const [gameicon, setGameIcon] = useState([])
  const [updatedData, SetUpdateData] = useState()

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, dirtyFields, isDirty },
    clearErrors,
    trigger,
    reset,
    watch
  } = useForm({ mode: 'onTouched' })
  // edit
  const {
    isFetching: gameViewFetching,
    isLoading: gameViewLoading,
    isError
  } = useQuery(['gameById'], () => getGameById(id), {
    enabled: !!id && type === 'edit',
    select: (data) => data.data.data,
    onSuccess: (response) => {
      reset({
        sGameName: response.sGameName,
        sGameUrl: response?.sGameUrl,
        sGameDescription: response?.sGameDescription,
        sSubjectCovered: response?.sSubjectCovered,
        sSuitableFor: response?.sSuitableFor,
        sCustomizable: response?.sCustomizable
      })
      setGameIcon([response?.sGameIcon])
      setVideoLinks(response?.aMedia.filter((item) => item.endsWith('.mp4') || item.endsWith('.MP4')))
      setImageLinks(
        response?.aMedia.filter(
          (item) => item.endsWith('.jpeg') || item.endsWith('.jpg') || item.endsWith('.JPEG') || item.endsWith('.JPG')
        )
      )
    }
  })

  const { mutate, isLoading } = useMutation(addGame, {
    onSuccess: (response) => {
      toaster(response.data.message)
      navigate(route.gameManagement)
    }
  })

  const { mutate: Updatemutate, isLoading: UpdateLoading } = useMutation(updateGame, {
    onSuccess: (response) => {
      toaster(response.data.message)
      navigate(route.gameManagement)
    },
    onError: () => {
      navigate(route.gameManagement)
    }
  })

  useEffect(() => {
    const isDirtyData = {
      sGameName: watch('sGameName'),
      sGameUrl: watch('sGameUrl'),
      sGameDescription: watch('sGameDescription'),
      sSubjectCovered: watch('sSubjectCovered'),
      sSuitableFor: watch('sSuitableFor'),
      sCustomizable: watch('sCustomizable')
    }

    const data = getDirtyFormValues(dirtyFields, isDirtyData)
    const payloaddata = JSON.parse(JSON.stringify(data))
    SetUpdateData(payloaddata)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dirtyFields,
    videoLinks,
    imageLinks,
    gameicon,
    watch('sGameIcon'),
    watch('sGameName'),
    watch('sGameUrl'),
    watch('sSubjectCovered'),
    watch('sSuitableFor'),
    watch('sGameDescription'),
    watch('sCustomizable')
  ])

  async function onSubmit (data) {
    const payLoad = {
      aMedia: [],
      gameIcon: ''
    }
    if (data) {
      setMediaUploadLoading(true)

      if (!id) {
        const dataIcon = fileIcon[0]
        const array = [fileImages, fileVideos]

        const presign_for_icon = await Axios.post(`/game/game-presign-url?key=${dataIcon.name}&sMedia=${dataIcon.type}`)
        const response_of_icon = await axios.put(presign_for_icon?.data?.data?.sUrl, dataIcon)

        if (response_of_icon.status === 200) {
          payLoad.gameIcon = presign_for_icon?.data?.data?.sPath
        }

        for await (const value of array) {
          for await (const element of value) {
            if (element.name && element.type) {
              const presign_for_aMedia = await Axios.post(`/game/game-presign-url?key=${element.name}&sMedia=${element.type}`)
              const res = await axios.put(presign_for_aMedia?.data?.data?.sUrl, element, { headers: { 'Content-Type': element.type } })
              if (res.status === 200) {
                payLoad.aMedia.push(presign_for_aMedia?.data?.data?.sPath)
              }
            }
          }
        }
        setMediaUploadLoading(false)
        mutate({
          sGameName: data?.sGameName,
          sGameIcon: payLoad?.gameIcon,
          sGameUrl: data?.sGameUrl,
          sGameDescription: data?.sGameDescription,
          sSubjectCovered: data?.sSubjectCovered,
          sSuitableFor: data?.sSuitableFor,
          sCustomizable: data?.sCustomizable,
          aMedia: payLoad?.aMedia
        })
      } else {
        if (typeof gameicon[0] === 'string') {
          payLoad.gameIcon = gameicon[0]
        } else {
          const dataIcon = gameicon[0]
          const presign_for_icon = await Axios.post(`/game/game-presign-url?key=${dataIcon.name}&sMedia=${dataIcon.type}`)
          const response_of_icon = await axios.put(presign_for_icon?.data?.data?.sUrl, dataIcon)

          if (response_of_icon.status === 200) {
            payLoad.gameIcon = presign_for_icon?.data?.data?.sPath
          }
        }

        const UpdatedFilesImage = imageLinks.filter((element) => typeof element !== 'string')
        const UpdatedFilesVideos = videoLinks.filter((element) => typeof element !== 'string')

        if (UpdatedFilesImage.length !== 0 || UpdatedFilesVideos.length !== 0) {
          const oldImage = imageLinks.filter((element) => typeof element === 'string')
          const oldVideos = videoLinks.filter((element) => typeof element === 'string')
          payLoad.aMedia = [...oldImage, ...oldVideos]

          const array = [UpdatedFilesImage, UpdatedFilesVideos]

          for await (const value of array) {
            for await (const element of value) {
              if (element.name && element.type) {
                const presign_for_aMedia = await Axios.post(`/game/game-presign-url?key=${element.name}&sMedia=${element.type}`)
                const res = await axios.put(presign_for_aMedia?.data?.data?.sUrl, element, { headers: { 'Content-Type': element.type } })
                if (res.status === 200) {
                  payLoad.aMedia.push(presign_for_aMedia?.data?.data?.sPath)
                }
              }
            }
          }
        } else {
          payLoad.aMedia = [...imageLinks, ...videoLinks]
        }
        Updatemutate({
          id: id,
          gameData: { ...updatedData, aMedia: payLoad?.aMedia, sGameIcon: payLoad?.gameIcon }
        })
      }
    }
  }

  useEffect(() => {
    document.title = 'Add Game'
  }, [])

  const [showCancel, setShowCancel] = useState(false)

  const handleCancel = () => setShowCancel(!showCancel)
  const handleClose = () => setShowCancel(false)
  const handleConfirmCancel = () => {
    reset()
    navigate(route.adminManagement)
    setShowCancel(false)
  }

  return (
    <>
      {gameViewFetching || gameViewLoading ? (
        <Loader />
      ) : isError ? (
        <NotFound />
      ) : (
        <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <div className='user-form'>
            <Row>
              <Col xxl='9'>
                <Wrapper>
                  <Row>
                    <Col sm={6}>
                      <CommonInput
                        type='text'
                        name='sGameName'
                        label='gameName'
                        placeholder='Enter Game Name'
                        className={`form-control ${errors?.sGameName && 'error'}`}
                        required
                        register={register}
                        errors={errors}
                        validation={{
                          maxLength: { value: 15, message: validationErrors.rangeLength(4, 15) },
                          minLength: { value: 4, message: validationErrors.rangeLength(4, 15) },
                          required: { value: true, message: validationErrors.gameNameRequired }
                        }}
                        disabled={mediaUploadLoading || isLoading}
                      />
                    </Col>
                    <Col sm={6}>
                      <CommonInput
                        type='text'
                        name='sGameUrl'
                        label='gameUrl'
                        placeholder='Enter Game URL'
                        className={`form-control ${errors?.sGameUrl && 'error'}`}
                        required
                        register={register}
                        errors={errors}
                        validation={{
                          pattern: { value: URL_REGEX, message: validationErrors.url },
                          required: { value: true, message: validationErrors.urlRequired }
                        }}
                        disabled={mediaUploadLoading || isLoading}
                      />
                    </Col>
                    <Col sm={6}>
                      <CommonInput
                        type='textarea'
                        name='sSubjectCovered'
                        label='subjectCoverd'
                        placeholder='Enter Subject'
                        required
                        register={register}
                        errors={errors}
                        className={`form-control ${errors?.sSubjectCovered && 'error'}`}
                        validation={{
                          maxLength: { value: 100, message: validationErrors.rangeLength(4, 100) },
                          minLength: { value: 4, message: validationErrors.rangeLength(4, 100) },
                          required: { value: true, message: validationErrors.subjectCoveredRequired }
                        }}
                        disabled={mediaUploadLoading || isLoading}
                      />
                    </Col>
                    <Col sm={6}>
                      <CommonInput
                        type='textarea'
                        name='sSuitableFor'
                        label='suitableFor'
                        placeholder='Enter Suitable for...'
                        className={`form-control ${errors?.sSuitableFor && 'error'}`}
                        required
                        register={register}
                        errors={errors}
                        validation={{
                          maxLength: { value: 100, message: validationErrors.rangeLength(4, 100) },
                          minLength: { value: 4, message: validationErrors.rangeLength(4, 100) },
                          required: { value: true, message: validationErrors.suitableForRequired }
                        }}
                        disabled={mediaUploadLoading || isLoading}
                      />
                    </Col>
                    <Col sm={6}>
                      <CommonInput
                        type='textarea'
                        name='sCustomizable'
                        label='customizable'
                        placeholder='Enter Customizable'
                        className={`form-control ${errors?.sCustomizable && 'error'}`}
                        required
                        register={register}
                        errors={errors}
                        validation={{
                          maxLength: { value: 100, message: validationErrors.rangeLength(4, 100) },
                          minLength: { value: 4, message: validationErrors.rangeLength(4, 100) },
                          required: { value: true, message: validationErrors.customizableRequired }
                        }}
                        disabled={mediaUploadLoading || isLoading}
                      />
                    </Col>
                    <Col sm={6}>
                      <CommonInput
                        type='textarea'
                        name='sGameDescription'
                        label='gameDescription'
                        placeholder='Enter Game Description'
                        className={`form-control ${errors?.sGameDescription && 'error'}`}
                        required
                        register={register}
                        errors={errors}
                        validation={{
                          maxLength: { value: 100, message: validationErrors.rangeLength(4, 100) },
                          minLength: { value: 4, message: validationErrors.rangeLength(4, 100) },
                          required: { value: true, message: validationErrors.gameDescriptionRequired }
                        }}
                        disabled={mediaUploadLoading || isLoading}
                      />
                    </Col>
                    <Col lg={12}>
                      <Row>
                        <Col md={4} sm={6}>
                          <Media
                            Icon={iconMediaIcon}
                            label='gameIcon'
                            limit={1}
                            required
                            file={fileIcon}
                            setFile={setFileIcon}
                            register={register}
                            name='gameIcon'
                            errors={errors}
                            getValues={getValues}
                            setError={setError}
                            clearErrors={clearErrors}
                            trigger={trigger}
                            acceptMediaType='image/jpeg'
                            maxsize={1}
                            disabled={mediaUploadLoading || isLoading || UpdateLoading}
                            type={id && type === 'edit' ? 'edit' : ''}
                            urls={gameicon}
                            setUrls={setGameIcon}
                          />
                        </Col>
                        <Col md={4} sm={6}>
                          <Media
                            Icon={iconMediaImg}
                            label='gameImages'
                            limit={5}
                            required
                            file={fileImages}
                            setFile={setFileImages}
                            register={register}
                            name='Image'
                            errors={errors}
                            getValues={getValues}
                            setError={setError}
                            clearErrors={clearErrors}
                            trigger={trigger}
                            acceptMediaType='image/jpeg'
                            maxsize={1}
                            disabled={mediaUploadLoading || isLoading || UpdateLoading}
                            type={id && type === 'edit' ? 'edit' : ''}
                            urls={imageLinks}
                            setUrls={setImageLinks}
                          />
                        </Col>
                        <Col md={4} sm={6}>
                          <Media
                            Icon={iconMediaVideo}
                            label='gameVideos'
                            limit={5}
                            required
                            file={fileVideos}
                            setFile={setFileVideos}
                            register={register}
                            name='Videos'
                            errors={errors}
                            getValues={getValues}
                            setError={setError}
                            clearErrors={clearErrors}
                            trigger={trigger}
                            acceptMediaType='video/*'
                            maxsize={10}
                            disabled={mediaUploadLoading || isLoading || UpdateLoading}
                            type={id && type === 'edit' ? 'edit' : ''}
                            urls={videoLinks}
                            setUrls={setVideoLinks}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={12}>
                      <div className='mt-2'>
                        {!id ? (
                          <>
                            <Button variant='secondary' className='me-2' disabled={isLoading || mediaUploadLoading} onClick={() => navigate(route.gameManagement)}>
                              Cancel
                            </Button>
                            <Button variant='primary' type='submit' className='my-2 ' disabled={isLoading || mediaUploadLoading}>
                              {!mediaUploadLoading ? <FormattedMessage id='createGame' /> : 'Uploading...'}
                              {(isLoading || mediaUploadLoading) && <Spinner animation='border' size='sm' />}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant='secondary' className='me-2' disabled={UpdateLoading || mediaUploadLoading} onClick={() => navigate(route.gameManagement)}>
                              Cancel
                            </Button>
                            <Button
                              variant='primary'
                              type='submit'
                              className='my-2 '
                              disabled={UpdateLoading || mediaUploadLoading || !isDirty}
                            >
                              {!mediaUploadLoading ? 'Update Game' : 'Uploading...'}
                            </Button>
                          </>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Wrapper>
              </Col>
            </Row>
          </div>
        </Form>
      )}
    </>
  )
}
