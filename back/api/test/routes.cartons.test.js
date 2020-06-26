const chai = require("chai");
const { expect } = require("chai");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

const API_URL = process.env.API_URL || "http://localhost:8000";

describe("Browse a carton and its sous-cartons", () => {
  let parent_carton;

  it("should get the list of originels cartons", (done) => {
    chai
      .request(API_URL)
      .get("/cartons/list")
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        ["_id", "user", "nom", "parent", "private"].forEach((key) =>
          expect(res.body).to.all.have.property(key)
        );
        parent_carton = res.body[0];
        done();
      });
  });

  it("should get a sous-carton from the parent", (done) => {
    let sous_carton_id =
      parent_carton.versions[0].quoi.sous_cartons[0].carton_id;
    chai
      .request(API_URL)
      .post("/cartons/get")
      .send({
        id: sous_carton_id,
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("_id");
        expect(res.body._id).to.equal(sous_carton_id);
        expect(res.body).to.have.property("parent");
        expect(res.body.parent).to.equal(parent_carton._id);
        done();
      });
  });
});

describe("Manage a Carton", () => {
  let carton_id;
  let carton = { nom: "mon carton", user: "thomas", versions: [] };

  it("should insert a new carton", (done) => {
    chai
      .request(API_URL)
      .post("/cartons/add")
      .send(carton)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("id");
        carton_id = res.body.id;
        done();
      });
  });

  it("should get back the inserted carton", (done) => {
    chai
      .request(API_URL)
      .post("/cartons/get")
      .send({ id: carton_id })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("_id");
        expect(res.body._id).to.equal(carton_id);
        expect(res.body).to.have.property("nom");
        expect(res.body.nom).to.equal(carton.nom);
        expect(res.body).to.have.property("user");
        expect(res.body.user).to.equal(carton.user);
        expect(res.body).to.have.property("parent");
        expect(res.body.parent).to.be.null;
        done();
      });
  });

  let updates = [
    {
      operation: "set",
      path: "nom",
      value: "nouveau nom",
    },
  ];
  it("should update the content of a carton", (done) => {
    chai
      .request(API_URL)
      .post("/cartons/update")
      .send({ id: carton_id, updates })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should check carton has the new content", (done) => {
    chai
      .request(API_URL)
      .post("/cartons/get")
      .send({ id: carton_id })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.be.json;
        expect(res.body[updates[0].path]).to.equal(updates[0].value);
        done();
      });
  });

  it("should delete the inserted carton from the database", (done) => {
    chai
      .request(API_URL)
      .delete("/cartons/delete")
      .send({ id: carton_id })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("DELETE /cartons/delete route", (done) => {});
