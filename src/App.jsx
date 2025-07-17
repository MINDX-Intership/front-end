// App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import Homepage from './components/Homepage';
import Files from './components/Files';


function App() {
  const [currentPage, setCurrentPage] = useState('/');
  const renderCurrentPage = () => {
    switch (currentPage) {
      case '/homepage':
        return <Homepage setCurrentPage={setCurrentPage} />;
      case '/login':
        return <Login setCurrentPage={setCurrentPage} />;
      case '/register':
        return <Register setCurrentPage={setCurrentPage} />;
      case '/profile':
        return <Profile setCurrentPage={setCurrentPage} />;
      case '/reset-password':
        return <Files setCurrentPage={setCurrentPage} />;
      default:
        return <Login setCurrentPage={setCurrentPage} />;
    }
  };
////
  return (
    <div>
      <Navbar setCurrentPage={setCurrentPage} />
      {renderCurrentPage()}
    </div>
  );
}

export default App;