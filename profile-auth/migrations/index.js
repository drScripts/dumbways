const client = require("../db");

const deleteAllTableIfExists = async () => {
  const query = `DROP TABLE IF EXISTS users,projects`;

  try {
    await client.query(query);
    console.info("Success DELETE ALL TABLE");
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }
};

const createTableProjects = async () => {
  const query = `CREATE TABLE projects(
        id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        description TEXT NOT NULL,
        tech VARCHAR(255)[] NOT NULL,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`;
  try {
    await client.query(query);
    console.info("SUCCESS ADD TABLE projects");
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }
};

const createTableUsers = async () => {
  const query = `CREATE TABLE users(
        id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;

  try {
    await client.query(query);
    console.info("SUCCESS ADD TABLE users");
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }
};

module.exports.migrate = async () => {
  await deleteAllTableIfExists();
  await createTableProjects();
  await createTableUsers();
  process.exit(0);
};
