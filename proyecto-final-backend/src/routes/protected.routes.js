import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = Router();

router.get('/perfil', verifyToken, (req, res) => {
  res.json({
    message: 'Accediste a una ruta protegida 🔒',
    user: req.user
  });
});

export default router;
