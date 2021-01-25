import { Router } from 'express'

const routes = Router()

routes.use((req, res) => {
  console.log("req: ", req.ip)

  return res.status(200).json({ ok: true })
})

export default routes