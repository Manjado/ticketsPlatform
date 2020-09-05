import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
  if (!req.session || !req.session.jwt) {
    return res.send({ currentuser: null });
  }
});

export { router as currentUserRouter };
