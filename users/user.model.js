const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// mongoose.set('useCreateIndex', true);

const schema = new Schema({
    email: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    image_file: { type: String, required: false },
    role: { type: String, required: false,default: 'USER' },
    mobile: { type: String, required: false ,unique:false },
    unique_id: { type: String, required: false ,default:"NULL" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },  
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);