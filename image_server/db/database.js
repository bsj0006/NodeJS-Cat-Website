const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/*
 * 'Object' for low level database access.
 */
module.exports.Database = function () {
    const IMAGE_TABLE_NAME = 'images';

    let db_path = path.join(__dirname, 'database.db');
    console.log("opening database at " + db_path);
    let db = new sqlite3.Database(db_path, sqlite3.OPEN_READWRITE,
        function (err) {
            if (err) {
                console.error(err);
            }
            console.log('Connected to the database.');
        });

    this.get_random_images = function (count, callback) {
        if (isNaN(count)) {
            callback("Count must be a number", []);
            return;
        }
        if (count < 1) {
            count = 1;
        } else if (count > 50) {
            count = 50;
        }
        query_random_images(count, callback)
    };

    /**
     * Query images and return resulting URIs as an array into a callback
     *
     * @param count Number of images
     * @param callback Callabck the reuslt is passed into.
     */
    function query_random_images(count, callback) {
        let sql = `SELECT IMAGE_URI image_uri FROM ${IMAGE_TABLE_NAME} ORDER BY RANDOM() LIMIT ${count}`;
        db.all(sql, [], function (err, rows) {
            console.log(rows);
            let data = [];
            for (let i = 0; i < rows.length; i++) {
                data.push(rows[i].image_uri)
            }
            callback(null, data);
        });
    }
};