import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbconection';
import User from '../../../models/restaurant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const users = await User.find({});
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
}

