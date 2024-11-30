/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilDoor } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import avatar8 from './../../assets/images/avatars/8.jpg';

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State untuk menyimpan data pengguna

  // Ambil data user yang sedang login
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data); // Simpan data pengguna ke state
        } else {
          console.error('Failed to fetch user data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Fungsi logout
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('token'); // Hapus token dari localStorage
        navigate('/login'); // Redirect ke halaman login
      } else {
        console.error('Logout failed: ', response.status);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          {user ? user.nama : 'Loading...'}
        </CDropdownHeader>
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilDoor} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
