import { verifyToken } from '../middlewares/verifyToken.js'

router.get('/privado', verifyToken, (req, res) => {
  res.json({ message: 'Accediste a una ruta protegida', user: req.user })
})
