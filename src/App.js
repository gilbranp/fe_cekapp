/* eslint-disable prettier/prettier */
import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))

// PrivateRoute
import PrivateRoute from './components/PrivateRoute'


import Dashboard from './views/dashboard/Dashboard'


const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)

    if (theme) {
      setColorMode(theme[0])
    } else if (!isColorModeSet() && storedTheme) {
      setColorMode(storedTheme)
    }
  }, [isColorModeSet, setColorMode, storedTheme])

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
        {/* <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} /> */}
        {/* <Route path="/barang" element={<PrivateRoute element={Barang} />} /> */}
          <Route exact path="/login" name="Login Page" element={<Login />} />
          {/* <Route exact path="/dashboard" name="Register Page" element={<Dashboard />} /> */}
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
