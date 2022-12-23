import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp, IoBagRemoveSharp} from 'react-icons/io5'
import Header from '../Header'

import './index.css'

const status = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profile: {},
    jobsList: [],
    jobsApiStatus: status.loading,
    employmentInput: '',
    salaryInput: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getUserProfile()
    this.getJobDetails()
  }

  getEmploymentType = event => {
    this.setState({employmentInput: event.target.value}, this.getJobDetails)
  }

  getSalaryRange = event => {
    this.setState({salaryInput: event.target.value}, this.getJobDetails)
  }

  getSearchInputDetails = event => {
    this.setState({searchInput: event.target.value}, this.getJobDetails)
  }

  searchResults = () => {
    this.getJobDetails()
  }

  getNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        className="no-jobs"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-paragraph">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  getJobDetails = async () => {
    const {searchInput, employmentInput, salaryInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentInput}&minimum_package=${salaryInput}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const fetchedResults = data.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({jobsList: fetchedResults, jobsApiStatus: status.success})
    } else {
      this.setState({jobsApiStatus: status.failure})
    }
  }

  getUserProfile = async () => {
    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    const updatedData = data.profile_details
    this.setState({profile: updatedData})
  }

  renderJobs = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case status.loading:
        return this.renderLoadingView()
      case status.success:
        return this.getJobsList()

      case status.failure:
        return this.getFailureView()
      default:
        return null
    }
  }

  getJobsList = () => {
    const {jobsList} = this.state
    return (
      <div>
        {jobsList.length !== 0 ? (
          <ul className="job-item-details-container">
            {jobsList.map(eachJobList => (
              <li className="job-item-details-list">
                <Link to={`/jobs/${eachJobList.id}`} className="link">
                  <div className="image-container">
                    <img
                      src={eachJobList.companyLogoUrl}
                      alt={eachJobList.title}
                      className="company-logo"
                    />
                    <div>
                      <h1 className="title">{eachJobList.title}</h1>
                      <div className="rating-container">
                        <AiFillStar className="star" />
                        <p className="rating">{eachJobList.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="package-container">
                    <div className="container">
                      <div className="location-container">
                        <IoLocationSharp className="location" />
                        <p className="rating">{eachJobList.location}</p>
                      </div>
                      <div className="location-container">
                        <IoBagRemoveSharp className="location" />
                        <p className="rating">{eachJobList.employmentType}</p>
                      </div>
                    </div>
                    <p className="package">{eachJobList.packagePerAnnum}</p>
                  </div>
                  <hr className="line" />
                  <h1 className="title">Description</h1>
                  <p className="description1">{eachJobList.jobDescription}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          this.getNoJobsView()
        )}
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-image"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-button"
        onClick={this.onClickRetryJobsButton}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  render() {
    const {profile} = this.state
    return (
      <div className="jobs-container">
        <Header />
        <div className="main-container">
          <div className="container2">
            <div className="profile-container">
              <img
                src={profile.profile_image_url}
                alt={profile.name}
                className="profile-image"
              />
              <h1 className="profile-heading">{profile.name}</h1>
              <p className="profile-paragraph">{profile.short_bio}</p>
            </div>
            <hr className="line" />
            <h1 className="employment-type-heading">Employment Type</h1>
            <ul className="employment-un-ordered-list-container ">
              {employmentTypesList.map(eachJob => (
                <li
                  key={eachJob.employmentTypeId}
                  className="employment-list-container"
                >
                  <input
                    type="checkbox"
                    id="jobType"
                    onChange={this.getEmploymentType}
                    value={eachJob.employmentTypeId}
                  />
                  <label htmlFor="jobType" className="job">
                    {eachJob.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr className="line" />
            <h1 className="employment-type-heading">Salary Range</h1>
            <ul className="employment-un-ordered-list-container ">
              {salaryRangesList.map(eachSalary => (
                <li
                  key={eachSalary.salaryRangeId}
                  className="employment-list-container"
                >
                  <input
                    type="radio"
                    id="salaryRange"
                    onChange={this.getSalaryRange}
                    value={eachSalary.salaryRangeId}
                  />
                  <label htmlFor="salaryRange" className="job">
                    {eachSalary.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div>
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                onChange={this.getSearchInputDetails}
              />
              <button
                onClick={this.searchResults}
                type="button"
                className="btn-search"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div>{this.renderJobs()}</div>
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
