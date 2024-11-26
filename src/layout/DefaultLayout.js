import React, { useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom'

const DefaultLayout = () => {
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    // Jika token tidak ditemukan, arahkan ke halaman login
    if (!token) {
      navigate('/login')
    } else {
      setIsLoading(false) // Hentikan loading jika token ditemukan
    }
  }, [navigate])

  // Tampilkan loading sementara jika pengecekan token masih berlangsung
  if (isLoading) {
    return <div className="text-center mt-5">Memuat...</div>
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
