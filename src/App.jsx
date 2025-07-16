import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [currentPage, setCurrentPage] = useState('/login');

  return (
    <div>
      {currentPage === '/login' ? <Login setCurrentPage={setCurrentPage} /> : <Register setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default App;