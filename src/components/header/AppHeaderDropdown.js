import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDoor } from '@coreui/icons'
import { useNavigate } from 'react-router-dom' // Untuk melakukan navigasi
import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // Panggil endpoint logout di backend
      const response = await fetch('https://localhost/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Mengirim token autentikasi
        },
      })

      if (response.ok) {
        // Hapus token dari localStorage (atau sessionStorage)
        localStorage.removeItem('authToken')

        // Redirect ke halaman login
        navigate('/login')
      } else {
        console.error('Logout failed: ', response.statusText)
      }
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilDoor} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
