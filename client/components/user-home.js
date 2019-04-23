import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import HomePageChart from './HomePageChart'
import CompareChart from './CompareChart'

/**
 * COMPONENT
 */
export const UserHome = props => {
  const {email} = props

  return (
    <div>
      <h3>Welcome, {email}</h3>
      <HomePageChart />
      <CompareChart height={300} width={300} />
    </div>
  )
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapStateToProps)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
