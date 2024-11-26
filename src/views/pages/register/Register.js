import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilLockLocked } from '@coreui/icons'

const Register = () => {
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    password: '',
    role: 'Administrator',
    nama_keluarga: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Redirect jika token ditemukan
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard') // Redirect ke dashboard jika sudah login
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validasi input lokal (pastikan semua field diisi)
    for (const field in formData) {
      if (!formData[field]) {
        setError(`Field ${field} harus diisi.`)
        setLoading(false)
        return
      }
    }

    try {
      const response = await axios.post('http://localhost:8000/api/register', formData)
      if (response.status === 201) {
        alert('Registrasi berhasil!')
        navigate('/login')
      }
    } catch (err) {
      setError(err.response?.data.message || 'Terjadi kesalahan saat registrasi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} sm={10} md={8} lg={7} xl={6}>
            <CCard className="w-100 mx-auto" style={{ maxWidth: '100%' }}>
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Daftar</h1>
                  <p>Buat akun sesuai data Anda</p>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput name="nama" value={formData.nama} onChange={handleChange} placeholder="Nama" required />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                    <CFormInput type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Kata Sandi" required />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CFormSelect name="role" value={formData.role} onChange={handleChange} required>
                      <option value="Orangtua">Orangtua</option>
                      <option value="Anak">Anak</option>
                    </CFormSelect>
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput name="nama_keluarga" value={formData.nama_keluarga} onChange={handleChange} placeholder="Nama Keluarga" required />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton type="submit" color="success">{loading ? 'Loading...' : 'Buat Akun'}</CButton>
                  </div>
                </CForm>
                <hr />
                <div className="text-center">
                  <p>Sudah punya akun? <a href="#/login" onClick={() => navigate('/login')} style={{ color: '#0d6efd', textDecoration: 'none' }}>Login</a></p>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
