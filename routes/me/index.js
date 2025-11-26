const router = require("express").Router();
const meController = require("./controller/meController");

router.get('', meController.getMe);

module.exports = router;