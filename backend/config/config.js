const mongoose=require('mongoose')

const connection= async()=>{
    try{
        const connect=await mongoose.connect("mongodb+srv://azminsazz:azmin2000@cluster0.tsyhhu4.mongodb.net/?retryWrites=true&w=majority")
        console.log("connection succesful");
    }
    catch{
        console.log('connection error');
        process.exit()
    }
}

module.exports=connection