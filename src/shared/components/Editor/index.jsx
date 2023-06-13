import { Editor } from '@tinymce/tinymce-react'
import React from 'react'
import { Form } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import { validationErrors } from 'shared/constants/ValidationErrors'

export default function TinyEditor({ name, label, item, control, errors, watch, costomError, isDisabled, required }) {
  return (
    <>
      <Form.Group className='form-group'>
        <Form.Label style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#445774' }}>
            {label}
            {required && <span className='inputStar'>*</span>}
          </span>
          {required && <span style={{ marginRight: '10px', color: '#445774' }}>?</span>}
        </Form.Label>
        <Controller
          name={name}
          control={control}
          defaultValue={item?.sDescription}
          rules={
            required
              ? {
                  required: { value: true, message: `${label} is required` },
                  minLength: { value: 2, message: 'Minimum 2 characters required' }
                }
              : {
                  minLength: { value: 2, message: 'Minimum 2 characters required' }
                }
          }
          render={({ field: { onChange, value } }) => {
            return (
              <>
                <Editor
                  disabled={isDisabled}
                  apiKey='ci7am361n6k373p9vvhukukjgsuv5tgdyfviidxo2kr4odiq'
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount',
                      'textcolor'
                    ],
                    toolbar: 'bold italic ' + 'forecolor',
                    branding: false,
                    forced_root_block: 'aa'
                  }}
                  onEditorChange={(e) => {
                    onChange(e)
                  }}
                  value={watch ? watch(name) : value}
                />
                {costomError
                  ? errors &&
                    costomError && (
                      <Form.Control.Feedback type='invalid'>
                        {'Please enter a value between 2 and 100 characters long.'}
                      </Form.Control.Feedback>
                    )
                  : errors && errors[name] && <Form.Control.Feedback type='invalid'>{errors[name].message}</Form.Control.Feedback>}
              </>
            )
          }}
        />
      </Form.Group>
    </>
  )
}
