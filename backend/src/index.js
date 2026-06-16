import app from "./app.js";
import connectDB from "./db/index.js";

const port = process.env.PORT || 3000;


connectDB()
    .then(() => {
        console.log("MongoDB is connected successfully");
        app.listen(port, () => {
           console.log(`Server is running on https://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });


