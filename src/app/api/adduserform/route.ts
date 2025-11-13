import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbconection';
import User from '@/models/restaurant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const user = await User.create(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
}

