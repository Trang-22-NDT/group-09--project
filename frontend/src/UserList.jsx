import React from 'react';

function UserList({ users }) {
  return (
    <div style={{ padding: 10, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center' }}>Danh sách user</h2>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {users.length > 0 ? (
          users.map(user => (
            <li key={user.id} style={{ padding: 6, borderBottom: '1px solid #eee' }}>
              {user.name} - {user.email}
            </li>
          ))
        ) : (
          <li style={{ textAlign: 'center', color: '#888' }}>Chưa có user nào</li>
        )}
      </ul>
    </div>
  );
}

export default UserList;
