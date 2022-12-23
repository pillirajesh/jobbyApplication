import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  changeUserInput = event => {
    this.setState({username: event.target.value})
  }

  changePasswordInput = event => {
    this.setState({password: event.target.value})
  }

  loginFailure = errorMessage => {
    this.setState({showSubmitError: true, errorMsg: errorMessage})
  }

  loginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  submitLoginDetails = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.loginSuccess(data.jwt_token)
    } else {
      this.loginFailure(data.error_msg)
    }
  }

  render() {
    const {showSubmitError, errorMsg, username, password} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <form onSubmit={this.submitLoginDetails}>
        <div className="app-container">
          <div className="login-container">
            <div className="logo-container">
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                className="logo"
                alt="website logo"
              />
            </div>
            <div className="input-container">
              <div>
                <label className="label" htmlFor="username">
                  USERNAME
                </label>
                <br />
                <input
                  type="text"
                  id="username"
                  className="input"
                  placeholder="Username"
                  value={username}
                  onChange={this.changeUserInput}
                />
                <br />
                <label className="label" htmlFor="password">
                  PASSWORD
                </label>
                <br />
                <input
                  type="password"
                  id="password"
                  className="input"
                  placeholder="Password"
                  value={password}
                  onChange={this.changePasswordInput}
                />
                <br />
                <button type="submit" className="login-button">
                  Login
                </button>
                {showSubmitError && (
                  <p className="error-message">*{errorMsg}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default Login
