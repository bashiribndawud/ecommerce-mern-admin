import axios from 'axios'
import React, { useEffect } from 'react'

const Dashboard = () => {
  useEffect(() => {
    axios.get('/auth/user')
  }, [])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard