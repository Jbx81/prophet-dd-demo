import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'
import {Link} from 'react-router-dom'

/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <div id="form">
      <div className="form-header">
        <h1 className="welcome" align="center">
          Welcome to Prophet
        </h1>
        <h2 className="header-logo" align="center">
          <img
            src="/ProphetLogo300.svg"
            as="prophet-logo"
            height="100"
            width="100"
          />
        </h2>
        <div className="form-container">
          <form size="large" onSubmit={handleSubmit} name={name}>
            <div className="input-group">
              <label label="E-mail">
                <i className="fa fa-envelope-o fa-fw" />
              </label>
              <input
                name="email"
                label="email"
                type="text"
                placeholder="Enter e-mail address"
              />
            </div>
            <div className="input-group">
              <label label="Password">
                <i className="fa fa-key fa-fw" />
              </label>
              <input
                name="password"
                label="password"
                type="password"
                placeholder="Enter password"
              />
            </div>
            <button
              id="login-button"
              className="btn"
              color="purple"
              fluid
              size="large"
              primary
              type="submit"
            >
              {displayName}
            </button>
          </form>
          <Link to="/login" id="login-link">
            {`Already signed up? | `}
          </Link>
          <Link to="/signup" id="login-signup">
            New user?
          </Link>
        </div>
      </div>
      {error && error.response && <div> {error.response.data} </div>}
      {/* <a href="/auth/google">{displayName} with Google</a> */}
    </div>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
