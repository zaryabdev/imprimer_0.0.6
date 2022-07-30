class BillRepository {
    constructor(dao) {
        this.dao = dao;
    }

    createTable() {
        const sql = `
      CREATE TABLE IF NOT EXISTS bills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        date_created TEXT )`;
        return this.dao.run(sql);
    }
    create(name) {

        return this.dao.run(
            'INSERT INTO bills (name,date_created) VALUES (?,?)',
            [name, new Date()]);
    }

    update(project) {
        const { id, name } = project;
        return this.dao.run(
            `UPDATE bills SET name = ? WHERE id = ?`,
            [name, id]
        );
    }

    delete(id) {
        return this.dao.run(
            `DELETE FROM bills WHERE id = ?`,
            [id]
        );
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM bills WHERE id = ?`,
            [id]);
    }

    getAll() {
        return this.dao.all(`SELECT * FROM bills`);
    }
}

module.exports = BillRepository;