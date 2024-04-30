const dbConnect = require('./mongoDb');

const update =async () => {
    let data = await dbConnect();
    let result = await data.updateMany(
        {
            name:'Sameel'
        },
       {
         $set:{
            name:'Good by'
        }
    }
    );
    if(result.acknowledged){
        console.log("data update successful")

    }
    

}

update();
