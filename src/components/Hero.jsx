import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()
  const {userData} = useContext(AppContext)
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl sm:text-5xl font-bold mb-3 text-gray-800'>
          Hello <span className='text-blue-600'>{userData ? userData.name : 'Guest'}</span>!
        </h1>
        
        <h2 className='text-2xl sm:text-4xl font-bold mb-6 text-gray-800 text-center md:text-center'>
          Welcome to Your Personal Task Manager
        </h2>
        
        <p className='mb-8 text-lg text-gray-600 max-w-xl mx-auto leading-relaxed text-center md:text-center'>
          Stay organized, meet deadlines, and achieve your goals with our simple todo application.
        </p>
        
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button 
            onClick={() => navigate('/dashboard')} 
            className='px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Get Started
          </button>
    </div>
        
    </div>
  )
}

export default Hero
