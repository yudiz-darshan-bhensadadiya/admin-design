import React, { useRef } from 'react'
import { Button, Form } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick'
import config from 'config'

function Media({
  label,
  required,
  limit,
  file,
  setFile,
  clearErrors,
  register,
  trigger,
  errors,
  name,
  setError,
  acceptMediaType,
  Icon,
  maxsize,
  disabled,
  type,
  urls,
  setUrls
}) {
  function uploadSingleFile(e) {
    if (!type) {
      const fileLength = file.length
      const imageSize = e.target.files[0]?.size
      const size = maxsize * 1024 * 1024 //  mb

      if (name === 'Icon' && imageSize > size) {
        e.target.value = null
        setError(`${name}Error`, { type: 'custom error', message: `Image is must be less than ${maxsize} mb` })
        return false
      } else {
        clearErrors(`${name}Error`)
      }

      const remainingLength = limit - fileLength
      const selectedFiles = Object.entries(e.target.files).slice(0, remainingLength)
      let ImagesArray = selectedFiles.map((e) => e[1])
      trigger()

      if ([...file, ...ImagesArray].length !== 0) {
        clearErrors(name)
      }

      const filelisttt = [...e.target.files]

      let errorMsg = ''
      filelisttt.map((item, index) => {
        if (item.size >= size && !errorMsg) {
          errorMsg = `${item.name} is greater than ${maxsize} mb`
        }
        return [...e.target.files]
      })

      if (errorMsg) {
        setError(`${name}Error`, { type: 'custom Error', message: errorMsg })
        return false
      } else {
        clearErrors(`${name}Error`)
      }
      setFile([...file, ...ImagesArray])
    } else {
      const fileLength = urls.length
      const imageSize = e.target.files[0]?.size
      const size = maxsize * 1024 * 1024 //  mb
      if (name === 'Icon' && imageSize > size) {
        e.target.value = null
        setError(`${name}Error`, { type: 'custom error', message: `Image is must be less than ${maxsize} mb` })
        return false
      } else {
        clearErrors(`${name}Error`)
      }
      const remainingLength = limit - fileLength
      const selectedFiles = Object.entries(e.target.files).slice(0, remainingLength)
      let ImagesArray = selectedFiles.map((e) => e[1])

      trigger()

      if ([...urls, ...ImagesArray].length !== 0) {
        clearErrors(name)
      }

      const filelisttt = [...e.target.files]

      let errorMsg = ''
      filelisttt.map((item, index) => {
        if (item.size >= size && !errorMsg) {
          errorMsg = `${item.name} is greater than ${maxsize} mb`
        }
        return [...e.target.files]
      })

      if (errorMsg) {
        setError(`${name}Error`, { type: 'custom Error', message: errorMsg })
        return false
      } else {
        clearErrors(`${name}Error`)
      }
      setUrls([...urls, ...ImagesArray])
    }
  }

  function applyValidation() {
    if (!type) {
      return {
        onChange: uploadSingleFile,
        deps: [file, name],
        // required: `${name} is required`,
        validate: () => (file.length < 1 ? `${name} is required` : null)
      }
    } else {
      return {
        onChange: uploadSingleFile,
        deps: [urls, name],
        // required: `${name} is required`,
        validate: () => (urls.length < 1 ? `${name} is required` : null)
      }
    }
  }

  const ref = useRef()
  let { ref: inputRef, ...setRegister } = register(name, applyValidation())

  const addAnotherMedia = () => {
    ref.current.click()
  }

  function deleteFile(e) {
    const s = file.filter((item, index) => index !== e)
    setFile(s)

    if (s?.length === 0) {
      setError(name, { type: 'custom Error', message: `At least one ${name} is Required` })
    }
  }

  const handlePreDelete = (e) => {
    const s = urls.filter((item, index) => index !== e)
    setUrls(s)
    if (s?.length === 0) {
      setError(name, { type: 'custom Error', message: `At least one ${name} is Required` })
    }
  }
  const addAnotherUpdateMedia = () => {
    ref.current.click()
  }

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
  }

  return (
    <article className={`upload_box ${file.length > 0 ? 'upload_box_active' : ''}`}>
      <div className='upload_box_header'>
        {label && (
          <Form.Label>
            {label && <FormattedMessage id={label} />}
            {label && required && <span className='inputStar'>*</span>}
          </Form.Label>
        )}
        {file.length > 0 && limit > 1 && (
          <Button variant='primary' className='add' onClick={() => addAnotherMedia()} disabled={file?.length === limit || disabled}>
            +
          </Button>
        )}
        {urls?.length > 0 && limit > 1 && (
          <Button variant='primary' className='add' onClick={() => addAnotherUpdateMedia()} disabled={urls?.length === limit || disabled}>
            +
          </Button>
        )}
      </div>

      <Form.Group className='form-group w-100'>
        <Form.Control
          type='file'
          multiple
          id='file'
          value={[]}
          {...setRegister}
          accept={acceptMediaType}
          ref={(r) => {
            inputRef(r)
            ref.current = r
          }}
        />

        <div className={`close_media ${errors && errors[name] && 'error'}`}>
          {[file.length > 0] && Icon && (
            <label htmlFor='file'>
              <div className='icon'>
                <img src={Icon} alt='icon' />
              </div>
              <span>
                {`You can add maximum ${limit}  `}
                <FormattedMessage id={label} />
              </span>
              <span>{`size should be less ${maxsize}mb then`}</span>
            </label>
          )}

          <Slider {...settings}>
            {!type
              ? file.length > 0 &&
                file?.map((item, index) => {
                  return (
                    <div key={URL.createObjectURL(item)} className='upload_box_card'>
                      {file[0].type === 'video/mp4' ? (
                        <video src={URL.createObjectURL(item)} />
                      ) : (
                        <img src={URL.createObjectURL(item)} alt='altImage' />
                      )}
                      <Button variant='primary' className='close' onClick={() => deleteFile(index)} disabled={disabled}>
                        x
                      </Button>
                    </div>
                  )
                })
              : urls?.map((url, index) => {
                  return (
                    <div className='upload_box_card' key={index}>
                      {typeof url !== 'string' ? (
                        url?.type === 'video/mp4' ? (
                          <video src={URL.createObjectURL(url)} />
                        ) : (
                          <img src={URL.createObjectURL(url)} alt='altImage' />
                        )
                      ) : url.endsWith('.mp4') ? (
                        <video src={config?.s3 + encodeURIComponent(url)} />
                      ) : (
                        <img src={config?.s3 + encodeURIComponent(url)} alt='' />
                      )}
                      <Button variant='primary' className='close' onClick={() => handlePreDelete(index)} disabled={disabled}>
                        x
                      </Button>
                    </div>
                  )
                })}
          </Slider>
        </div>
        {errors && errors[`${name}Error`] && errors[`${name}Error`].message ? (
          <Form.Control.Feedback type='invalid'>{errors[`${name}Error`].message}</Form.Control.Feedback>
        ) : (
          errors && errors[name] && <Form.Control.Feedback type='invalid'>{errors[name].message}</Form.Control.Feedback>
        )}
      </Form.Group>
    </article>
  )
}

export default Media
