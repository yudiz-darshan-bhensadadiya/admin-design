import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

function AuthLayout({ children }) {
  return (
    <div className='auth-main'>
      <div className='child-box'>
        <Suspense
          fallback={
            <div>
              <FormattedMessage id='loading' />
              ...
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  )
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired
}

export default AuthLayout
