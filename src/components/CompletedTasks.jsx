import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const CompletedTasks = () => {

    const { backendUrl, isLoggedin, getUserData, userData, setUserData, setIsLoggedin } = useContext(AppContext)

    const navigate = useNavigate()

  return (
    <div>
      
    </div>
  )
}

export default CompletedTasks
