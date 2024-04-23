import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import DashLayout from './components/dash/DashLayout'
import Welcome from './features/auth/Welcome'
import PostsList from './features/posts/PostsList'
import UsersList from './features/users/UsersList'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Public />} />
        <Route path='login' element={<Login />} />

        {/* Protected Routes */}
        {/* TODO: protect these routes */}
        <Route path='dash' element={<DashLayout />}>
          <Route index element={<Welcome />} />

          <Route path='posts'>
            <Route index element={<PostsList />} />
          </Route>

          <Route path='users'>
            <Route index element={<UsersList />} />
          </Route>

        </Route>
        {/* End Dash */}

      </Route>
    </Routes>
  )
}

export default App
