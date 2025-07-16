import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';

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
      default:
        return <Login setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div>
      {renderCurrentPage()}
    </div>
  );
}

export default App;