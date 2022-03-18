const client = require("../db");
const { hashSync } = require("bcryptjs");

class User {
  constructor({ id = null, name = null, email = null, password = null }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;

    this.save = async () => {
      try {
        const hashedPass = hashSync(this.password, 10);
        const query = `INSERT INTO users (name,email,password) VALUES ('${this.name}','${this.email}','${hashedPass}')`;

        await client.query(query);
        return true;
      } catch (err) {
        throw err;
      }
    };

    if (this.id) {
      this.update = async () => {
        try {
          let query = `UPDATE users SET  name='${this.name}',email='${this.email}'`;
          if (this.password) {
            const hashedPass = hashSync(this.password, 10);
            query += `,password='${hashedPass}'`;
          }
          query += `WHERE id=${parseInt(this.id)}`;

          await client.query(query);

          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      };
    }
  }

  static findByEmail = async (email) => {
    try {
      const query = `SELECT * FROM users WHERE email='${email}'`;
      const { rows, rowCount } = await client.query(query);

      if (rowCount < 0) {
        return null;
      }

      return rows[0];
    } catch (err) {
      console.log(err);
      return null;
    }
  };
}

module.exports = User;
