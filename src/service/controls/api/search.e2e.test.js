'use strict';

const request = require(`supertest`);
const {app} = require(`../../cli/server/server`);

describe(`Search API end-points`, () => {
  let res;
  const newArticle = {
    title: `Обзор новейшего смартфона. Обзор новейшего смартфона.`,
    categories: [`Железо`],
    announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    fullText: `Он написал больше 30 хитов.,Собрать камни бесконечности легко, если вы прирожденный герой.,Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  };
  let addedArticle;
  beforeAll(async () => {
    await request(app).post(`/api/articles`)
      .send({item: newArticle})
      .then((response) => {
        addedArticle = response.body.data.item;
      });
    res = await request(app).get(encodeURI(`/api/search?query=${newArticle.title}`));
  });
  afterAll(async () => {
    await request(app).delete(`/api/offers/${addedArticle.id}`);
  });

  test(`When requesting the status of the response should be 200`, () => {
    expect(res.statusCode).toBe(200);
  });

  test(`When requesting response should contain items and total`, () => {
    expect(res.body.data).toHaveProperty(`items`);
    expect(res.body).toHaveProperty(`total`);
  });

  test(`When requesting response.items should contain added offer`, () => {
    const items = res.body.data.items;
    expect(items).toEqual(expect.arrayContaining([addedArticle]));
  });
});
