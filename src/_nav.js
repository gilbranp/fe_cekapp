import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilCalendar,
  cilCash,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDoor,
  cilHome,
  cilInbox,
  cilNotes,
  cilPeople,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilWatch,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Utama',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'FITUR',
  },
  {
    component: CNavItem,
    name: 'Tugas Rumah',
    to: '/tugas',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Barang',
    to: '/barang',
    icon: <CIcon icon={cilInbox} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Keuangan',
    to: '/keuangan',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Anggota',
    to: '/anggota',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Jadwal',
    to: '/jadwal',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'SMART HOME',
  },
  {
    component: CNavItem,
    name: 'Coming Soon',
    to: '$',
    icon: <CIcon icon={cilWatch} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Coming Soon',
    to: '/login',
    icon: <CIcon icon={cilDoor} customClassName="nav-icon" />,
  },
]

export default _nav
