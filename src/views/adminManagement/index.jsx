import TopBar from 'shared/components/Topbar'
import { route } from 'shared/constants/AllRoutes'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import AdminRow from 'shared/components/AdminRow'
import DataTable from 'shared/components/DataTable'
import { appendParams, parseParams } from 'shared/utils'
import { changeAdminPass, changeAdminStatus, deleteAdmin, getAdminList, updateAdminById } from 'query/admin/admin.query'
import CustomModal from 'shared/components/Modal'
import { toaster } from 'helper/helper'
import { adminTableColumns } from 'shared/constants/TableHeaders'
import { Button, Form, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { PASSWORD } from 'shared/constants'
import CommonInput from 'shared/components/CommonInput'
import { validationErrors } from 'shared/constants/ValidationErrors'
import Modal from 'react-bootstrap/Modal'

export default function AdminMangement() {
  const location = useLocation()
  const parsedData = parseParams(location.search)
  const params = useRef(parseParams(location.search))

  const navigate = useNavigate()
  const query = useQueryClient()

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

  function getSortedColumns(adminTableColumns, urlData) {
    return adminTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
  }

  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [columns, setColumns] = useState(getSortedColumns(adminTableColumns, parsedData))
  const [adminList, setAdminList] = useState()
  const [show, setShow] = useState(false)
  const [deleteId, setDeleteId] = useState()
  const [deleteName, setDeleteName] = useState()
  const [passPopUp, setPassPopUp] = useState(false)
  const [passId, setPassId] = useState(false)

  const handleClose = () => setShow(false)
  const handleClosePassPopUp = () => {
    setPassPopUp(false)
  }

  const {
    handleSubmit: handlePassSubmit,
    formState: { errors: passErrors },
    register,
    reset
  } = useForm({ mode: 'all' })

  const { isLoading: changePassLoading, mutate: changePassMutate } = useMutation(changeAdminPass, {
    onSuccess: () => {
      // query.invalidateQueries('teacherList')
      toaster('Password changed successfully')
      setPassPopUp(false)
      reset({ sPassword: null })
    }
  })
  const handleConfirmPassChange = (data) => {
    changePassMutate({ sPassword: data?.sPassword, id: passId })
  }

  const onPassChange = (id) => {
    setPassId(id)
    setPassPopUp(!passPopUp)
  }

  async function handleHeaderEvent(name, value) {
    switch (name) {
      case 'rows':
        setRequestParams({ ...requestParams, size: Number(value), pageNumber: 1 })
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

  // List
  const { isLoading, isFetching } = useQuery(['admins', requestParams], () => getAdminList(requestParams), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setAdminList(response)
    }
  })

  // Status
  const {
    mutate: statusMutaion,
    isLoading: statusLoading,
    status: updateStatus
  } = useMutation(changeAdminStatus, {
    onSuccess: (response) => {
      toaster(response?.data?.message)
      query.invalidateQueries('admins')
    }
  })

  const handleStatusUpdateUser = (id, status) => {
    statusMutaion({ id, eStatus: status ? 'y' : 'n' })
  }

  // Delete
  const { isLoading: deleteLoading, mutate } = useMutation(deleteAdmin, {
    onSuccess: (res) => {
      query.invalidateQueries('admins')
      toaster(res?.data?.message)
      setShow(!show)
    }
  })
  const onDelete = (id, name) => {
    setShow(!show)
    setDeleteId(id)
    setDeleteName(name)
  }
  const handleConfirmDelete = (id) => {
    mutate(id)
  }

  useEffect(() => {
    document.title = 'Admin Management'
  }, [])

  return (
    <>
      <TopBar
        buttons={[
          {
            text: useIntl().formatMessage({ id: 'createAdmin' }),
            icon: 'icon-add',
            type: 'primary',
            clickEventName: 'createAdmin'
          }
        ]}
        btnEvent={() => navigate(route.addAdmin)}
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
          totalRecord={adminList?.count?.totalData || 0}
          pageChangeEvent={handlePageEvent}
          isLoading={isLoading || isFetching}
          pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.size }}
        >
          {adminList?.admin?.map((user, index) => {
            return (
              <AdminRow
                onPassChange={onPassChange}
                key={user._id}
                index={index}
                user={user}
                onStatusChange={handleStatusUpdateUser}
                onDelete={onDelete}
              />
            )
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
              <div>
                Are you sure, you want to delete the <b style={{ color: 'red' }}> {deleteName}</b> ?
              </div>
              <h6>(Once deleted you can not recover this admin and his data)</h6>
            </h5>
          </article>
        </CustomModal>
      </div>
      <CustomModal
        open={passPopUp}
        handleClose={handleClosePassPopUp}
        disableHeader
        bodyTitle='Change Password'
        disableFooter
        confirmValue={deleteId}
      >
        <article>
          <h5>
            <>
              <Form autoComplete='off' onSubmit={handlePassSubmit(handleConfirmPassChange)}>
                <Form.Group className='form-group w-100 mt-2' style={{ textAlign: 'left' }}>
                  <CommonInput
                    type='text'
                    register={register}
                    errors={passErrors}
                    className={`form-control ${passErrors?.sPassword && 'error'}`}
                    name='sPassword'
                    label='password'
                    placeholder='Enter password'
                    onPaste={true}
                    required
                    validation={{
                      pattern: { value: PASSWORD, message: validationErrors.passwordRegEx },
                      required: { value: true, message: validationErrors.passwordRequired },
                      maxLength: { value: 20, message: validationErrors.rangeLength(8, 20) },
                      minLength: { value: 8, message: validationErrors.rangeLength(8, 20) }
                    }}
                  />
                </Form.Group>
                <Modal.Footer>
                  <Button
                    variant='secondary'
                    onClick={() => {
                      setPassPopUp(false)
                      reset({
                        sPassword: null
                      })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant='primary' type='submit' disabled={changePassLoading}>
                    Confirm
                    {changePassLoading && <Spinner animation='border' size='sm' />}
                  </Button>
                </Modal.Footer>
              </Form>
            </>
          </h5>
        </article>
      </CustomModal>
    </>
  )
}
