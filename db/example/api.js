const http = require("http");
const port = 8000;
const host = "localhost";

/**
 * Insert un nouvel objet carton dans la base de données.
 * Si succès, résolve en un objet response dont le body
 * contient l'id du document inséré (res.body.id).
 * @param {Object} carton Object carton
 */
function insertCarton(carton) {
  const options = {
    hostname: host,
    port: port,
    path: "/cartons/add",
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Content-length": Buffer.byteLength(JSON.stringify(carton)),
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (msg) => {
      let res = {
        statusCode: msg.statusCode,
        headers: msg.headers,
        body: [],
      };
      msg.on("data", (chunk) => {
        res.body.push(chunk);
      });

      msg.on("end", () => {
        if (res.body.length) {
          res.body = res.body.join();
          res.body = JSON.parse(res.body);
        }
        resolve(res);
      });
    });

    req.on("error", (err) => {
      console.log("error: ", err);
      reject();
    });

    req.write(JSON.stringify(carton));
    req.end();
  });
}

/**
 * Efface tous les documents présents dans la base de données.
 * Si succès resolve un objet response.
 */
function resetCartons() {
  const options = {
    hostname: host,
    port: port,
    path: "/cartons/reset",
    method: "DELETE",
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (msg) => {
      let res = {
        statusCode: msg.statusCode,
        headers: msg.headers,
        body: [],
      };

      msg.on("data", (chunk) => {
        res.body.push(chunk);
      });

      msg.on("end", () => {
        if (res.body.length) {
          res.body = res.body.join();
          res.body = JSON.parse(res.body);
        }
        resolve(res);
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}

function updateCarton(id, update) {
  const data = {
    id: id,
    update: update,
  };
  const options = {
    hostname: host,
    port: port,
    path: "/cartons/update",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Size": Buffer.byteLength(JSON.stringify(data)),
    },
  };

  return new Promise((resolve, reject) => {
    let req = http.request(options, (msg) => {
      let res = {
        statusCode: msg.statusCode,
        headers: msg.headers,
        body: [],
      };

      msg.on("data", (chunk) => {
        res.body.push(chunk);
      });

      msg.on("end", () => {
        if (res.body.length) {
          res.body = res.body.join();
          res.body = JSON.parse(res.body);
        }
        resolve(res);
      });
    });

    req.on("error", (err) => {
      reject(err);
    });
    req.write(JSON.stringify(data));
    req.end();
  });
}

module.exports = {
  resetCartons,
  insertCarton,
  updateCarton,
};
