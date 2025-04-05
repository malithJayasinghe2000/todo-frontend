import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'

const Dashboard = () => {
    axios.defaults.withCredentials = true
    const { backendUrl, isLoggedin, getUserData, userData, setUserData, setIsLoggedin } = useContext(AppContext)
    const navigate = useNavigate()

    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedTask, setSelectedTask] = useState(null)
    const [showTaskForm, setShowTaskForm] = useState(false)

    useEffect(() => {
        if (!isLoggedin) {
            navigate('/login')
        } else {
            fetchTasks()
        }
    }, [isLoggedin, navigate])

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${backendUrl}/api/task/get`)
            if (data.success) {
                setTasks(data.tasks)
            } else {
                toast.error(data.message || 'Failed to fetch tasks')
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateTask = async (taskData) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/task/create`, taskData)
            if (data.success) {
                toast.success(data.message)
                fetchTasks()
                setShowTaskForm(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleUpdateTask = async (taskData) => {
        try {
            const { data } = await axios.put(`${backendUrl}/api/task/update`, {
                ...taskData,
                taskId: selectedTask._id
            })
            if (data.success) {
                toast.success(data.message)
                fetchTasks()
                setSelectedTask(null)
                setShowTaskForm(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDeleteTask = async (taskId) => {

        try {
            const { data } = await axios.delete(`${backendUrl}/api/task/delete`, {
                data: { taskId }
            })
            if (data.success) {
                toast.success(data.message)
                fetchTasks()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const openEditForm = (task) => {
        setSelectedTask(task)
        setShowTaskForm(true)
    }

    const handleDoneTask = async (taskId) => {
        try {
            const { data } = await axios.put(backendUrl + '/api/task/done', {
                taskId
            })
            if (data.success) {
                toast.success(data.message)
                fetchTasks()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100'>
            <Navbar />

            <main className='container mx-auto px-4 py-6 flex-grow mt-20'>
                {/* Dashboard Header */}
                <div className='mb-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-800 mb-1'>
                                Welcome, {userData?.name || 'User'}
                            </h1>
                            <p className='text-gray-600'>
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className='mt-4 md:mt-0'>
                            <button
                                onClick={() => { setSelectedTask(null); setShowTaskForm(true) }}
                                className='bg-gradient-to-r from-blue-600 to-indigo-700 font-medium text-white py-2.5 px-5 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md flex items-center gap-2'
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                Add New
                            </button>
                        </div>
                    </div>

                    {/* Task Summary */}
                    {!loading && (
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6'>
                            <div className='bg-white/90 rounded-lg shadow-sm p-4 border-l-4 border-blue-500'>
                                <p className='text-sm text-gray-500'>Total Tasks</p>
                                <p className='text-2xl font-bold'>{tasks.length}</p>
                            </div>
                            <div className='bg-white/90 rounded-lg shadow-sm p-4 border-l-4 border-green-500'>
                                <p className='text-sm text-gray-500'>Completed</p>
                                <p className='text-2xl font-bold'>{tasks.filter(task => task.completed).length}</p>
                            </div>
                            <div className='bg-white/90 rounded-lg shadow-sm p-4 border-l-4 border-yellow-500'>
                                <p className='text-sm text-gray-500'>Today's Tasks</p>
                                <p className='text-2xl font-bold'>
                                    {tasks.filter(task => {
                                        const today = new Date();
                                        const taskDate = new Date(task.dueDate);
                                        return taskDate.toDateString() === today.toDateString();
                                    }).length}
                                </p>
                            </div>
                            <div className='bg-white/90 rounded-lg shadow-sm p-4 border-l-4 border-red-500'>
                                <p className='text-sm text-gray-500'>Overdue</p>
                                <p className='text-2xl font-bold'>
                                    {tasks.filter(task => {
                                        const now = new Date();
                                        const taskDate = new Date(task.dueDate);
                                        return taskDate < now && !task.completed;
                                    }).length}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tasks List */}
                <div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6'>
                    <h2 className='text-xl font-bold mb-6 text-gray-800 flex items-center gap-2'>
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                        Your Tasks
                    </h2>

                    {loading ? (
                        <div className='flex flex-col items-center justify-center py-12'>
                            <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-4'></div>
                            <p className='text-gray-600'>Loading your tasks...</p>
                        </div>
                    ) : (
                        <TaskList
                            tasks={tasks}
                            onEdit={openEditForm}
                            onDelete={handleDeleteTask}
                            onDone={handleDoneTask}
                        />
                    )}
                </div>

                {/* Task Form Modal */}
                {showTaskForm && (
                    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50'>
                        <div className='bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto'>
                            <div className='flex justify-between items-center mb-4 pb-2 border-b border-gray-200'>
                                <h2 className='text-xl font-bold text-gray-800'>
                                    {selectedTask ? 'Edit Task' : 'Create New Task'}
                                </h2>
                                <button
                                    onClick={() => { setShowTaskForm(false); setSelectedTask(null) }}
                                    className='text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-full p-1 transition-colors'
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <TaskForm
                                onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
                                initialData={selectedTask}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Dashboard
