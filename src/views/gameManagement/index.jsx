import TopBar from 'shared/components/Topbar'
import { route } from 'shared/constants/AllRoutes'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import DataTable from 'shared/components/DataTable'
import { appendParams, parseParams } from 'shared/utils'
import CustomModal from 'shared/components/Modal'
import { toaster } from 'helper/helper'
import { deleteGame, getGameList } from 'query/game/game.query'
import GameRow from 'shared/components/GameRow'
import { gameTableColumns } from 'shared/constants/TableHeaders'

export default function GameManagement() {
  useEffect(() => {
    document.title = 'Game Management'
  }, [])

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
      sort: data.sort || '',
      orderBy: +data.orderBy === 1 ? 'ASC' : 'DESC'
    }
  }

  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [columns, setColumns] = useState(getSortedColumns(gameTableColumns, parsedData))
  const [gameList, setGameList] = useState()
  const [show, setShow] = useState(false)
  const [deleteId, setDeleteId] = useState()
  const [deleteName, setDeleteName] = useState()
  const [deleteError, setDeleteError] = useState({ state: false, message: '' })

  function getSortedColumns(gameTableColumns, urlData) {
    return gameTableColumns?.map((column) => (column.internalName === urlData?.sort ? { ...column, type: +urlData?.orderBy } : column))
  }

  const handleClose = () => setShow(false)

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
  const { isLoading, isFetching } = useQuery(['games', requestParams], () => getGameList(requestParams), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setGameList(response)
    }
  })

  // Delete
  const { isLoading: deleteLoading, mutate } = useMutation(deleteGame, {
    onSuccess: (res) => {
      query.invalidateQueries('games')
      toaster(res?.data?.message)
      setShow(!show)
    },
    onError: (err) => {
      setDeleteError({ [deleteId]: { state: true, message: err.response.data.message } })
    }
  })
  const handleConfirmDelete = (id) => {
    mutate({ id, disableToast: true })
  }
  const onDelete = (id, name) => {
    setShow(!show)
    setDeleteId(id)
    setDeleteName(name)
  }

  return (
    <>
      <TopBar
        buttons={[
          {
            text: useIntl().formatMessage({ id: 'createGame' }),
            icon: 'icon-add',
            type: 'primary',
            clickEventName: 'createGame'
          }
        ]}
        btnEvent={() => navigate(route.addGame)}
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
          totalRecord={gameList?.count?.totalGame || 0}
          pageChangeEvent={handlePageEvent}
          isLoading={isLoading || isFetching}
          pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.size }}
        >
          {gameList?.game?.map((user, index) => {
            return <GameRow key={user._id} index={index} user={user} onDelete={onDelete} />
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
          singleButton={deleteError[deleteId]?.state}
          setSingleButtonEvent={deleteError?.state === true && setDeleteError}
        >
          <article>
            <h5>
              {deleteError[deleteId]?.state ? (
                <span>{deleteError[deleteId]?.message}</span>
              ) : (
                <>
                  <div>
                    Are you sure, you want to delete the <b style={{ color: 'red' }}> {deleteName}</b> ?
                  </div>
                </>
              )}
            </h5>
          </article>
        </CustomModal>
      </div>
    </>
  )
}
