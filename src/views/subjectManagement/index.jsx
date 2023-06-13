import { getDirtyFormValues, toaster } from 'helper/helper'
import { addSubject, deleteSubject, editSubjectById, getSubjectList, viewSubjectById } from 'query/subject/subject.query'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import CommonInput from 'shared/components/CommonInput'
import DataTable from 'shared/components/DataTable'
import TinyEditor from 'shared/components/Editor'
import CustomModal from 'shared/components/Modal'
import SubjectRow from 'shared/components/SubjectRow'
import TopBar from 'shared/components/Topbar'
import { subjectTableColumns } from 'shared/constants/TableHeaders'
import { validationErrors } from 'shared/constants/ValidationErrors'
import { appendParams, parseParams } from 'shared/utils'

function SubjectManagement() {
  useEffect(() => {
    document.title = 'Subject Management'
  }, [])

  const location = useLocation()
  const parsedData = parseParams(location.search)
  const params = useRef(parseParams(location.search))

  const query = useQueryClient()

  // params
  function getRequestParams(e) {
    const data = e ? parseParams(e) : params.current
    return {
      pageNumber: +data?.pageNumber || 1,
      search: data?.search || '',
      size: data?.size || 10,
      eStatus: data.eStatus || '',
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      sort: data.sort || '',
      orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC'
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    reset,
    watch,
    control
  } = useForm({ mode: 'all' })

  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [subjectlist, setSubjectlist] = useState()
  const [columns, setColumns] = useState(getSortedColumns(subjectTableColumns, parsedData))
  const [show, setShow] = useState(false)
  const [showAddEdit, setShowAddEdit] = useState(false)
  const [deleteId, setDeleteId] = useState()
  const [deleteName, setDeleteName] = useState()
  const [editId, setEditId] = useState()
  const [payload, setpayload] = useState({})
  const [showAdd, setShowAdd] = useState(false)

  const handleClose = () => setShow(false)
  const handleCloseAddEdit = () => {
    setShowAddEdit(false)
    setEditId()
    reset({
      sSubjectName: null,
      sSubjectInfo: null
    })
  }

  const handelAdd = () => {
    setShowAdd(false)
    reset({
      sSubjectName: null,
      sSubjectInfo: null
    })
  }

  function getSortedColumns(subjectTableColumns, urlData) {
    return subjectTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
  }

  function handlePageEvent(page) {
    setRequestParams({ ...requestParams, pageNumber: page })
    appendParams({ pageNumber: page })
  }

  function handleSort(field) {
    let selectedFilter
    const filter = columns.map((data) => {
      if (data.internalName === field.internalName) {
        data.type = +data.type === 1 ? -1 : 1
        selectedFilter = data
      } else {
        data.type = 1
      }
      return data
    })
    setColumns(filter)
    const params = {
      ...requestParams,
      page: 0,
      sort: selectedFilter?.internalName,
      orderBy: selectedFilter.type === 1 ? 'ASC' : 'DESC'
    }
    setRequestParams(params)
    appendParams({
      sort: selectedFilter.type !== 0 ? selectedFilter.internalName : '',
      orderBy: selectedFilter.type
    })
  }

  async function handleHeaderEvent(name, value) {
    switch (name) {
      case 'rows':
        setRequestParams({
          ...requestParams,
          size: Number(value),
          pageNumber: 1
        })
        appendParams({ size: Number(value), pageNumber: 1 })
        break
      case 'search':
        setRequestParams({ ...requestParams, search: value, pageNumber: 1 })
        appendParams({ pageNumber: 1 })
        break
      default:
        break
    }
  }

  // List
  const { isLoading, isFetching } = useQuery(['subjectList', requestParams], () => getSubjectList(requestParams), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setSubjectlist(response)
    }
  })

  // List
  const { isLoading: viewLoading, isFetching: viewFetching } = useQuery(['viewSubject'], () => viewSubjectById(editId), {
    enabled: !!editId,
    select: (data) => data.data.data,
    onSuccess: (response) => {
      reset({
        sSubjectName: response.sSubjectName,
        sSubjectInfo: response.sSubjectInfo
      })
    }
  })

  // Delete
  const { isLoading: deleteLoading, mutate } = useMutation(deleteSubject, {
    onSuccess: (res) => {
      query.invalidateQueries('subjectList')
      toaster(res?.data?.message)
      setShow(!show)
    }
  })
  const handleConfirmDelete = (id) => {
    mutate({ id })
  }
  const onDelete = (id, name) => {
    setShow(!show)
    setDeleteId(id)
    setDeleteName(name)
  }

  // EDIT SUBJECT
  const { isLoading: editLoading, mutate: editMutate } = useMutation(editSubjectById, {
    onSuccess: (res) => {
      query.invalidateQueries('subjectList')
      toaster(res?.data?.message)
      setShowAddEdit(!showAddEdit)
      setEditId()
    }
  })

  const onEdit = (id) => {
    setShowAddEdit(!showAddEdit)
    setEditId(id)
  }

  // ADD SUBJECT
  const { isLoading: addLoading, mutate: addMutate } = useMutation(addSubject, {
    onSuccess: (response) => {
      query.invalidateQueries('subjectList')
      reset({
        sSubjectName: null,
        sSubjectInfo: null
      })
      toaster(response.data.message)
      setShowAdd(false)
    }
  })

  function onAdd() {
    setShowAdd(!showAdd)
  }

  const onSubmit = (data) => {
    if (showAddEdit) {
      if (data) {
        editMutate({ ...payload, id: editId })
      }
    } else {
      if (data) {
        addMutate({
          sSubjectName: data.sSubjectName,
          sSubjectInfo: data?.sSubjectInfo
        })
      }
    }
  }

  // DIRTY FIELDS
  useEffect(() => {
    const isDirtyData = {
      sSubjectName: watch('sSubjectName'),
      sSubjectInfo: watch('sSubjectInfo')
    }
    const payloaddata = getDirtyFormValues(dirtyFields, isDirtyData)
    setpayload(payloaddata)
  }, [dirtyFields, watch('sSubjectName'), watch('sSubjectInfo')])

  return (
    <>
      <TopBar
        buttons={[
          {
            text: useIntl().formatMessage({ id: 'create subject' }),
            icon: 'icon-add',
            type: 'primary',
            clickEventName: 'createSubject'
          }
        ]}
        btnEvent={onAdd}
      />
      <div>
        <DataTable
          columns={columns}
          header={{
            left: {
              rows: true
            },
            right: {
              search: true
            }
          }}
          sortEvent={handleSort}
          headerEvent={(name, value) => handleHeaderEvent(name, value)}
          totalRecord={subjectlist?.count?.totalData || 0}
          pageChangeEvent={handlePageEvent}
          isLoading={isLoading || isFetching}
          pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.size }}
        >
          {subjectlist?.subjects?.map((user, index) => {
            return <SubjectRow key={user._id} index={index} user={user} onDelete={onDelete} onEdit={onEdit} />
          })}
        </DataTable>

        <CustomModal
          open={show}
          handleClose={handleClose}
          handleConfirm={handleConfirmDelete}
          disableHeader
          bodyTitle='Confirm Delete?'
          isLoading={deleteLoading}
          confirmValue={deleteId}
        >
          <article>
            <h5>
              <>
                <div>
                  Are you sure, you want to delete the <b style={{ color: 'red' }}> {deleteName}</b> ?
                </div>
                <span>( All the Stages and the student’s progress will be deleted )</span>
              </>
            </h5>
          </article>
        </CustomModal>

        <CustomModal
          open={showAddEdit}
          handleClose={handleCloseAddEdit}
          handleConfirm={handleConfirmDelete}
          disableHeader
          disableFooter
          bodyTitle='Edit Subject'
          confirmValue={deleteId}
        >
          <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <CommonInput
              type='text'
              name='sSubjectName'
              label='Subject Name'
              placeholder='Maths'
              className={`form-control ${errors?.sSubjectName && 'error'}`}
              required
              register={register}
              errors={errors}
              isLoading={viewLoading || viewFetching}
              validation={{
                maxLength: { value: 20, message: validationErrors.rangeLength(2, 20) },
                minLength: { value: 2, message: validationErrors.rangeLength(2, 20) },
                required: { value: true, message: 'Subject Name is Required' }
              }}
            />
            <CommonInput
              type='textarea'
              name='sSubjectInfo'
              label='Subject Overview'
              placeholder='Enter Subject Overview'
              required
              register={register}
              errors={errors}
              className={`form-control ${errors?.sSubjectCovered && 'error'}`}
              validation={{
                maxLength: { value: 80, message: validationErrors.rangeLength(4, 80) },
                minLength: { value: 4, message: validationErrors.rangeLength(4, 80) },
                required: { value: true, message: 'Subject Overview is required' }
              }}
            />
            <Modal.Footer>
              <Button
                variant='secondary'
                onClick={() => {
                  handleCloseAddEdit()
                }}
              >
                Cancel
              </Button>
              <Button variant='primary' type='submit' disabled={!isDirty || editLoading || viewFetching || viewLoading}>
                Update
                {editLoading && <Spinner animation='border' size='sm' />}
              </Button>
            </Modal.Footer>
          </Form>
        </CustomModal>

        <CustomModal open={showAdd} handleClose={handelAdd} disableHeader disableFooter bodyTitle='Add Subject' confirmValue={deleteId}>
          <Form className='step-one' autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <div className='personal-details'>
              <div className='user-form'>
                <Row>
                  <CommonInput
                    type='text'
                    name='sSubjectName'
                    label='Subject Name'
                    placeholder='Maths'
                    className={`form-control ${errors?.sSubjectName && 'error'}`}
                    required
                    register={register}
                    errors={errors}
                    validation={{
                      maxLength: {
                        value: 20,
                        message: validationErrors.rangeLength(4, 20)
                      },
                      minLength: {
                        value: 4,
                        message: validationErrors.rangeLength(4, 20)
                      },
                      required: {
                        value: true,
                        message: validationErrors.subjectNameRequired
                      }
                    }}
                  />
                </Row>
                <CommonInput
                  type='textarea'
                  name='sSubjectInfo'
                  label='Subject Overview'
                  placeholder='Enter Subject Overview'
                  required
                  register={register}
                  errors={errors}
                  className={`form-control ${errors?.sSubjectCovered && 'error'}`}
                  validation={{
                    maxLength: { value: 80, message: validationErrors.rangeLength(4, 80) },
                    minLength: { value: 4, message: validationErrors.rangeLength(4, 80) },
                    required: { value: true, message: 'Subject Overview is required' }
                  }}
                />

                <Button
                  variant='secondary'
                  onClick={() => {
                    handelAdd()
                  }}
                >
                  Cancel
                </Button>
                <Button variant='primary' type='submit' className='m-2' disabled={addLoading}>
                  <FormattedMessage id='Add' />
                  {addLoading && <Spinner animation='border' size='sm' />}
                </Button>
              </div>
            </div>
          </Form>
        </CustomModal>
      </div>
    </>
  )
}

export default SubjectManagement
