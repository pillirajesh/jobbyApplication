import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showError: false, errorMessage: ''}

  getUserName = event => {
    this.setState({username: event.target.value})
  }

  getPassword = event => {
    this.setState({password: event.target.value})
  }

  loginFailure = errorMessage => {
    this.setState({errorMessage, showError: true})
  }

  loginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  submitForm = async event => {
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
    const {username, password, showError, errorMessage} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="app-container">
        <div className="login-container">
          <div className="login-image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="web-logo"
            />
          </div>
          <div className="label-container">
            <div>
              <form onSubmit={this.submitForm}>
                <label htmlFor="userInput" className="label">
                  USERNAME
                </label>
                <br />
                <input
                  type="text"
                  className="input"
                  id="userInput"
                  onChange={this.getUserName}
                  value={username}
                  placeholder="Username"
                />
                <br />

                <label htmlFor="passwdInput" className="label">
                  PASSWORD
                </label>
                <br />
                <input
                  type="password"
                  className="input"
                  id="passwdInput"
                  onChange={this.getPassword}
                  value={password}
                  placeholder="Password"
                />
                <br />
                <button type="submit" className="login-button">
                  Login
                </button>
                {showError && <p className="error-message">*{errorMessage}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
