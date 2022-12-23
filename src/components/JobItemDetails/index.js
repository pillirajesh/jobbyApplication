import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp, IoBagRemoveSharp} from 'react-icons/io5'
import {BiLinkExternal} from 'react-icons/bi'
import SimilarJobs from '../SimilarJobs'

import Header from '../Header'

import './index.css'

const apiStatusConstans = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobsList: [],
    apiStatus: apiStatusConstans.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstans.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(jobDetailsApiUrl, options)
    const fetchedData = await response.json()

    if (response.ok === true) {
      const data = fetchedData.job_details
      const jobDetails = {
        id: data.id,
        companyLogoUrl: data.company_logo_url,
        companyWebsiteUrl: data.company_website_url,
        employmentType: data.employment_type,
        jobDescription: data.job_description,
        lifeAtCompany: data.life_at_company,
        location: data.location,
        packagePerAnnum: data.package_per_annum,
        rating: data.rating,
        skills: data.skills.map(eachItem => ({
          name: eachItem.name,
          imageUrl: eachItem.image_url,
        })),
        title: data.title,
      }

      const similarJobsList = fetchedData.similar_jobs.map(eachItem => ({
        id: eachItem.id,
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobDetails,
        similarJobsList,
        apiStatus: apiStatusConstans.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstans.failure})
    }
  }

  loadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  retryJobItemDetails = () => this.getJobDetails()

  failureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        onClick={this.retryJobItemDetails()}
        className="btn"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  successView = () => {
    const {jobDetails, similarJobsList} = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <div className="bg-cont">
        <li className="each-job-details-card">
          <div className="logo-container">
            <img
              alt="job details company logo"
              className="company-logo"
              src={companyLogoUrl}
            />
            <div>
              <h1 className="title-heading">{title}</h1>
              <div className="star-container">
                <AiFillStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="main-middle-container">
            <div className="items">
              <div className="middle-container">
                <IoLocationSharp className="location-icon" />
                <p className="rating">{location}</p>
              </div>

              <div className="middle-container">
                <IoBagRemoveSharp className="location-icon" />
                <p className="rating">{employmentType}</p>
              </div>
            </div>
            <div className="package">
              <p>{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="line" />
          <div className="description-visit-container">
            <h1 className="description">Description</h1>
            <a
              className="anchor-cont"
              rel="noreferrer"
              target="_blank"
              href={companyWebsiteUrl}
            >
              <p className="visit-icon">Visit </p>
              <BiLinkExternal className="visiting-icon" />
            </a>
          </div>
          <p className="description-paragraph">{jobDescription}</p>
          <h1 className="description">Skills </h1>
          <ul className="skill-unorderded-list-container">
            {skills.map(eachItem => (
              <li key={eachItem.name} className="skill-container">
                <img
                  alt={eachItem.name}
                  className="skill-image"
                  src={eachItem.imageUrl}
                />
                <p className="skill-name">{eachItem.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="description">Life at Company </h1>
          <div className="life-at-container">
            <p className="life-paragraph">{lifeAtCompany.description}</p>
            <img
              alt="life at company"
              src={lifeAtCompany.image_url}
              className="life-image"
            />
          </div>
        </li>
        <h1 className="similar-description">Similar Jobs </h1>
        <ul className="similar-jobs-container">
          {similarJobsList.map(eachItem => (
            <SimilarJobs eachSimilarJob={eachItem} key={eachItem.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstans.inProgress:
        return this.loadingView()
      case apiStatusConstans.success:
        return this.successView()
      case apiStatusConstans.failure:
        return this.failureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-container">
        <Header />
        <div className="job-details">{this.renderJobDetails()}</div>
      </div>
    )
  }
}

export default JobItemDetails
