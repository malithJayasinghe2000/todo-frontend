import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'

const ResetPassword = () => {

  const { backendUrl } = useContext(AppContext)
  axios.defaults.withCredentials = true

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSubmited, setIsOtpSubmited] = useState(false)

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  //handle keydown
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  //handle paste
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + '/api/auth//send-reset-otp', { email })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOTP = async (e) => {
    e.preventDefault()

    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmited(true)

  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100'>
      <Navbar />
      {/* email input form */}
      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 test-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>
            Reset Password
          </h1>
          <p className='text-center mb-6 text-indigo-300'>
            Enter your registered email address
          </p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <input type='email' placeholder='Email Id' className='bg-transparent outline-none text-white'
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white mt-3'>
            submit
          </button>
        </form>
      }

      {/* otp input form */}
      {!isOtpSubmited && isEmailSent &&
        <form onSubmit={onSubmitOTP} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 test-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>
            Reset Password OTP
          </h1>
          <p className='text-center mb-6 text-indigo-300'>
            Enter the 6-digit code sent to your email
          </p>
          <div className='mb-8 flex justify-between' onPaste={handlePaste}>
            {Array(6).fill().map((_, index) => (
              <input key={index} type='text' maxLength='1' required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white'>
            Submit
          </button>

        </form>
      }

      {/* enter new password */}
      {isOtpSubmited && isEmailSent &&
        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 test-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>
            New Password
          </h1>
          <p className='text-center mb-6 text-indigo-300'>
            Enter the new password below
          </p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <input type='password' placeholder='New Password' className='bg-transparent outline-none text-white'
              value={newPassword}
              minLength={8}
              pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'
              onChange={e => setNewPassword(e.target.value)} required />
          </div>
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white mt-3'>
            submit
          </button>
        </form>
      }

    </div>
  )
}

export default ResetPassword
