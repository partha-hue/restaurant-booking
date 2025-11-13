"use client";
import { useEffect, useState } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data.data));
  }, []);

  return (
    <ul>
      {users.map((user: any) => (
        <li key={user._id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  );
}