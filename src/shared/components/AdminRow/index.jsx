import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { route } from 'shared/constants/AllRoutes'
import moment from 'moment'
import lockicon from 'assets/images/icons/password.png'

function AdminRow({ user, index, onStatusChange, onDelete, onPassChange }) {
  return (
    <tr key={user._id} style={{ textAlign: 'center' }}>
      <td>{index + 1}</td>
      <td>{user.sFullName || '-'}</td>
      <td>{user.sSchoolName || '-'}</td>
      <td>{user.sPackageName || '-'}</td>
      <td>{moment(user.dPackageEndDate).format('MM-DD-YYYY') || '-'}</td>
      <td>
        <Form.Check
          type='switch'
          name={user._id}
          className='d-inline-block me-1'
          checked={user.eStatus === 'y'}
          onChange={(e) => onStatusChange(user?._id, e.target.checked)}
        />
      </td>
      <td style={{ textAlign: 'center' }}>
        <Button variant='link' className='square icon-btn' as={Link} to={route.viewAdmin(user?._id)}>
          <i className='icon-visibility d-block' />
        </Button>
        <Button variant='link' className='square icon-btn' as={Link} to={route.editAdmin(user?._id)}>
          <i className='icon-create d-block' />
        </Button>
        <Button variant='link' className='square icon-btn lock-icon' onClick={() => onPassChange(user?._id, user?.sFullName)}>
          <img src={lockicon} alt='lock' />
        </Button>
        <Button variant='link' className='square icon-btn' onClick={() => onDelete(user._id, user?.sFullName)}>
          <i className='icon-delete d-block' />
        </Button>
      </td>
    </tr>
  )
}
AdminRow.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
  onStatusChange: PropTypes.func
}
export default AdminRow
