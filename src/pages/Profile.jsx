import React, { use, useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import UserForm from '../components/UserForm.jsx'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ChangePassword from './ChangePassword'

const Profile = () => {
  const { userData, isLoggedin } = useContext(AppContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (!isLoggedin) {
      navigate('/')
    }
  }
    , [isLoggedin, navigate])


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-b from-blue-500 to-indigo-400 text-white pt-16 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <Navbar />

          <div className="flex items-center justify-between mb-6 mt-10">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-blue-100 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Dashboard
            </button>

            <h1 className="text-2xl font-bold text-white">My Account</h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="bg-gradient-to-br from-blue-400 to-indigo-400 w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
              {userData?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{userData?.name}</h2>
              <p className="text-blue-100">{userData?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 -mt-10">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 px-6 font-medium ${activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('change-password')}
              className={`flex-1 py-4 px-6 font-medium ${activeTab === 'change-password'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Security Settings
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && <UserForm />}
            {activeTab === 'change-password' && <ChangePassword />}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile
