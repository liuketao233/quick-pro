// pages/api/session.js
import { getSession } from 'next-auth';

const handler = async (req, res) => {
  const session = await getSession({ req });
  
  if (session) {
    res.status(200).json({ loggedIn: true, user: session.user });
  } else {
    res.status(200).json({ loggedIn: false });
  }
};
export default handler;