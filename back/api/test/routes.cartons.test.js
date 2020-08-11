const chai = require("chai");
const { expect } = require("chai");

const { Carton, closeConnections } = require("../src/connection");
const { generateCategories } = require("../src/plugins/populate");

chai.use(require("chai-http"));
chai.use(require("chai-things"));

const API_URL = process.env.API_URL || "http://localhost:8000";

console.log("starting tests");

before(async () => {
  await Carton.deleteMany();
  await generateCategories();
  await closeConnections();
  return Promise.resolve();
});

describe("Browse the list of originels cartons", () => {
  let parent_carton;

  it("should get the list of originels cartons", (done) => {
    chai
      .request(API_URL)
      .get("/cartons/list")
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.be.greaterThan(0);
        [("_id", "user", "nom", "parent", "private")].forEach((key) =>
          expect(res.body).to.all.have.property(key)
        );
        parent_carton = res.body[0];
        done();
      });
  });

  it("should get a sous-carton from the previous carton", (done) => {
    let sous_carton_id =
      parent_carton.versions[0].quoi.sous_cartons[0].carton_id;
    chai
      .request(API_URL)
      .get(`/cartons/${sous_carton_id}`)
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
      .post("/cartons/")
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
      .get(`/cartons/${carton_id}`)
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

  it("should update the content of a carton", async () => {
    let updates = [
      {
        operation: "set",
        path: "nom",
        value: "nouveau nom",
      },
    ];
    // Update the carton
    let res = await chai
      .request(API_URL)
      .post("/cartons/update")
      .send({ id: carton_id, updates: updates });
    expect(res).to.have.status(200);

    // Check carton has the new content
    res = await chai.request(API_URL).get(`/cartons/${carton_id}`);
    expect(res).to.be.json;
    expect(res.body[updates[0].path]).to.equal(updates[0].value);
  });

  it("should add a sous-carton to the existing carton", async () => {
    // Create a new sous-carton
    let sous_carton = { nom: "mon sous-carton", user: "thomas", versions: [] };
    let sous_carton_id;
    let res = await chai.request(API_URL).post("/cartons/").send(sous_carton);
    expect(res).to.have.status(201);
    sous_carton_id = res.body.id;

    // Add the newly created carton as a sous-carton of an existing carton
    let sous_carton_update = [
      {
        path: "versions.0.quoi.sous_cartons",
        value: { carton_id: sous_carton_id, version_id: 0 },
        operation: "push",
      },
    ];
    res = await chai
      .request(API_URL)
      .post("/cartons/update")
      .send({ id: carton_id, updates: sous_carton_update });
    console.log(res.text);
    expect(res).to.have.status(200);

    // Check that the parent carton has the corresponding sous-carton
    res = await chai.request(API_URL).get(`/cartons/${carton_id}`);
    expect(res.body.versions[0].quoi.sous_cartons.length).to.equal(1);
    expect(res.body.versions[0].quoi.sous_cartons[0].carton_id).to.equal(
      sous_carton_id
    );
  });

  it("should delete the inserted carton from the database", async () => {
    // Delete the carton
    let res = await chai
      .request(API_URL)
      .delete("/cartons/delete")
      .send({ id: carton_id });
    expect(res).to.have.status(200);

    // Check it cannot be found
    res = await chai
      .request(API_URL)
      .delete("/cartons/get")
      .send({ id: carton_id });
    expect(res).to.have.status(404);
  });
});
