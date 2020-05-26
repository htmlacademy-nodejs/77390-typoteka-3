'use strict';

const request = require(`supertest`);
const {app} = require(`../../cli/server/server`);

const newArticle = {
  title: `Обзор новейшего смартфона. Обзор новейшего смартфона.`,
  categories: [`Железо`],
  announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  fullText: `Он написал больше 30 хитов.,Собрать камни бесконечности легко, если вы прирожденный герой.,Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
};

const newComment = {
  text: `Тестовый комментарий к объявлению`,
};

describe(`Get articles`, () => {
  let res;
  beforeAll(async () => {
    res = await request(app).get(`/api/articles`);
  });

  test(`When requesting the status of the response should be 200`, () => {
    expect(res.statusCode).toBe(200);
  });

  test(`When requesting response should contain items and total`, () => {
    expect(res.body.data).toHaveProperty(`items`);
    expect(res.body).toHaveProperty(`total`);
  });
});

describe(`Add article`, () => {
  let resAdd;
  let addedArticle;

  beforeAll(async () => {
    resAdd = await request(app)
      .post(`/api/articles`)
      .send({item: newArticle});
    addedArticle = resAdd.body.data.item;
  });
  afterAll(async () => {
    await request(app).delete(`/api/articles/${addedArticle.id}`);
  });

  test(`When add offer the response status should be 200`, () => {
    expect(resAdd.statusCode).toBe(200);
  });

  test(`When add offer the response contain item`, () => {
    expect(resAdd.body.data).toHaveProperty(`item`);
  });

  test(`When add offer the response contain item contain required fields`, () => {
    const item = resAdd.body.data.item;
    expect(item).toHaveProperty(`id`);
    expect(item).toHaveProperty(`title`);
    expect(item).toHaveProperty(`createdDate`);
    expect(item).toHaveProperty(`categories`);
    expect(item).toHaveProperty(`announce`);
    expect(item).toHaveProperty(`fullText`);
  });

  test(`When add offer the response contain item equal newArticle`, () => {
    const item = resAdd.body.data.item;
    expect(item.title).toEqual(newArticle.title);
    expect(item.categories).toEqual(newArticle.categories);
    expect(item.announce).toEqual(newArticle.announce);
    expect(item.fullText).toEqual(newArticle.fullText);
  });
});

describe(`Add incorrect article`, () => {
  let resAdd;
  const newIncorrectArticle = {...newArticle};
  const failFieldId = `categories`;
  delete newIncorrectArticle[failFieldId];

  beforeAll(async () => {
    resAdd = await request(app)
      .post(`/api/articles`)
      .send({item: newIncorrectArticle});
  });

  test(`When add incorrect offer the response status should be 400`, () => {
    expect(resAdd.statusCode).toBe(400);
  });

  test(`When add incorrect offer the response contain error with message`, () => {
    const error = resAdd.body.error;
    expect(typeof error.message).toBe(`string`);
    expect(error.message.length).toBeGreaterThan(0);
  });

  test(`When add incorrect offer the response contain fail field`, () => {
    const failFields = resAdd.body.failFields;
    expect(failFields.length).toEqual(1);
    expect(failFields[0].id).toEqual(failFieldId);
  });
});

describe(`Get article`, () => {
  let res;
  let addedArticle;

  beforeAll(async () => {
    const resAdd = await request(app)
      .post(`/api/articles`)
      .send({item: newArticle});
    addedArticle = resAdd.body.data.item;
    res = await request(app).get(`/api/articles/${addedArticle.id}`);
  });
  afterAll(async () => {
    await request(app).delete(`/api/articles/${addedArticle.id}`);
  });

  test(`When requesting the status of the response should be 200`, () => {
    expect(res.statusCode).toBe(200);
  });

  test(`When requesting response should contain item`, () => {
    expect(res.body.data).toHaveProperty(`item`);
  });

  test(`When requesting response contain item equal newArticle and item should contain id equal addedArticle.id`, () => {
    const item = res.body.data.item;
    expect(item.title).toEqual(newArticle.title);
    expect(item.categories).toEqual(newArticle.categories);
    expect(item.announce).toEqual(newArticle.announce);
    expect(item.fullText).toEqual(newArticle.fullText);
  });
});

describe(`Update article`, () => {
  let resUpdate;
  let addedArticle;
  const modifiedArticle = {
    title: `${newArticle.title} 1`,
    categories: [`Деревья`],
    announce: `${newArticle.announce} 1`,
    fullText: `${newArticle.fullText} 1`,
  };

  beforeAll(async () => {
    const resAdd = await request(app)
      .post(`/api/articles`)
      .send({item: newArticle});
    addedArticle = resAdd.body.data.item;
    resUpdate = await request(app)
      .put(`/api/articles/${addedArticle.id}`)
      .send({item: modifiedArticle});
  });
  afterAll(async () => {
    await request(app).delete(`/api/articles/${addedArticle.id}`);
  });

  test(`When add offer the response status should be 200`, () => {
    expect(resUpdate.statusCode).toBe(200);
  });

  test(`When add offer the response contain item`, () => {
    expect(resUpdate.body.data).toHaveProperty(`item`);
  });

  test(`When add offer the response contain item contain required fields`, () => {
    const item = resUpdate.body.data.item;
    expect(item).toHaveProperty(`id`);
    expect(item).toHaveProperty(`title`);
    expect(item).toHaveProperty(`createdDate`);
    expect(item).toHaveProperty(`categories`);
    expect(item).toHaveProperty(`announce`);
    expect(item).toHaveProperty(`fullText`);
  });

  test(`When add offer the response contain item equal newArticle`, () => {
    const item = resUpdate.body.data.item;
    expect(item.title).toEqual(modifiedArticle.title);
    expect(item.categories).toEqual(modifiedArticle.categories);
    expect(item.announce).toEqual(modifiedArticle.announce);
    expect(item.fullText).toEqual(modifiedArticle.fullText);
  });
});

describe(`Remove article`, () => {
  let resRemove;
  let addedArticle;

  beforeAll(async () => {
    const resAdd = await request(app)
      .post(`/api/articles`)
      .send({item: newArticle});
    addedArticle = resAdd.body.data.item;
    resRemove = await request(app).delete(`/api/articles/${addedArticle.id}`);
  });

  test(`When add offer the response status should be 204`, () => {
    expect(resRemove.statusCode).toBe(204);
  });

  test(`After remove offet when requesting item the response status should be 404`, async () => {
    const res = await request(app).get(`/api/articles/${addedArticle.id}`);
    expect(res.statusCode).toBe(404);
  });
});

describe(`Get comments`, () => {
  let res;
  let addedArticle;

  beforeAll(async () => {
    const resAdd = await request(app)
      .post(`/api/articles`)
      .send({item: newArticle});
    addedArticle = resAdd.body.data.item;
    await request(app).post(`/api/articles/${addedArticle.id}/comments`)
      .send({item: newComment});
    res = await request(app).get(`/api/articles/${addedArticle.id}/comments`);
  });
  afterAll(async () => {
    await request(app).delete(`/api/articles/${addedArticle.id}`);
  });

  test(`When requesting the status of the response should be 200`, () => {
    expect(res.statusCode).toBe(200);
  });

  test(`When requesting response should contain items and total`, () => {
    expect(res.body.data).toHaveProperty(`items`);
    expect(res.body).toHaveProperty(`total`);
  });

  test(`When requesting response.item.comments should contain array with item equal newComment`, () => {
    const items = res.body.data.items;
    expect(items.some((item) => item.text === newComment.text)).toBeTruthy();
  });
});

describe(`Add comments`, () => {
  let res;
  let addedArticle;

  beforeAll(async () => {
    const resAdd = await request(app)
      .post(`/api/articles`)
      .send({item: newArticle});
    addedArticle = resAdd.body.data.item;
    res = await request(app).post(`/api/articles/${addedArticle.id}/comments`)
      .send({item: newComment});
  });
  afterAll(async () => {
    await request(app).delete(`/api/articles/${addedArticle.id}`);
  });

  test(`When add comment the status of the response should be 200`, () => {
    expect(res.statusCode).toBe(200);
  });

  test(`When add offer the response contain item contain required fields`, () => {
    const item = res.body.data.item;
    expect(item).toHaveProperty(`id`);
    expect(item).toHaveProperty(`text`);
  });

  test(`When add offer the response contain item.text equal newCommentText`, () => {
    const item = res.body.data.item;
    expect(item.text).toEqual(newComment.text);
  });
});

describe(`Remove comment`, () => {
  let resRemove;
  let addedArticle;
  let addedComment;

  beforeAll(async () => {
    const resAddOffer = await request(app)
      .post(`/api/articles`)
      .send({item: newArticle});
    addedArticle = resAddOffer.body.data.item;
    const resAddedComment = await request(app).post(`/api/articles/${addedArticle.id}/comments`)
      .send({item: newComment});
    addedComment = resAddedComment.body.data.item;
    resRemove = await request(app)
      .delete(`/api/articles/${addedArticle.id}/comments/${addedComment.id}`);
  });
  afterAll(async () => {
    await request(app).delete(`/api/articles/${addedArticle.id}`);
  });

  test(`When remove comment the response status should be 204`, () => {
    expect(resRemove.statusCode).toBe(204);
  });

  test(`After remove comment when requesting comment the response items not should this comment`, async () => {
    const res = await request(app).get(`/api/articles/${addedArticle.id}/comments/`);
    const comments = res.body.data.items;
    expect(comments.some((it) => it.id === addedComment.id)).toBeFalsy();
  });
});
