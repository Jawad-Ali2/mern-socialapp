import express from "express";
import bodyParser from "body-parser"; // Express body-parser is an npm module used to process data sent in an HTTP request body.
import mongoose from "mongoose";
import cors from "cors"; // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
import dotenv from "dotenv"; // DotEnv is a lightweight npm package that automatically loads environment variables from a . env file into the process. env object.
import multer from "multer"; // Multer is an npm package that makes it easy to handle file uploads.
import helmet from "helmet"; // It helps to protect Node. js Express apps from common security threats such as Cross-Site Scripting (XSS) and click-jacking attacks. 
import morgan from "morgan"; // morgan is a Node. js and Express middleware to log HTTP requests and errors, and simplifies the process. 
import path from "path"; // path module is a built-in module that helps you work with file system paths in an OS-independent way
import {fileURLToPath} from "url"; // Accepts a file: URI and returns a regular file path suitable for use with the fs module functions.
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import {createPost} from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts} from "./data/index.js";


// CONFIGURATIONS OF MIDDLEWARE //
// Middleware are the functions that run between the middle things //

const __filename = fileURLToPath(import.meta.url); // To grab the file URL
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); // Set the directory of where we keep our assets. We are storing this locally


// FILE STORAGE // 
const  storage = multer.diskStorage({
    destination: function (req, file, cb)
    {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb)
    {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage }); // Anytime we need to upload the file we use this variable

// ROUTES WITH FILES // 
app.post ("/auth/register", upload.single("picture"), register);
app.post ("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP // 
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewURLParser: true,
    useUnifiedTopology: true, 
}). then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // ADD DATA ONE TIME //
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error) => console.log(`${error} could not connect`));