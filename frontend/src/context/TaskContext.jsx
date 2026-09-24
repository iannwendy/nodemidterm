import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { tasksAPI } from '../api'

const TaskContext = createContext()

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  stats: {
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0
  }
}

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false, error: null }
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t)
      }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    default:
      return state
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  const fetchTasks = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await tasksAPI.getAll()
      dispatch({ type: 'SET_TASKS', payload: res.data.data || res.data })
      calculateStats(res.data.data || res.data)
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
    }
  }

  const calculateStats = (tasks) => {
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length
    }
    dispatch({ type: 'SET_STATS', payload: stats })
  }

  const addTask = async (taskData) => {
    try {
      const res = await tasksAPI.create(taskData)
      dispatch({ type: 'ADD_TASK', payload: res.data })
      fetchTasks()
      return res.data
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
      throw err
    }
  }

  const updateTask = async (id, taskData) => {
    try {
      const res = await tasksAPI.update(id, taskData)
      dispatch({ type: 'UPDATE_TASK', payload: res.data })
      fetchTasks()
      return res.data
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
      throw err
    }
  }

  const deleteTask = async (id) => {
    try {
      await tasksAPI.delete(id)
      dispatch({ type: 'DELETE_TASK', payload: id })
      fetchTasks()
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
      throw err
    }
  }

  const refreshTasks = () => fetchTasks()

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <TaskContext.Provider value={{
      ...state,
      addTask,
      updateTask,
      deleteTask,
      refreshTasks,
      fetchTasks
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider')
  }
  return context
}
