import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history} = props
  const logoutSuccess = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div>
      <div className="header-container">
        <Link to="/" className="link">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="header-logo"
          />
        </Link>
        <div className="names-cont">
          <Link to="/" className="link">
            <p className="name">Home</p>
          </Link>
          <Link to="/jobs" className="link">
            <p className="name">Jobs</p>
          </Link>
        </div>
        <button type="button" className="logout-button" onClick={logoutSuccess}>
          Logout
        </button>
      </div>
    </div>
  )
}
export default withRouter(Header)
