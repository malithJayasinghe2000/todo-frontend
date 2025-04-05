import React, { useState, useEffect } from 'react'

const TaskForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '12:00',
  })
  
  useEffect(() => {
    if (initialData) {
      // Parse the date and time from dueDate if exists
      let formattedDate = '';
      let formattedTime = '12:00';
      
      if (initialData.dueDate) {
        const dueDateTime = new Date(initialData.dueDate);
        formattedDate = dueDateTime.toISOString().split('T')[0];
        
        // Format time as HH:MM
        const hours = dueDateTime.getHours().toString().padStart(2, '0');
        const minutes = dueDateTime.getMinutes().toString().padStart(2, '0');
        formattedTime = `${hours}:${minutes}`;
      }
      
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        dueDate: formattedDate,
        dueTime: formattedTime,
      })
    }
  }, [initialData])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Combine date and time into a single date object
    const combinedDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
    
    onSubmit({
      title: formData.title,
      description: formData.description,
      dueDate: combinedDateTime.toISOString(),
      
    })
  }
  
  return (
    <form onSubmit={handleSubmit} className=''>
      <div className='mb-4'>
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          Title
        </label>
        <input
          type='text'
          name='title'
          value={formData.title}
          onChange={handleChange}
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          placeholder='Task title'
          required
        />
      </div>
      
      <div className='mb-4'>
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          Description
        </label>
        <textarea
          name='description'
          value={formData.description}
          onChange={handleChange}
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          placeholder='Task description'
          rows='3'
          required
        ></textarea>
      </div>
      
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex-1 mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Due Date
          </label>
          <input
            type='date'
            name='dueDate'
            value={formData.dueDate}
            onChange={handleChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        
        <div className='flex-1 mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Time
          </label>
          <input
            type='time'
            name='dueTime'
            value={formData.dueTime}
            onChange={handleChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
      </div>
      
      <div className='flex justify-end'>
        <button
          type='submit'
          className='bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
