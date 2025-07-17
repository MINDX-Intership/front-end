// Navbar.jsx
import React from 'react';


function Navbar({ setCurrentPage }) {
  const handleNavLinkClick = (e, path) => {
    e.preventDefault();
    setCurrentPage(path); 
  };

  return (
    <nav style={{'display':'flex'}}>
      <a href="/" className="navbar-brand" onClick={(e) => handleNavLinkClick(e, '/profile')}>
        Tên Trang Web
      </a>
      <ul style={{'display':'flex'}}>
        <li className="nav-item">
          <a href="/profile" className="nav-link" onClick={(e) => handleNavLinkClick(e, '/profile')}>
            Profile
          </a>
        </li>
        <li className="nav-item">
          <a href="/login" className="nav-link" onClick={(e) => handleNavLinkClick(e, '/login')}>
            Đăng nhập
          </a>
        </li>
        <li className="nav-item">
          <a href="/register" className="nav-link" onClick={(e) => handleNavLinkClick(e, '/register')}>
            Đăng ký
          </a>
        </li>
    
      </ul>
    </nav>
  );
}

export default Navbar;