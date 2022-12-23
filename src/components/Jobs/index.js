import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp, IoBagRemoveSharp} from 'react-icons/io5'
import Header from '../Header'

import './index.css'

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
    changeEmployment: '',
    changeSalary: '',
    searchInput: '',
    jobsList: [],
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  failureJobsList = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs"
      />
    </div>
  )

  getJobs = async () => {
    const {changeEmployment, changeSalary, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${changeEmployment}&minimum_package=${changeSalary}&search=${searchInput}`

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const fetchedData = data.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({jobsList: fetchedData})
    } else {
      this.failureJobsList()
    }
  }

  getProfile = async () => {
    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    const updatedProfile = data.profile_details
    this.setState({profile: updatedProfile})
  }

  searchInputDetails = () => {
    this.getJobs()
  }

  onChangeEmploymentType = event => {
    this.setState({changeEmployment: event.target.value}, this.getJobs)
  }

  onChangeSalaryType = event => {
    this.setState({changeSalary: event.target.value}, this.getJobs)
  }

  getSearchedResults = event => {
    this.setState({searchInput: event.target.value}, this.getJobs)
  }

  render() {
    const {profile, jobsList, searchInput} = this.state

    return (
      <div className="jobs-container">
        <Header />
        <div className="main-jobs-container">
          <div className="profile-cont">
            <div className="profile-container">
              <img src={profile.profile_image_url} alt={profile.name} />
              <h1 className="profile-heading">{profile.name}</h1>
              <p className="profile-paragraph">{profile.short_bio}</p>
            </div>
            <hr className="break" />
            <h1 className="employment-heading">Type of Employment</h1>
            <ul className="unordered-list">
              {employmentTypesList.map(eachType => (
                <li key={eachType.employmentTypeId} className="list-container">
                  <input
                    type="checkbox"
                    id={eachType.employmentTypeId}
                    value={eachType.employmentTypeId}
                    onChange={this.onChangeEmploymentType}
                  />
                  <label
                    htmlFor={eachType.employmentTypeId}
                    className="employment-type"
                  >
                    {eachType.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr className="break" />
            <h1 className="employment-heading">Salary Range</h1>
            <ul className="unordered-list">
              {salaryRangesList.map(eachSalary => (
                <li key={eachSalary.salaryRangeId} className="list-container">
                  <input
                    type="radio"
                    id={eachSalary.salaryRangeId}
                    value={eachSalary.salaryRangeId}
                    onChange={this.onChangeSalaryType}
                  />
                  <label
                    htmlFor={eachSalary.salaryRangeId}
                    className="employment-type"
                  >
                    {eachSalary.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="search-container">
              <input
                type="search"
                className="search-input"
                onChange={this.getSearchedResults}
                placeholder="Search"
                value={searchInput}
              />
              <button
                onClick={this.searchInputDetails}
                type="button"
                className="btn-search"
              >
                <BsSearch className="search" />
              </button>

              <ul className="jobs-container">
                {jobsList.map(job => (
                  <li key={job.id} className="jobs-list">
                    <Link to={`/jobs/${job.id}`} className="link">
                      <div className="image-container">
                        <img
                          src={job.companyLogoUrl}
                          alt={job.title}
                          className="company-logo"
                        />
                        <div>
                          <h1 className="title">{job.title}</h1>
                          <div className="rating-container">
                            <AiFillStar className="star" />
                            <p className="rating">{job.rating}</p>
                          </div>
                        </div>
                      </div>
                      <div className="package-container">
                        <div className="container">
                          <div className="location-container">
                            <IoLocationSharp className="location" />
                            <p className="rating">{job.location}</p>
                          </div>
                          <div className="location-container">
                            <IoBagRemoveSharp className="location" />
                            <p className="rating">{job.employmentType}</p>
                          </div>
                        </div>
                        <p className="package">{job.packagePerAnnum}</p>
                      </div>
                      <hr className="line" />
                      <h1 className="title">Description</h1>
                      <p className="description1">{job.jobDescription}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
