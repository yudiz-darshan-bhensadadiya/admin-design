import React from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function SubjectRow({ user, index, onDelete, onEdit }) {
  return (
    <tr key={user._id} style={{ textAlign: 'center' }}>
      <td>{index + 1}</td>
      <td>{user?.sSubjectName || '-'}</td>

      <td>
        {user.sSubjectInfo?.length >= 20 ? (
          <OverlayTrigger
            overlay={
              <Tooltip placement='bottom' id='tooltip-disabled'>
                {user.sSubjectInfo}
              </Tooltip>
            }
          >
            <span>{user.sSubjectInfo?.substr(0, 21) + '...' || '-'}</span>
          </OverlayTrigger>
        ) : (
          <span>{user.sSubjectInfo || '-'}</span>
        )}
      </td>
      <td>{user?.stagCount.toString() || '-'}</td>
      <td style={{ textAlign: 'center' }}>
        <Button variant='link' className='square icon-btn' as={Link} onClick={() => onEdit(user?._id)}>
          <i className='icon-create d-block' />
        </Button>
        <Button variant='link' className='square icon-btn' onClick={() => onDelete(user?._id, user?.sSubjectName)}>
          <i className='icon-delete d-block' />
        </Button>
      </td>
    </tr>
  )
}

export default SubjectRow
