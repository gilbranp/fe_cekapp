/* eslint-disable prettier/prettier */
// src/redux/authReducer.js
const initialState = {
    isLoggedIn: false,  // Default-nya false
    user: null,         // Info pengguna
  }
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          isLoggedIn: true,   // Set isLoggedIn menjadi true saat login sukses
          user: action.payload,
        }
      case 'LOGOUT':
        return {
          ...state,
          isLoggedIn: false,  // Set isLoggedIn menjadi false saat logout
          user: null,
        }
      default:
        return state
    }
  }
  
  export default authReducer
  