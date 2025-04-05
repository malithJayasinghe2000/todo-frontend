import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'

const Home = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100'>
      <Navbar />

      <div className='container mx-auto px-4 flex flex-col md:flex-row items-center justify-between mt-14 mb-10'>
        {/* Left column with hero content */}
        <div className='md:w-1/2 mb-10 md:mb-0'>
          <Hero />
        </div>

        {/*task management image */}
        <div className='md:w-1/2 flex justify-center'>
          <div className='relative max-w-md'>
            <img
              src="https://img.freepik.com/free-vector/list-concept-illustration_114360-2498.jpg"
              alt="Task Management Illustration"
              className='w-full h-auto rounded-lg shadow-xl'
            />

            {/* Simple floating task indicators */}
            <div className='absolute -top-3 -right-3 bg-white p-2 rounded-lg shadow-md transform rotate-6'>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 rounded-full bg-green-500'></div>
                <span className='text-xs font-medium text-gray-700'>Completed</span>
              </div>
            </div>

            <div className='absolute -bottom-3 -left-3 bg-white p-2 rounded-lg shadow-md transform -rotate-6'>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 rounded-full bg-blue-500'></div>
                <span className='text-xs font-medium text-gray-700'>In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className='container mx-auto px-4 mb-16'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Feature 1 */}
          <div className='bg-white/60 backdrop-blur-sm p-6 rounded-lg shadow-sm'>
            <div className='bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-blue-600'>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>Create Tasks</h3>
            <p className='text-gray-600'>Easily create and organize your tasks with priorities</p>
          </div>

          {/* Feature 2 */}
          <div className='bg-white/60 backdrop-blur-sm p-6 rounded-lg shadow-sm'>
            <div className='bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-green-600'>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>Track Progress</h3>
            <p className='text-gray-600'>Monitor your task completion status</p>
          </div>

          {/* Feature 3 */}
          <div className='bg-white/60 backdrop-blur-sm p-6 rounded-lg shadow-sm'>
            <div className='bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-purple-600'>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>Set Deadlines</h3>
            <p className='text-gray-600'>Never miss a deadline with timely notifications</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
