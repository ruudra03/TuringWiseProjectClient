// TODO: re-evaulate require auth logic as needed
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
import PublicArticle from './components/public/PublicArticle'
import PublicResearch from './components/public/PublicResearch'
import PublicArticlesList from './components/public/PublicArticlesList'
import PublicResearchesList from './components/public/PublicResearchesList'
import Article from './features/articles/Article'
import NewArticle from './features/articles/NewArticle'
import EditArticle from './features/articles/EditArticle'
import ArticlesList from './features/articles/ArticlesList'
import Research from './features/researches/Research'
import ResearchesList from './features/researches/ResearchesList'
import NewResearch from './features/researches/NewResearch'
import OrgCard from './features/orgCard/OrgCard'
import NewOrgCard from './features/orgCard/NewOrgCard'
import OrgCardsList from './features/orgCard/OrgCardsList'

function App() {
  useTitle('TuringWise Project')
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Public />} />
        <Route path='publicArticles' element={<PublicArticlesList />} >
          <Route path=':id' element={<PublicArticle />} />
        </Route>
        <Route path='publicResearches' element={<PublicResearchesList />} >
          <Route path=':id' element={<PublicResearch />} />
        </Route>
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

                <Route path='articles'>
                  <Route index element={<ArticlesList />} />
                  <Route path=':id' element={<Article />} >
                    <Route path='edit' element={<EditArticle />} />
                  </Route>
                  <Route path='new' element={<NewArticle />} />
                </Route>

                <Route path='researches'>
                  <Route index element={<ResearchesList />} />
                  <Route path=':id' element={<Research />} />
                  <Route element={<RequireAuth allowedRoles={[ROLES.OrganisationUser, ROLES.OrganisationAdmin, ROLES.Admin]} />}>
                    <Route path='new' element={<NewResearch />} />
                  </Route>
                </Route>

                <Route element={<RequireAuth allowedRoles={[ROLES.OrganisationAdmin, ROLES.Admin]} />}>
                  <Route path='orgCards'>
                    <Route index element={<OrgCardsList />} />
                    <Route path=':id' element={<OrgCard />} />
                    <Route path='new' element={<NewOrgCard />} />
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
