import React from 'react'

const TaskItem = ({ task, onEdit, onDelete, isToday, onDone }) => {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    // Format the date part
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const dateFormatted = date.toLocaleDateString(undefined, options);

    // Format the time part
    const timeFormatted = date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return { dateFormatted, timeFormatted };
  }

  // Check if task is overdue
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < now && !task.completed;
  const isCompleted = task.completed;

  const getTimeRemaining = () => {
    if (isOverdue) {
      const diffMs = now - dueDate;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} overdue`;
      }

      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} overdue`;
      }

      return 'Overdue';
    } else {
      const diffMs = dueDate - now;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
      }

      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      if (diffHours > 0) {
        return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
      }

      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    }
  };

  const { dateFormatted, timeFormatted } = formatDateTime(task.dueDate);
  const timeRemaining = getTimeRemaining();

  // Determine card styling based on task status
  let cardStyle = 'bg-white';
  let borderStyle = '';
  let statusColor = '';

  if (isToday) {
    cardStyle = 'bg-gradient-to-br from-blue-50 to-blue-100';
    borderStyle = 'border-l-4 border-blue-500';
    statusColor = 'bg-blue-100 text-blue-800';
  } else if (isOverdue) {
    borderStyle = 'border-l-4 border-red-500';
    cardStyle = 'bg-red-50';
    statusColor = 'bg-red-100 text-red-800';
  } else if (isCompleted) {
    cardStyle = 'bg-green-50';
    borderStyle = 'border-l-4 border-green-500';
    statusColor = 'bg-green-100 text-green-800';
  }

  return (
    <div className={`rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 ${cardStyle}`}>
      <div className={`p-5 ${borderStyle}`}>
        {/* Task Header */}
        <div className='flex justify-between items-start mb-3'>
          <h3 className='font-medium text-lg text-gray-800 break-words pr-2 flex-grow'>
            {task.title}

            {isCompleted && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Completed
              </span>
            )}
          </h3>

          <div className='flex items-center gap-1 flex-shrink-0'>
            {!task.completed && (
              <button
                onClick={onDone}
                className="p-1.5 rounded-full text-gray-400 hover:bg-green-100 hover:text-green-700 transition-colors"
                title="Mark as complete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </button>
            )}


            <button
              onClick={onEdit}
              className='p-1.5 rounded-full text-gray-400 hover:bg-blue-100 hover:text-blue-700 transition-colors'
              title="Edit task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>

            <button
              onClick={onDelete}
              className='p-1.5 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-700 transition-colors'
              title="Delete task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Task Description */}
        <div className="mb-4">
          <p className={`text-gray-600 break-words ${isCompleted ? 'line-through text-gray-400' : ''}`}>
            {task.description || "No description provided"}
          </p>
        </div>

        {/* Task Footer */}
        <div className='flex flex-col gap-1.5 mt-4 pt-3 border-t border-gray-200'>
          {/* Due Date */}
          <div className={`text-sm flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>
              Due: {dateFormatted} at {timeFormatted}
              {isToday && !isOverdue && !isCompleted && (
                <span className='ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full'>Today</span>
              )}
            </span>
          </div>

          {/* Time Remaining */}
          <div className={`text-sm flex items-center gap-1.5 ${isCompleted ? 'text-green-600' : isOverdue ? 'text-red-600' : 'text-blue-600'
            } font-medium`}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>
              {isCompleted ? 'Completed' : timeRemaining}
              {isOverdue && !isCompleted && (
                <span className='ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded'>Overdue</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskItem
