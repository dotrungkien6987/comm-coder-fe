import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/HomePage'
import AcountPage from '../pages/AcountPage'
import UserProfilePage from '../pages/UserProfilePage'
import BlankLayout from '../layouts/BlankLayout'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import NotFoundPage from '../pages/NotFoundPage'
import AuthRequire from './AuthRequire'

function Router() {
  return (
    <div>
      <Routes>
        <Route path ="/" element ={<AuthRequire><MainLayout/></AuthRequire>}>
        {/* <Route path ="/" element ={<><MainLayout/></>}> */}
          <Route index element={<HomePage/>}/>
          <Route path='/account' element={<AcountPage/>} />
          <Route path='user/:userId' element={<UserProfilePage/>} />
        </Route>

          
        <Route element ={ <BlankLayout/>  }>
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/register' element={<RegisterPage/>} />
          <Route path='*' element={<NotFoundPage/>} />
        </Route>

      </Routes>
    </div>
  )
}

export default Router