const mongoose = require("mongoose")

const connectdatabase = ()=>{
    try {
        mongoose.connect('mongodb://localhost:27017/',  { dbName : 'latestdb'}).then((res)=>{
            if(res){
                console.log('connect success with db')
            }
        }).catch((err)=>{
            console.log('connect failed')
        })
    } catch (error) {
        console.log('connect failed by fn')
    }
}

module.exports = {connectdatabase}