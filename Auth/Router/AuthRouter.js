const Router = require('express')
const router = new Router()
const controller = require('../Controller/AuthController')

router.post('/registration', controller.registration)
router.post('/authorization', controller.authorization )
router.post('/changeRole', controller.changeRole)
router.get('/get', controller.getUsers)
router.post('/like', controller.likedProduct)
router.post('/dislike', controller.dislikeProduct)
module.exports = router;
