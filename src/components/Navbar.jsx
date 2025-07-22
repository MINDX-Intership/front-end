// Navbar.jsx
import React, { useState, useEffect } from 'react';

function Navbar({ currentPage, setCurrentPage, currentUser, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.avatar-dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleNavLinkClick = (e, path) => {
    e.preventDefault();
    setCurrentPage(path);
    setShowDropdown(false); // Close dropdown on navigation
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log("Searching for:", e.target.value);
  };

  const handleAvatarClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    onLogout(); // Call the logout handler from App.jsx
    setShowDropdown(false);
  };

  const handleNotificationClick = (e) => {
    e.preventDefault();
    setCurrentPage('/notifications');
    setShowDropdown(false);
  };

  const handleChatClick = (e) => {
    e.preventDefault();
    setCurrentPage('/chat');
    setShowDropdown(false);
  };

  const baseLinkStyle = {
    color: '#333',
    textDecoration: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    fontWeight: '500',
  };

  const activeLinkStyle = {
    backgroundColor: '#e0e0e0',
    color: '#007bff',
    fontWeight: 'bold',
  };

  const renderNavLink = (path, text) => (
    <li>
      <a
        href={path}
        style={{
          ...baseLinkStyle,
          ...(currentPage === path ? activeLinkStyle : {}),
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
        onMouseLeave={(e) => e.target.style.backgroundColor = (currentPage === path ? '#e0e0e0' : 'transparent')}
        onClick={(e) => handleNavLinkClick(e, path)}
      >
        {text}
      </a>
    </li>
  );

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'User';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };


  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: '15px 30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      borderBottom: '1px solid #eee',
    }}>

      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
        My App
      </div>

      <ul style={{
        display: 'flex',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        gap: '30px',
      }}>
        {renderNavLink('/homepage', 'Trang chủ')}
        {/* Only show profile link if logged in and has a profile */}
        {currentUser && currentUser.name && renderNavLink('/profile', 'Profile')}
        {renderNavLink('/personal-task', 'Lịch làm việc')}
        {renderNavLink('/timeline', 'Timeline')}
        {renderNavLink('/about', 'Về chúng tôi')}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* thanh search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              padding: '8px 12px 8px 35px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              width: '200px',
              outline: 'none',
              fontSize: '14px',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ccc'}
          />
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#888',
          }}>
            🔍
          </span>
        </div>

        {currentUser && currentUser.name ? (
          <>
            {/* Notification Icon */}
            <div
              style={{
                fontSize: '24px',
                cursor: 'pointer',
                color: '#555',
                position: 'relative',
              }}
              onClick={handleNotificationClick}
            >
              🔔
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 'bold',
                display: 'none',
              }}>
                3
              </span>
            </div>

            {/* Chat Icon */}
            <div
              style={{
                fontSize: '24px',
                cursor: 'pointer',
                color: '#555',
                position: 'relative',
              }}
              onClick={handleChatClick}
            >
              💬
            </div>

            {/* Avatar with Dropdown for logged-in user */}
            <div style={{ position: 'relative' }} className="avatar-dropdown-container">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#007bff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
                onClick={handleAvatarClick}
              >
                {getInitials(currentUser.name)}
              </div>

              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '50px',
                  right: '0',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 100,
                  minWidth: '120px',
                  overflow: 'hidden',
                }}>
                  <a
                    href="/profile"
                    style={{
                      display: 'block',
                      padding: '10px 15px',
                      textDecoration: 'none',
                      color: '#333',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    onClick={(e) => handleNavLinkClick(e, '/profile')}
                  >
                    Profile
                  </a>
                  <div
                    style={{
                      display: 'block',
                      padding: '10px 15px',
                      cursor: 'pointer',
                      color: '#333',
                      transition: 'background-color 0.2s ease',
                      borderTop: '1px solid #eee',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            gap: '10px',
          }}>
            {renderNavLink('/login', 'Đăng nhập')}
            {renderNavLink('/register', 'Đăng ký')}
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;