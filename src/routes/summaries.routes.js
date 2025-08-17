// [Purpose] Define all REST routes for summaries.
// [Why] Keeps route declaration (HTTP + path) separate from handler logic.
const { Router } = require('express');
const ctrl = require('../controllers/summaries.controller');

const r = Router();

r.post('/generate', ctrl.upload.single('transcriptFile'), ctrl.generate);
r.get('/', ctrl.list);
r.get('/:id', ctrl.getOne);
r.put('/:id', ctrl.update);
r.post('/:id/share', ctrl.share);
// Optional cleanup
r.delete('/:id', ctrl.removeOne);

module.exports = r;
