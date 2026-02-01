class Favorite {
  constructor({
    id,
    userId,
    videoId,
    title,
    thumbnail,
    description,
    createdAt,
  }) {
    this.id = id;
    this.userId = userId;
    this.videoId = videoId;
    this.title = title;
    this.thumbnail = thumbnail;
    this.description = description;
    this.createdAt = createdAt;
  }
}

module.exports = Favorite;
