// App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import Homepage from './components/Homepage';
import Files from './components/Files';
import Notifications from './components/Notification';
import Chat from './components/Chat';
import WorkSchedule from './components/WorkSchedule';


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
        return <WorkSchedule setCurrentPage={setCurrentPage} />;
      case '/notifications':
        return <Notifications setCurrentPage={setCurrentPage} />;
      case '/chat':
        return <Chat setCurrentPage={setCurrentPage} />;
      default:
        return <Login setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderCurrentPage()}
    </div>
  );
}

export default App;