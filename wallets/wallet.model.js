const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    amount: { type: String,required: true , default:0},
    redeemed_amount: { type: String,required: true , default:0},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: { type: Number, required: true ,default:1 },
    type_id: { type: Number, required: true , default:0},
    create_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Wallet', schema);