import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://wa.me/+6282225232861" target="_blank" rel="noopener noreferrer">
          CEK
        </a>
        <span className="ms-1">&copy; 2024 Cerdas Efisiensi Keluarga.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://instagram.com/gilbran_id" target="_blank" rel="noopener noreferrer">
          Gilbran ID - Bibaku Technology
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
