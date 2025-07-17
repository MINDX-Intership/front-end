// App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';

function App() {
  const [currentPage, setCurrentPage] = useState('/profile');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case '/login':
        return <Login setCurrentPage={setCurrentPage} />;
      case '/register':
        return <Register setCurrentPage={setCurrentPage} />;
      case '/profile':
        return <Profile setCurrentPage={setCurrentPage} />;
      case '/reset-password':
        return <ResetPassword setCurrentPage={setCurrentPage} />;
      default:
        return <Login setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div>
      <Navbar setCurrentPage={setCurrentPage} />
      {renderCurrentPage()}
    </div>
  );
}

export default App;