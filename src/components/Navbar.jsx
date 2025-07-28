import React, { useState, useEffect } from 'react';
import { Search, Bell, MessageCircle, ChevronDown, User, LogOut, Home, Briefcase, Clock, Info, Settings } from 'lucide-react';

function Navbar({ currentPage, setCurrentPage, currentUser, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [avatarAnchor, setAvatarAnchor] = useState(false);
  const [workAnchor, setWorkAnchor] = useState(false);
  const [adminAnchor, setAdminAnchor] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setAvatarAnchor(false);
        setWorkAnchor(false);
        setAdminAnchor(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavLinkClick = (path) => {
    setCurrentPage(path);
    setAvatarAnchor(false);
    setWorkAnchor(false);
    setAdminAnchor(false);
  };

  const styles = {
    navbar: {
      height: '72px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
      backdropFilter: isScrolled ? 'blur(20px)' : 'none',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease'
    },
    container: {
      height: '72px',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      textDecoration: 'none'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '12px',
      color: 'white',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    logoText: {
      fontSize: '20px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #595a5bff, #4b5563)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      transition: 'all 0.3s ease'
    },
    logoTextHover: {
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px'
    },
    navButton: {
      
      display: 'flex',
      alignItems: 'center',
      gap: '8px',

      borderRadius: '8px',
  fontSize: '15px',
  padding: '10px 14px',
      fontWeight: '500',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      color: '#374151'
    },
    navButtonActive: {
      color: '#3b82f6',
      background: '#eff6ff'
    },
    navButtonHover: {
      color: '#3b82f6',
      background: '#f9fafb'
    },
    dropdown: {
      position: 'relative'
    },
    dropdownMenu: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      left: 0,
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      border: '1px solid #e5e7eb',
      minWidth: '200px',
      padding: '8px 0',
      zIndex: 1001,
      opacity: 0,
      visibility: 'hidden',
      transform: 'translateY(-8px)',
      transition: 'all 0.2s ease'
    },
    dropdownMenuOpen: {
      opacity: 1,
      visibility: 'visible',
      transform: 'translateY(0)'
    },
    dropdownMenuItem: {
      width: '100%',

      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#374151',
  fontSize: '15px', // dễ đọc
  padding: '14px 18px',
      transition: 'all 0.15s ease'
    },
    dropdownMenuItemHover: {
      background: '#f9fafb',
      color: '#1f2937'
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    searchContainer: {
      position: 'relative'
    },
    searchInput: {
      width: '256px',

  fontSize: '15px',
  padding: '10px 16px 10px 44px',
      border: '1px solid #d1d5db',
      borderRadius: '24px',
      background: '#f9fafb',
      outline: 'none',
      transition: 'all 0.2s ease'
    },
    searchInputFocus: {
      background: 'white',
      borderColor: '#93c5fd',
      boxShadow: '0 0 0 3px rgba(147, 197, 253, 0.1)'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af'
    },
    iconButton: {
      position: 'relative',
      padding: '8px',
      border: 'none',
      background: 'transparent',
      borderRadius: '50%',
      cursor: 'pointer',
      color: '#6b7280',
      transition: 'all 0.2s ease'
    },
    iconButtonHover: {
      color: '#3b82f6',
      background: '#eff6ff'
    },
    notificationBadge: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      width: '12px',
      height: '12px',
      background: '#ef4444',
      borderRadius: '50%'
    },
    onlineBadge: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      width: '8px',
      height: '8px',
      background: '#10b981',
      borderRadius: '50%'
    },
    avatarButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '4px',
      border: 'none',
      background: 'transparent',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    avatarButtonHover: {
      background: '#f9fafb'
    },
    avatar: {
  width: '36px',
  height: '36px',
  fontSize: '15px',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',

      fontWeight: '500',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    },
    userInfo: {
      padding: '12px 16px',
      borderBottom: '1px solid #e5e7eb'
    },
    userName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#1f2937',
      margin: 0
    },
    userEmail: {
      fontSize: '12px',
      color: '#6b7280',
      margin: 0
    },
    authButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    loginButton: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'color 0.2s ease'
    },
    loginButtonHover: {
      color: '#3b82f6'
    },
    registerButton: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: 'white',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      border: 'none',
      borderRadius: '24px',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
      transition: 'all 0.2s ease'
    },
    registerButtonHover: {
      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
      transform: 'translateY(-1px)'
    },
    chevron: {
      transition: 'transform 0.2s ease'
    },
    chevronRotated: {
      transform: 'rotate(180deg)'
    },
    adminButton: {
      color: '#dc2626'
    },
    adminButtonHover: {
      color: '#b91c1c',
      background: '#fef2f2'
    },
    logoutItem: {
      color: '#dc2626'
    },
    logoutItemHover: {
      color: '#b91c1c',
      background: '#fef2f2'
    },
    mobileSearchContainer: {
      padding: '0 24px 12px',
      display: 'none'
    },
    mobileSearch: {
      width: '100%',
      padding: '8px 16px 8px 40px',
      fontSize: '14px',
      border: '1px solid #d1d5db',
      borderRadius: '24px',
      background: '#f9fafb',
      outline: 'none',
      transition: 'all 0.2s ease'
    }
  };

  const DropdownMenu = ({ isOpen, children, className = "", style = {} }) => (
    <div 
      style={{
        ...styles.dropdownMenu,
        ...(isOpen ? styles.dropdownMenuOpen : {}),
        ...style
      }}
      className={className}
    >
      {children}
    </div>
  );

  const MenuItem = ({ onClick, icon: Icon, children, isLogout = false, isHovered, onMouseEnter, onMouseLeave }) => (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        ...styles.dropdownMenuItem,
        ...(isHovered ? (isLogout ? styles.logoutItemHover : styles.dropdownMenuItemHover) : {}),
        ...(isLogout ? styles.logoutItem : {})
      }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );

  const [hoveredStates, setHoveredStates] = useState({});

  const handleMouseEnter = (key) => {
    setHoveredStates(prev => ({ ...prev, [key]: true }));
  };

  const handleMouseLeave = (key) => {
    setHoveredStates(prev => ({ ...prev, [key]: false }));
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        
        {/* Logo */}
        <div 
          style={{
            ...styles.logo,
            ...(hoveredStates.logo ? { transform: 'scale(1.02)' } : {})
          }}
          onClick={() => handleNavLinkClick('/homepage')}
          onMouseEnter={() => handleMouseEnter('logo')}
          onMouseLeave={() => handleMouseLeave('logo')}
        >
          <div style={styles.logoIcon}>
            MA
          </div>

        </div>

        {/* Navigation Links */}
        <div style={styles.navLinks}>
          
          <button
            onClick={() => handleNavLinkClick('/homepage')}
            onMouseEnter={() => handleMouseEnter('home')}
            onMouseLeave={() => handleMouseLeave('home')}
            style={{
              ...styles.navButton,
              ...(currentPage === '/homepage' ? styles.navButtonActive : {}),
              ...(hoveredStates.home ? styles.navButtonHover : {})
            }}
          >
            <Home size={16} />
            Trang chủ
          </button>

          {/* Công việc Dropdown */}
          <div 
            style={styles.dropdown} 
            className="dropdown-container"
          >
            <button
              style={{
                ...styles.navButton,
                ...(hoveredStates.work || workAnchor ? styles.navButtonHover : {})
              }}
              onMouseEnter={() => {
                handleMouseEnter('work');
                setWorkAnchor(true);
              }}
              onMouseLeave={() => handleMouseLeave('work')}
            >
              <Briefcase size={16} />
              Công việc
              <ChevronDown 
                size={14} 
                style={{
                  ...styles.chevron,
                  ...(workAnchor ? styles.chevronRotated : {})
                }}
              />
            </button>

            <div
              onMouseEnter={() => setWorkAnchor(true)}
              onMouseLeave={() => setWorkAnchor(false)}
            >
              <DropdownMenu isOpen={workAnchor}>
                <MenuItem 
                  onClick={() => handleNavLinkClick('/sprints')} 
                  icon={Settings}
                  isHovered={hoveredStates.sprint}
                  onMouseEnter={() => handleMouseEnter('sprint')}
                  onMouseLeave={() => handleMouseLeave('sprint')}
                >
                  Sprint
                </MenuItem>
                <MenuItem 
                  onClick={() => handleNavLinkClick('/personal-task')} 
                  icon={User}
                  isHovered={hoveredStates.personal}
                  onMouseEnter={() => handleMouseEnter('personal')}
                  onMouseLeave={() => handleMouseLeave('personal')}
                >
                  Công việc cá nhân
                </MenuItem>
              </DropdownMenu>
            </div>
          </div>

          <button
            onClick={() => handleNavLinkClick('/about')}
            onMouseEnter={() => handleMouseEnter('about')}
            onMouseLeave={() => handleMouseLeave('about')}
            style={{
              ...styles.navButton,
              ...(currentPage === '/about' ? styles.navButtonActive : {}),
              ...(hoveredStates.about ? styles.navButtonHover : {})
            }}
          >
            <Info size={16} />
            Về chúng tôi
          </button>

{currentUser?.role !== 'ADMIN' && (
  <div 
    style={styles.dropdown} 
    className="dropdown-container"
  >
    <button
      style={{
        ...styles.navButton,
        ...styles.adminButton,
        ...(hoveredStates.admin || adminAnchor ? styles.adminButtonHover : {})
      }}
      onMouseEnter={() => {
        handleMouseEnter('admin');
        setAdminAnchor(true);
      }}
      onMouseLeave={() => handleMouseLeave('admin')}
    >
      <Settings size={18} />
      Admin
      <ChevronDown 
        size={14} 
        style={{
          ...styles.chevron,
          ...(adminAnchor ? styles.chevronRotated : {})
        }}
      />
    </button>

    <div
      onMouseEnter={() => setAdminAnchor(true)}
      onMouseLeave={() => setAdminAnchor(false)}
    >
      <DropdownMenu isOpen={adminAnchor}>
        <MenuItem 
          onClick={() => handleNavLinkClick('/admin')} 
          icon={User}
          isHovered={hoveredStates.adminDashboard}
          onMouseEnter={() => handleMouseEnter('adminDashboard')}
          onMouseLeave={() => handleMouseLeave('adminDashboard')}
        >
          Trang quản trị
        </MenuItem>
        <MenuItem 
          onClick={() => handleNavLinkClick('/admin-report')} 
          icon={Briefcase}
          isHovered={hoveredStates.adminReport}
          onMouseEnter={() => handleMouseEnter('adminReport')}
          onMouseLeave={() => handleMouseLeave('adminReport')}
        >
          Báo cáo
        </MenuItem>
        <MenuItem 
          onClick={() => handleNavLinkClick('/admin-timeline')} 
          icon={Clock}
          isHovered={hoveredStates.adminTimeline}
          onMouseEnter={() => handleMouseEnter('adminTimeline')}
          onMouseLeave={() => handleMouseLeave('adminTimeline')}
        >
          Timeline quản trị
        </MenuItem>

      </DropdownMenu>
    </div>
  </div>
)}
        </div>


        <div style={styles.rightSection}>
          
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => handleMouseEnter('search')}
              onBlur={() => handleMouseLeave('search')}
              style={{
                ...styles.searchInput,
                ...(hoveredStates.search ? styles.searchInputFocus : {})
              }}
            />
            <Search size={16} style={styles.searchIcon} />
          </div>

          {currentUser ? (
            <>
              {/* Notification Button */}
              <button 
                onClick={() => handleNavLinkClick('/notifications')}
                onMouseEnter={() => handleMouseEnter('notifications')}
                onMouseLeave={() => handleMouseLeave('notifications')}
                style={{
                  ...styles.iconButton,
                  ...(hoveredStates.notifications ? styles.iconButtonHover : {})
                }}
              >
                <Bell size={20} />
                <span style={styles.notificationBadge}></span>
              </button>

              {/* Messages Button */}
              <button 
                onClick={() => handleNavLinkClick('/chat')}
                onMouseEnter={() => handleMouseEnter('messages')}
                onMouseLeave={() => handleMouseLeave('messages')}
                style={{
                  ...styles.iconButton,
                  ...(hoveredStates.messages ? styles.iconButtonHover : {})
                }}
              >
                <MessageCircle size={20} />
                <span style={styles.onlineBadge}></span>
              </button>

              {/* Avatar Dropdown */}
              <div style={styles.dropdown} className="dropdown-container">
                <button
                  onClick={() => setAvatarAnchor(!avatarAnchor)}
                  onMouseEnter={() => handleMouseEnter('avatar')}
                  onMouseLeave={() => handleMouseLeave('avatar')}
                  style={{
                    ...styles.avatarButton,
                    ...(hoveredStates.avatar ? styles.avatarButtonHover : {})
                  }}
                >
                  <div style={styles.avatar}>
                    {currentUser.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <ChevronDown 
                    size={14} 
                    style={{
                      ...styles.chevron,
                      ...(avatarAnchor ? styles.chevronRotated : {}),
                      color: '#9ca3af'
                    }}
                  />
                </button>

                <DropdownMenu isOpen={avatarAnchor} style={{ right: 0, left: 'auto' }}>
                  <div style={styles.userInfo}>
                    <p style={styles.userName}>{currentUser.name}</p>
                    <p style={styles.userEmail}>{currentUser.email}</p>
                  </div>
                  <MenuItem 
                    onClick={() => handleNavLinkClick('/profile')} 
                    icon={User}
                    isHovered={hoveredStates.profile}
                    onMouseEnter={() => handleMouseEnter('profile')}
                    onMouseLeave={() => handleMouseLeave('profile')}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem 
                    onClick={() => { onLogout(); setAvatarAnchor(false); }} 
                    icon={LogOut}
                    isLogout={true}
                    isHovered={hoveredStates.logout}
                    onMouseEnter={() => handleMouseEnter('logout')}
                    onMouseLeave={() => handleMouseLeave('logout')}
                  >
                    Logout
                  </MenuItem>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <div style={styles.authButtons}>
              <button
                onClick={() => handleNavLinkClick('/login')}
                onMouseEnter={() => handleMouseEnter('login')}
                onMouseLeave={() => handleMouseLeave('login')}
                style={{
                  ...styles.loginButton,
                  ...(hoveredStates.login ? styles.loginButtonHover : {})
                }}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => handleNavLinkClick('/register')}
                onMouseEnter={() => handleMouseEnter('register')}
                onMouseLeave={() => handleMouseLeave('register')}
                style={{
                  ...styles.registerButton,
                  ...(hoveredStates.register ? styles.registerButtonHover : {})
                }}
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;