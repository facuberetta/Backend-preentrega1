import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
});



cartSchema.pre(/^find/, function (next) {
    this.populate('products.product');
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
