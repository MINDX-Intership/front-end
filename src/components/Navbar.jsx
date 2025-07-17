import React, { useState } from 'react'; 

function Navbar({ currentPage, setCurrentPage }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleNavLinkClick = (e, path) => {
    e.preventDefault();
    setCurrentPage(path);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);

    console.log("Searching for:", e.target.value);
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
        <li>
          <a
            href="/profile"
            style={{
              ...baseLinkStyle,
              ...(currentPage === '/profile' ? activeLinkStyle : {}),
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = (currentPage === '/profile' ? '#e0e0e0' : 'transparent')}
            onClick={(e) => handleNavLinkClick(e, '/profile')}
          >
            Profile
          </a>
        </li>
        <li>
          <a
            href="/login"
            style={{
              ...baseLinkStyle,
              ...(currentPage === '/login' ? activeLinkStyle : {}),
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = (currentPage === '/login' ? '#e0e0e0' : 'transparent')}
            onClick={(e) => handleNavLinkClick(e, '/login')}
          >
            Đăng nhập
          </a>
        </li>
        <li>
          <a
            href="/register"
            style={{
              ...baseLinkStyle,
              ...(currentPage === '/register' ? activeLinkStyle : {}),
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = (currentPage === '/register' ? '#e0e0e0' : 'transparent')}
            onClick={(e) => handleNavLinkClick(e, '/register')}
          >
            Đăng ký
          </a>
        </li>
                <li>
          <a
            href="/profile"
            style={{
              ...baseLinkStyle,
              ...(currentPage === '/profile' ? activeLinkStyle : {}),
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = (currentPage === '/profile' ? '#e0e0e0' : 'transparent')}
            onClick={(e) => handleNavLinkClick(e, '/profile')}
          >
            Reset Password
          </a>
        </li>
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


        <div style={{
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
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}>

          Ki
        </div>
      </div>
    </nav>
  );
}

export default Navbar;