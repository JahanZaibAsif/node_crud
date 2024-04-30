const dbConnect = require('./mongoDb');

const insert = async () =>{
    
    const db = await dbConnect();
    const result = await db.insertMany(
        [
            
            {
                name:'hamza',
                age:39,
                class:"CS"
            },
            {
                name:'hamza',
                age:39,
                class:"CS"
            },
            {
                name:'hamza',
                age:39,
                class:"CS"
            },

    
        ]
    ) 
    if ( result.acknowledged){
        console.log('your data insert successful')
    }
}
insert()