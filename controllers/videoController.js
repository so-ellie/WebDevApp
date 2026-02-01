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
