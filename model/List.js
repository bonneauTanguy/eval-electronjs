class List {
    constructor(db) {
        this.db = db.connect()
    }
    getLists() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM List", (err,rows) =>{
                if(err) {
                    console.log(err);
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        });
    }
}

module.exports = List