const router = require("express").Router();
const catalogController = require("./controller/catalogController")


router.get('/roles', catalogController.findRols);
router.get('/roles/:uuid', catalogController.findRolByUuid);

module.exports = router;