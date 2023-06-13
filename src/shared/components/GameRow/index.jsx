import React from 'react'
import PropTypes from 'prop-types'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { route } from 'shared/constants/AllRoutes'
import config from 'config'

function GameRow({ user, index, onDelete }) {
  return (
    <tr key={user._id} style={{ textAlign: 'center' }}>
      <td>{index + 1}</td>
      <td>{user.sGameName || '-'}</td>
      <td>{user.sGameUrl || '-'}</td>
      <td>
        <img height='85px' src={config?.s3 + encodeURIComponent(user.sGameIcon)} />
      </td>
      <td>
        {user.sGameDescription?.length >= 20 ? (
          <OverlayTrigger
            overlay={
              <Tooltip placement='bottom' id='tooltip-disabled'>
                {user.sGameDescription}
              </Tooltip>
            }
          >
            <span>{user.sGameDescription?.substr(0, 21) + '...' || '-'}</span>
          </OverlayTrigger>
        ) : (
          <span>{user.sGameDescription || '-'}</span>
        )}
      </td>
      <td style={{ textAlign: 'center' }}>
        <Button variant='link' className='square icon-btn' as={Link} to={route.editGame(user?._id, 'edit')}>
          <i className='icon-create d-block' />
        </Button>
        <Button variant='link' className='square icon-btn' onClick={() => onDelete(user._id, user?.sGameName)}>
          <i className='icon-delete d-block' />
        </Button>
      </td>
    </tr>
  )
}
GameRow.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
  onStatusChange: PropTypes.func
}
export default GameRow
