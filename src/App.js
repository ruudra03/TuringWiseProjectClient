import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import DashLayout from './components/dash/DashLayout'
import Welcome from './features/auth/Welcome'
import PostsList from './features/posts/PostsList'
import UsersList from './features/users/UsersList'
import NewUserForm from './features/users/NewUserForm'
import EditUser from './features/users/EditUser'
import NewPost from './features/posts/NewPost'
import EditPost from './features/posts/EditPost'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Public />} />
        <Route path='login' element={<Login />} />

        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            {/* Protected Routes */}
            {/* TODO: protect these routes */}
            <Route path='dash' element={<DashLayout />}>
              <Route index element={<Welcome />} />

              <Route path='users'>
                <Route index element={<UsersList />} />
                <Route path=':id' element={<EditUser />} />
                <Route path='new' element={<NewUserForm />} />
              </Route>

              <Route path='posts'>
                <Route index element={<PostsList />} />
                <Route path=':id' element={<EditPost />} />
                <Route path='new' element={<NewPost />} />
              </Route>

            </Route>
            {/* End Dash */}
          </Route>
        </Route>

      </Route>
    </Routes>
  )
}

export default App
