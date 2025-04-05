import React, { useState } from 'react'
import TaskItem from './TaskItem'

const TaskList = ({ tasks, onEdit, onDelete, onDone }) => {
  const [sortOption, setSortOption] = useState('default')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    startTime: '00:00',
    endTime: '23:59'
  })

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      startTime: '00:00',
      endTime: '23:59'
    })
  }

  if (tasks.length === 0) {
    return (
      <div className='bg-white/80 rounded-lg shadow p-6 text-center'>
        <p className='text-gray-600'>No tasks found. Create a new task to get started.</p>
      </div>
    )
  }

  // Apply date/time filtering
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate)
    let passesFilter = true

    // Filter by start date
    if (filters.startDate) {
      const startDateTime = new Date(`${filters.startDate}T00:00:00`)
      if (taskDate < startDateTime) {
        passesFilter = false
      }
    }

    // Filter by end date
    if (filters.endDate && passesFilter) {
      const endDateTime = new Date(`${filters.endDate}T23:59:59`)
      if (taskDate > endDateTime) {
        passesFilter = false
      }
    }

    // Filter by start time
    if (passesFilter && filters.startTime) {
      const [startHours, startMinutes] = filters.startTime.split(':').map(Number)
      const taskHours = taskDate.getHours()
      const taskMinutes = taskDate.getMinutes()

      // Convert to minutes for easier comparison
      const startTimeInMinutes = startHours * 60 + startMinutes
      const taskTimeInMinutes = taskHours * 60 + taskMinutes

      if (taskTimeInMinutes < startTimeInMinutes) {
        passesFilter = false
      }
    }

    // Filter by end time
    if (passesFilter && filters.endTime) {
      const [endHours, endMinutes] = filters.endTime.split(':').map(Number)
      const taskHours = taskDate.getHours()
      const taskMinutes = taskDate.getMinutes()

      // Convert to minutes for easier comparison
      const endTimeInMinutes = endHours * 60 + endMinutes
      const taskTimeInMinutes = taskHours * 60 + taskMinutes

      if (taskTimeInMinutes > endTimeInMinutes) {
        passesFilter = false
      }
    }

    return passesFilter
  })

  // Identify today's date (without time)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Group tasks by day
  const todayTasks = []
  const upcomingTasks = []
  const overdueTasks = []

  filteredTasks.forEach(task => {
    const taskDate = new Date(task.dueDate)
    const taskDay = new Date(taskDate)
    taskDay.setHours(0, 0, 0, 0)

    const now = new Date()

    // Check if task is due today
    if (taskDay.getTime() === today.getTime()) {
      task.isToday = true
      todayTasks.push(task)
    }
    // Check if task is overdue
    else if (taskDate < now && !task.completed) {
      task.isOverdue = true
      overdueTasks.push(task)
    }
    // Otherwise it's an upcoming task
    else {
      task.isUpcoming = true
      upcomingTasks.push(task)
    }
  })

  // Sort tasks based on selected option
  const sortTasks = (tasksToSort) => {
    switch (sortOption) {
      case 'date-asc':
        return [...tasksToSort].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      case 'date-desc':
        return [...tasksToSort].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
      case 'time-asc':
        return [...tasksToSort].sort((a, b) => {
          const timeA = new Date(a.dueDate).getHours() * 60 + new Date(a.dueDate).getMinutes()
          const timeB = new Date(b.dueDate).getHours() * 60 + new Date(b.dueDate).getMinutes()
          return timeA - timeB
        })
      case 'time-desc':
        return [...tasksToSort].sort((a, b) => {
          const timeA = new Date(a.dueDate).getHours() * 60 + new Date(a.dueDate).getMinutes()
          const timeB = new Date(b.dueDate).getHours() * 60 + new Date(b.dueDate).getMinutes()
          return timeB - timeA
        })
      default:
        // Default sorting: chronologically for each category
        return [...tasksToSort].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    }
  }

  const sortedToday = sortTasks(todayTasks)
  const sortedUpcoming = sortTasks(upcomingTasks)
  const sortedOverdue = sortTasks(overdueTasks)

  // Check if any filters are active
  const isFilterActive = filters.startDate || filters.endDate ||
    filters.startTime !== '00:00' || filters.endTime !== '23:59'

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-3 py-2 ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'} hover:bg-blue-100 hover:text-blue-700 rounded-md transition-all shadow-sm`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {isFilterActive && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-sm transition-all flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Clear Filters
            </button>
          )}

          <div className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md">
            {filteredTasks.length} task{filteredTasks.length !== 1 && 's'}
            {isFilterActive ? ' match filters' : ' total'}
          </div>
        </div>

        <select
          className="px-3 py-2 rounded-md bg-white border border-gray-300 shadow-sm text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="default">Default Sorting</option>
          <option value="date-asc">Date (Earliest First)</option>
          <option value="date-desc">Date (Latest First)</option>
        </select>
      </div>

      {showFilters && (
        <div className="bg-white p-5 rounded-lg shadow-md mb-6 border border-gray-100">
          <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            Filter Tasks
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Date Range</label>
              <div className="flex gap-2 items-center">
                <div className="w-1/2">
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-md p-2 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-md p-2 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Time Range</label>
              <div className="flex gap-2 items-center">
                <div className="w-1/2">
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="time"
                    name="startTime"
                    value={filters.startTime}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-md p-2 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="time"
                    name="endTime"
                    value={filters.endTime}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-md p-2 text-sm w-full focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p className="text-gray-600 mb-2">No tasks match the selected filters.</p>
          {isFilterActive && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear filters to see all tasks
            </button>
          )}
        </div>
      ) : (
        <>
          {sortedToday.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-1.5 px-4 rounded-md inline-flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Today's Tasks ({sortedToday.length})
                </span>
              </h3>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
                {sortedToday.map(task => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onEdit={() => onEdit(task)}
                    onDelete={() => onDelete(task._id)}
                    onDone={() => onDone(task._id)}
                    isToday={true}
                  />
                ))}
              </div>
            </div>
          )}

          {sortedUpcoming.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Upcoming Tasks ({sortedUpcoming.length})
              </h3>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
                {sortedUpcoming.map(task => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onEdit={() => onEdit(task)}
                    onDelete={() => onDelete(task._id)}
                    onDone={() => onDone(task._id)}
                  />
                ))}
              </div>
            </div>
          )}

          {sortedOverdue.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Overdue Tasks ({sortedOverdue.length})
              </h3>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
                {sortedOverdue.map(task => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onEdit={() => onEdit(task)}
                    onDelete={() => onDelete(task._id)}
                    onDone={() => onDone(task._id)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TaskList
