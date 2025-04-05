import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'

const Login = () => {
    const navigate = useNavigate()

    const { backendUrl, setIsLoggedin, getUserData,isLoggedin } = useContext(AppContext)

    const [state, setState] = useState('Login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    // useEffect(() => {
    //     if(isLoggedin){
    //         navigate('/dashboard')
    //     }
    // }, [isLoggedin, navigate])

    const onSubmitHandler = async (e) => {

        try {
            e.preventDefault()  //when press the submit button prevent the website from refreshing

            axios.defaults.withCredentials = true //send the cookies with below request

            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/auth/register', {
                    name, email, password
                })
                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate('/dashboard')
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/auth/login', {
                    email, password
                })
                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate('/dashboard')
                } else {
                    toast.error(data.message)
                }
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100 '>
            <Navbar />
            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create account' : 'Login'}</h2>
                <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

                <form onSubmit={onSubmitHandler}>
                    {state === 'Sign Up' && (
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] '>
                            <input
                                onChange={e => setName(e.target.value)}
                                value={name}
                                className='bg-transparent outline-none' type='text' placeholder='Full Name' />
                        </div>
                    )}

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] '>
                        <input
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            className='bg-transparent outline-none' type='email' placeholder='Email' />
                    </div>

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <input
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            minLength={8}
                            pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'
                            className='bg-transparent outline-none w-full'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password' />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)} 
                            className="text-indigo-300 hover:text-white focus:outline-none"
                        >
                            {showPassword ? 
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                </svg> : 
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                            }
                        </button>
                    </div>

                    <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>
                        Forgot Password
                    </p>

                    <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{state}</button>
                    {state === 'Sign Up' ? (
                        <p className='text-gray-400 text-center text-xs mt-4'>
                            Already have an account?{' '}
                            <span onClick={() => setState('Login')} className='text-blue-400 cursor-pointer underline'>Login here</span>
                        </p>
                    ) : (
                        <p className='text-gray-400 text-center text-xs mt-4'>
                            Don't have an account?{' '}
                            <span onClick={() => setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign up</span>
                        </p>
                    )}


                </form>
            </div>
        </div>
    )
}

export default Login
