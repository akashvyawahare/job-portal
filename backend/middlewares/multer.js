// we are using multer to get the file sent from the frontend to the backend

import multer from "multer";
const storage = multer.memoryStorage();
export const singleUpload = multer({ storage }).single("file"); // here inside single, whatever name you are mentioning, must be same as the 'type' you mentioned while declaring that file
