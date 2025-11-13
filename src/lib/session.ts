import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';

export async function getSessionUser() {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      if (!token) return null;
      const payload = await verifyJwt(token);
      return payload;
}
