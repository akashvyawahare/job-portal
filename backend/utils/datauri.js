import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
  const parser = new DataUriParser(); //converting file data into data uri string
  const extName = path.extname(file.originalname).toString(); // extracting the extension name of the uploaded file
  return parser.format(extName, file.buffer); // this is coming from multer.memoryStorage(), since multer have stored it as a buffer instead of storing it as a buffer
};

export default getDataUri;
