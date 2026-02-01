const videoService = require("../services/videoService");
const favoriteRepo = require("../repositories/favoriteRepository");

exports.getVideosPage = async (req, res) => {
  const q = req.query.q || "";
  const searchResult = q ? await videoService.search(q) : { items: [] };
  const favorites = await favoriteRepo.findAllByUserId(req.session.user.id);

  res.render("videos", {
    query: q,
    searchResult,
    favorites,
    error: searchResult.error || null,
  });
};

exports.saveVideo = async (req, res) => {
  const { videoId, title, thumbnail, description } = req.body;
  try {
    await favoriteRepo.create({
      userId: req.session.user.id,
      videoId,
      title,
      thumbnail,
      description,
    });
  } catch (err) {
    // ignore duplicate error or send flash in future
    console.error("Failed to save favorite:", err.message);
  }
  res.redirect(`/videos${req.body._returnTo ? req.body._returnTo : ""}`);
};

exports.deleteVideo = async (req, res) => {
  const id = req.params.id;
  try {
    await favoriteRepo.deleteById(id, req.session.user.id);
  } catch (err) {
    console.error("Failed to delete favorite:", err.message);
  }
  res.redirect("/videos");
};

exports.reorder = async (req, res) => {
  const orderedIds = req.body && req.body.orderedIds;
  if (!Array.isArray(orderedIds)) {
    return res
      .status(400)
      .json({ ok: false, error: "orderedIds array required" });
  }

  try {
    await favoriteRepo.updateOrder(req.session.user.id, orderedIds);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Failed to update order:", err.message);
    return res.status(500).json({ ok: false, error: "Failed to update order" });
  }
};
