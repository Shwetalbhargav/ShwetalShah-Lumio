// [Purpose] Top-level router that mounts feature routers.
// [Why] Scales as you add modules without cluttering app.js.
const { Router } = require('express');
const summariesRouter = require('./summaries.routes');

const router = Router();

router.use('/summaries', summariesRouter);

module.exports = router;
