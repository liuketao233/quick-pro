// pages/api/users.js

import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("sample_mflix");

  switch (req.method) {
    case 'GET':
      const { name } = req.query;
      let findData = {};
      if(name && name != ''){
        findData = {name : name};
      }
      const users = await db.collection('users').find(findData).toArray();
      res.json({ status: 200, data: users });
      break;
    case 'POST':
      const newUser = req.body;
      await db.collection('users').insertOne(newUser);
      res.json({ status: 201, message: 'User added!' });
      break;
    default:
      res.status(405).end(); // Method Not Allowed
      break;
  }
}
