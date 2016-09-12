/**
 * Created by Nick Williams on 30/08/16.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI);

//mongoose.connect('mongodb://localhost/test');


var UnitSchema = new Schema({
    un_unit_name: {type: String, required: true, unique: true},
    un_unit_desc: {type: String},
    un_unit_conversion: {type: Number, required: false},
    un_unit_class: {type: String, required: true}
});

var CropSchema = new Schema({
    cr_crop_name: {type: String, required: true},
    cr_crop_variety: String,
    cr_crop_mature_weeks: Number,
    cr_crop_avg_size: Number,
    cr_crop_planting_density_min: Number,
    cr_crop_planting_density_max: Number,
    cr_crop_season: String
});

exports.Unit = mongoose.model('Unit', UnitSchema);

exports.Crop = mongoose.model('Crop', CropSchema);
