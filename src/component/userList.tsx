"use client";
import { useEffect, useState } from "react";

type User = { _id: string; name?: string; email?: string };

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.data || []));
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user._id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  );
}