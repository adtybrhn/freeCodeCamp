const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("Integration tests with chai-http", function () {
    // #1
    test("Test GET /hello with no name", function (done) {
      chai
        .request(server)
        .get("/hello")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "hello Guest");
          done();
        });
    });
    // #2
    test("Test GET /hello with your name", function (done) {
      chai
        .request(server)
        .get("/hello?name=xy_z")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "hello xy_z");
          done();
        });
    });
    // #3
    test('send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .put("/travellers")
        .send({ surname: "Colombo" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.name, "Cristoforo");
          assert.equal(res.body.surname, "Colombo");
          done();
        });
    });
    // #4
    test('send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .put("/travellers")
        .send({ surname: "da Verrazzano" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.name, "Giovanni");
          assert.equal(res.body.surname, "da Verrazzano");
          done();
        });
    });
  });
});

const Browser = require("zombie");
Browser.site = "localhost:5000";

suite("Functional Tests with Zombie.js", function () {
  const browser = new Browser();
  suiteSetup(function (done) {
    return browser.visit("/", done);
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      // Fill in the form with the surname "Colombo"
      browser.fill("surname", "Colombo");

      // Press the submit button
      browser.pressButton("submit", function () {
        // Assert that status is OK (200)
        browser.assert.status(200);

        // Assert that the text inside the element span#name is 'Cristoforo'
        browser.assert.text("span#name", "Cristoforo");

        // Assert that the text inside the element span#surname is 'Colombo'
        browser.assert.text("span#surname", "Colombo");

        // Assert that the element(s) span#dates exist and their count is 1
        browser.assert.elements("span#dates", 1);

        done();
      });
      // Do not forget to remove the assert.fail() call
    });
    // #6
    test('submit "surname" : "Vespucci" - write your e2e test...', async function () {
      await browser.fill("surname", "Vespucci");
      await browser.pressButton("submit");
      browser.assert.success();
      browser.assert.text("span#name", "Amerigo");
      browser.assert.text("span#surname", "Vespucci");
      browser.assert.elements("span#dates", 1);
    });
  });
});
