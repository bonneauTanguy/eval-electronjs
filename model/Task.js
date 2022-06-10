
class Task {
    constructor(db) {
        this.db = db.connect()
    }

    getItems(id) {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM Task WHERE id_List="+ id, (err,rows) =>{
                if(err) {
                    console.log(err);
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        });
    }

    addItems(data) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare("INSERT INTO Task (title) VALUES (?)")
            stmt.run(data, (err,rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    deleteItem(data) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare("DELETE FROM Task WHERE id = ?")
            stmt.get(data, (err,rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    updateItem(data) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare("UPDATE Task SET title=? WHERE id="+ data.id)
            stmt.run(data.title, (err,rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = Task