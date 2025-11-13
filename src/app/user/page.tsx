import Restaurant from '@/models/restaurant';
import AddUserForm from '../restaurants/page';
import UserList from '../bookings/page';


export default function Home() {
  return (
    <div>
      <h1>User Management</h1>
      <Restaurant />
      <AddUserForm />
      <UserList />
      <AddUserForm />
      <UserList />
      
    </div>
  );
}

