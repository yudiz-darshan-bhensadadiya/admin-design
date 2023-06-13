import React, { Fragment } from 'react'

import { Link as RouterLink, useLocation, useParams } from 'react-router-dom'
import { Breadcrumb } from 'react-bootstrap'

function Breadcrumbs() {
  const { id } = useParams()
  const location = useLocation()

  const pathNames = location.pathname.split('/').filter((x) => x)
  const items = pathNames.filter((value) => value !== id)
  return (
    <Breadcrumb className='breadcrumb-main' style={{ '--bs-breadcrumb-divider': '>' }}>
      {items.map((value, index) => {
        const last = index === items.length - 1
        const to = location.pathname.split(value)[0]
        return last ? (
          <Breadcrumb.Item active key={value}>
            {value}
          </Breadcrumb.Item>
        ) : (
          <Fragment key={value}>
            <Breadcrumb.Item linkAs={RouterLink} linkProps={{ to: to + value }}>
              {value}
            </Breadcrumb.Item>
            <i className='icon-chevron-right'></i>
          </Fragment>
        )
      })}
    </Breadcrumb>
  )
}

export default Breadcrumbs
