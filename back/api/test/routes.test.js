const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

const API_URL = process.env.API_URL || "http://localhost:8000";
console.log(API_URL);

chai.use(chaiHttp);

describe("Carton", () => {
  it("should get the list of originels cartons", (done) => {
    chai
      .request(API_URL)
      .get("/cartons/list")
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });
});
