// Navbar.jsx
import React from 'react';


function Navbar({ setCurrentPage }) {
  const handleNavLinkClick = (e, path) => {
    e.preventDefault();
    setCurrentPage(path); 
  };

  return (
    <nav style={{'display':'flex'}}>

      <ul style={{'display':'flex'}}>
        <li>
          <a href="/profile" style={{'margin':'20px'}} onClick={(e) => handleNavLinkClick(e, '/profile')}>
            Profile
          </a>
        </li>
        <li>
          <a href="/login" style={{'margin':'20px'}} onClick={(e) => handleNavLinkClick(e, '/login')}>
            Đăng nhập
          </a>
        </li>
        <li>
          <a href="/register" style={{'margin':'20px'}} onClick={(e) => handleNavLinkClick(e, '/register')}>
            Đăng ký
          </a>
        </li>
    
      </ul>
    </nav>
  );
}

export default Navbar;