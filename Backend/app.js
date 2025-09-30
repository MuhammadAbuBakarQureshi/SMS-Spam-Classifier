const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const { METHODS } = require("http");
const { log } = require("console");


const app = express();
const PORT = 8080;


app.use(
    cors({
        origin: ["http://localhost:5173"],
    })
)
app.use(express.json())


app.post("/api/sms", async (req, res) => {

    try{

        let sms = req.body.sms;

        let response = await fetch("http://127.0.0.1:5000/predict", {

            method: "POST",
            headers : { "Content-Type" : "application/json" },
            body: JSON.stringify({sms: sms})
        })

        if(!response.ok){

            throw new Error(`error while fetching data`)
        }

        let prediction = await response.json();

        console.log(prediction);

        res.status(200).json({ status: "Success", data : prediction });
        
    } catch (error){

        console.error(`${error}`)
    }

})


app.listen(PORT, ()=>{

    console.log(`Listening on port ${PORT}`);
})