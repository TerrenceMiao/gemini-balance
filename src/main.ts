import express from 'express';
import { setupRouters } from './router';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../app/templates'));
app.use(express.static(path.join(__dirname, '../static')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

setupRouters(app);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
