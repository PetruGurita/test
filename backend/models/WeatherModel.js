let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let FeedSchema = new Schema({
    county: {
        type: String,
    },
    data: {
        type: String,
    }

});

module.exports = Feed = mongoose.model('weather', FeedSchema);
