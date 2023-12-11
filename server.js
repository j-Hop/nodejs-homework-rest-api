import mongoose from "mongoose";


import app from "./app.js";

const DB_HOST = "mongodb+srv://Bogdan:BSM5YC58W9XcpnT6@cluster0.o4cmefp.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose.connect(DB_HOST)
.then(()=> {
  app.listen(3000, () => {
    console.log("Server running. Use our API on port: 3000")
  })
})
.catch(error => console.log(error.message))

// BSM5YC58W9XcpnT6