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
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import useTitle from './hooks/useTitle'
import Signup from './features/auth/Signup'

function App() {
  useTitle('TuringWise Project')
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Public />} />
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>

              {/* Start Dash */}
              <Route path='dash' element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route path='users'>
                  <Route index element={<UsersList />} />
                  <Route element={<RequireAuth allowedRoles={[ROLES.OrganisationAdmin, ROLES.Admin]} />}>
                    <Route path=':id' element={<EditUser />} />
                    <Route path='new' element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route element={<RequireAuth allowedRoles={[ROLES.OrganisationUser, ROLES.OrganisationAdmin, ROLES.Admin]} />}>
                  <Route path='posts'>
                    <Route index element={<PostsList />} />
                    <Route path=':id' element={<EditPost />} />
                    <Route path='new' element={<NewPost />} />
                  </Route>
                </Route>

              </Route>
              {/* End Dash */}
            </Route>
          </Route>
        </Route>
        {/* End of protected routes */}

      </Route>
    </Routes>
  )
}

export default App
