/**
 * GENERAL NOTE:
 * Be VERY mindful of the use of _implicit returns_ with arrow functions.
 * Pay careful attention to whether the function utilizes curly braces or
 * not:
 *
 * () => {
 *   return db().select();
 * }
 *   vs
 * () =>
 *  db().select()
 *
 * If you receive a strange error, especially errors concerning hooks,
 * you have probably NOT returned an async function from one or more
 * of your tests.
 *
 */

const ArticlesService = require("../src/articles-service");
const knex = require("knex");

describe(`Articles service object`, function () {
  let db;
  let testArticles = [
    {
      id: 1,
      date_published: new Date("2029-01-22T16:28:32.615Z"),
      title: "First test post!",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?",
    },
    {
      id: 2,
      date_published: new Date("2100-05-22T16:28:32.615Z"),
      title: "Second test post!",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.",
    },
    {
      id: 3,
      date_published: new Date("1919-12-22T16:28:32.615Z"),
      title: "Third test post!",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.",
    },
  ];
  // prepare db connection by using `db` var. in the scope of the primary `describe` block
  before("setupdb", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });
  // clean blogful_articles table before and after each test
  before(() => db("blogful_articles").truncate());
  afterEach(() => db("blogful_articles").truncate());

  // let go of db connection
  after(() => db.destroy());

  // context is a synonym for describe; no functional difference (it's a semantic thing)
  context(`Given 'blogful_articles' has data`, () => {
    before(() => {
      return db.into("blogful_articles").insert(testArticles);
    });

    it(`getAllArticles() resolves all articles from 'blogful_articles' table`, () => {
      // test that ArticlesService.getAllArticles gets data from table
      return ArticlesService.getAllArticles(db).then((actual) => {
        expect(actual).to.eql(testArticles);
      });
    });
    it(`getById() resolves an article by id from 'blogful_articles' table`, () => {
      const thirdId = 3;
      const thirdTestArticle = testArticles[thirdId - 1];
      return ArticlesService.getById(db, thirdId).then((actual) => {
        expect(actual).to.eql({
          id: thirdId,
          title: thirdTestArticle.title,
          content: thirdTestArticle.content,
          date_published: thirdTestArticle.date_published,
        });
      });
    });
  });

  context(`Given 'blogful_articles' has no data`, () => {
    it(`getAllArticles() resolves an empty array`, () => {
      return ArticlesService.getAllArticles(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });
  });
});
