import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

import Header from '../Header'
import ProjectItem from '../ProjectItem'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const constants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

const Projects = () => {
  const [categoryValue, setCategoryValue] = useState('')
  const [projectData, setProjectData] = useState([])
  const [apiStatus, setApiStatus] = useState(constants.initial)

  const getProjects = async category => {
    setApiStatus(constants.inProgress)
    console.log(category)
    const projectsApiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`
    const response = await fetch(projectsApiUrl)

    if (response.ok === true) {
      const data = await response.json()
      const {projects} = data
      const updatedData = projects.map(eachProject => ({
        id: eachProject.id,
        imageUrl: eachProject.image_url,
        name: eachProject.name,
      }))
      setApiStatus(constants.success)
      setProjectData(updatedData)
    } else {
      setApiStatus(constants.failure)
    }
  }

  useEffect(() => {
    getProjects('ALL')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeValue = event => {
    const categoryV = event.target.value
    setCategoryValue(categoryV)
    getProjects(categoryV)
  }

  const loadingView = () => (
    <div className="loading-container" data-testid="loader">
      <Loader type="ThreeDots" color="#00bfff" height={50} width={50} />
    </div>
  )

  const onClickRetry = () => {
    console.log('Retry button clicked')
    setApiStatus(constants.inProgress)
    getProjects()
  }

  const failureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={onClickRetry} className="retry-button">
        Retry
      </button>
    </div>
  )

  const renderProjectsView = () => (
    <ul className="project-list-container">
      {projectData.map(eachProject => (
        <ProjectItem key={eachProject.id} projectDetails={eachProject} />
      ))}
    </ul>
  )

  const renderView = () => {
    switch (apiStatus) {
      case constants.success:
        return renderProjectsView()
      case constants.failure:
        return failureView()
      case constants.inProgress:
        return loadingView()
      default:
        return null
    }
  }

  return (
    <div>
      <Header />
      <div className="select-container">
        <select
          className="select-input"
          onChange={onChangeValue}
          value={categoryValue}
        >
          {categoriesList.map(eachCategory => (
            <option key={eachCategory.id} value={eachCategory.id}>
              {eachCategory.displayText}
            </option>
          ))}
        </select>
      </div>
      {renderView()}
    </div>
  )
}
export default Projects
