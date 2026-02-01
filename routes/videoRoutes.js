const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const videoController = require("../controllers/videoController");

// show page + optional search (q)
router.get("/videos", requireAuth, videoController.getVideosPage);

// save a video to favorites
router.post("/videos/save", requireAuth, videoController.saveVideo);

// delete favorite
router.post("/videos/delete/:id", requireAuth, videoController.deleteVideo);

module.exports = router;
