import React, { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Ref for user menu dropdown to handle outside clicks
    const userMenuRef = useRef(null)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Handle outside clicks for user menu
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)
        return () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [])

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/auth/logout')
            if (data.success) {
                setIsLoggedin(false)
                setUserData(false)
                navigate('/')
                toast.success("Logged out successfully")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    return (
        <nav className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 shadow-md py-2'
                : 'bg-white/80 backdrop-blur-sm py-3'
            }`}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16'>
                    {/* Logo */}
                    <div className='flex-shrink-0'>
                        <button
                            onClick={() => navigate('/')}
                            className='text-xl font-bold text-gray-800 tracking-tight hover:text-blue-600 transition-colors'
                        >
                            <span className='text-blue-600'>TODO</span>App
                        </button>
                    </div>

                    {/* User Menu/Login Button */}
                    <div className='flex items-center'>
                        {userData ? (
                            <div className='relative ml-3' ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className='flex items-center gap-2 py-1.5 px-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 text-gray-800 transition-all shadow-sm'
                                    aria-expanded={userMenuOpen}
                                    aria-haspopup="true"
                                >
                                    <div className='w-8 h-8 flex justify-center items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-medium shadow-sm'>
                                        {userData.name[0].toUpperCase()}
                                    </div>
                                    <span className="hidden md:inline font-medium">{userData.name.split(' ')[0]}</span>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>

                                {userMenuOpen && (
                                    <div className='absolute top-full right-0 z-10 mt-2 origin-top-right transition-all duration-200 ease-in-out'>
                                        <div className='py-1 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 min-w-48 border border-gray-100'>
                                            <div className='px-4 py-2 text-sm text-gray-500 border-b border-gray-100'>
                                                <p className='font-medium text-gray-700'>{userData.name}</p>
                                                <p className='text-xs text-gray-500 truncate'>{userData.email}</p>
                                            </div>
                                            <ul className='list-none m-0 py-1'>
                                                <li onClick={() => {
                                                    navigate('/dashboard')
                                                    setUserMenuOpen(false)
                                                }} className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex items-center'>
                                                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                                    Dashboard
                                                </li>
                                                <li onClick={() => {
                                                    navigate('/profile')
                                                    setUserMenuOpen(false)
                                                }} className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex items-center'>
                                                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                    Profile
                                                </li>
                                                {/* <li onClick={() => {
                                                    navigate('/change-password')
                                                    setUserMenuOpen(false)
                                                }} className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex items-center'>
                                                    <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                                                    Change Password
                                                </li> */}
                                                <li onClick={() => {
                                                    logout()
                                                    setUserMenuOpen(false)
                                                }} className='px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center'>
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                    Logout
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className='flex space-x-2'>
                                <button
                                    onClick={() => navigate('/login')}
                                    className='flex items-center gap-2 py-1.5 px-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-lg text-blue-600 transition-all shadow-sm font-medium'
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Login
                                </button>
                                
                            </div>
                        )}
                    </div>
                </div>


            </div>
        </nav>
    )
}

export default Navbar
