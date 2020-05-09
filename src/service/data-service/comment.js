'use strict';

const nanoid = require(`nanoid`).nanoid;

class CommentService {
  async findAll(article) {
    return article.comments;
  }

  async create(article, comment) {
    const newComment = {
      id: nanoid(),
      ...comment,
    };
    article.comments.push(newComment);
    return newComment;
  }

  async drop(article, commentId) {
    const commentIndex = article.comments.findIndex((it) => it.id === commentId);
    if (commentIndex === -1) {
      return null;
    }
    return article.comments.splice(commentIndex, 1)[0];
  }

}

module.exports = {
  CommentService
};
