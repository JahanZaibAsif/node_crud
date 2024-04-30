const mongoose = require('mongoose');

const main = async () => {
    await mongoose.connect("mongodb://localhost:27017/crud")
    const productSch = new mongoose.Schema({
        name:String,
        age:Number
    });
    const ProductModel = mongoose.model('product',productSch);
    {
        let data = new ProductModel({
            name:"gulfam",
            age:22,
        });
        let result = await data.save();
        console.log(result);
    }
};
main();