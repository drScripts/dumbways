const client = require("../db");
const moment = require("moment");

class Project {
  constructor({
    id,
    title,
    start_date,
    end_date,
    description,
    tech,
    image_url,
    user_id,
  }) {
    this.id = id;
    this.title = title;
    this.start_date = start_date;
    this.end_date = end_date;
    this.description = description;
    this.tech = tech;
    this.image_url = image_url;
    this.user_id = user_id;
    this.save = async () => {
      const query = `INSERT INTO projects (title,start_date,end_date,description,image_url,tech,user_id) VALUES ('${
        this.title
      }','${this.start_date}','${this.end_date}',($2),'${
        this.image_url
      }',($1),${parseInt(this.user_id)})`;

      try {
        await client.query(query, [this.tech, this.description]);
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    };

    this.update = async () => {
      const timeStampNow = moment().format("YYYY-M-D H:m:s");

      let query = `UPDATE projects SET title='${this.title}',start_date='${this.start_date}',end_date='${this.end_date}',description=($2),tech=($1),updated_at='${timeStampNow}'`;

      if (this.image_url) {
        query += `,image_url='${this.image_url}'`;
      }

      query += ` WHERE id=${this.id}`;

      try {
        await client.query(query, [this.tech, this.description]);
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    };
  }

  static getAll = async () => {
    const query = `SELECT * FROM projects`;

    try {
      const { rows } = await client.query(query);
      return rows;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  static getAllByUser = async (userid) => {
    const query = `SELECT * FROM projects WHERE user_id = ${parseInt(userid)}`;

    try {
      const { rows } = await client.query(query);
      return rows;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  static find = async (id) => {
    const query = `SELECT * FROM projects WHERE id = '${id}'`;
    try {
      const { rows } = await client.query(query);
      if (rows.length > 0) {
        return rows[0];
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  static delete = async (id) => {
    const query = `DELETE FROM projects WHERE id = '${id}'`;

    try {
      await client.query(query);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
}

module.exports = Project;
