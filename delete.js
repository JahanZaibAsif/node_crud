 const dbConnect = require('./mongoDb');

const delete_data = async() => {
    let data = await dbConnect()
    let result = await data.deleteMany(
        {
            name:'hamza'
        }
    )
    if(result.acknowledged){
        console.log("data delete successful")

    }
}

delete_data()