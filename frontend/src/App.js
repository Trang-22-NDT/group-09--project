import React, { useState, useEffect } from 'react';
import AddUser from './AddUser';
import UserList from './UserList';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: '20px auto' }}>
      <AddUser fetchUsers={fetchUsers} />
      <UserList users={users} />
    </div>
  );
}

// Test squash commit
export default App;
console.log("Phiên bản BACKEND của App.js");

