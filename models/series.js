var mongoose = require('./connect');

var serieSchema = mongoose.Schema({
    img: String,
    name: String,
    langue: String,
    genres: String,
    status: String,
    summary: String,
    officialSite: String,
    rating: Number,
})

var serieModel = mongoose.model('series', serieSchema);

module.exports = serieModel;