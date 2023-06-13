import React from 'react'
import PropTypes from 'prop-types'
import './style.scss'

const Wrapper = ({ children, style }) => {
  return (
    <section className='wrapper' style={style}>
      {children}
    </section>
  )
}

Wrapper.propTypes = {
  children: PropTypes.node
}
export default Wrapper
