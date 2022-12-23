import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const logoutSuccess = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        alt="website logo"
        className="nav-logo"
      />
      <div className="nav-text-container">
        <Link to="/" className="link">
          {' '}
          <p className="home">Home</p>
        </Link>
        <Link to="/jobs" className="link">
          {' '}
          <p className="home">Jobs</p>
        </Link>
      </div>
      <button type="button" className="logout-button" onClick={logoutSuccess}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
