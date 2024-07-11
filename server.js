import express from 'express';
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { readFile } from "fs/promises";
import { runPerformanceCheck } from './performance-check.js';


const app = express();
app.use(express.json());

app.set('port', 8080);
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

app.get('/', async (req, res) => {
    try {
        const data = await readFile('./results/scraped_scripts.json', 'utf8'); // Replace 'data.json' with your actual file path
        const jsonData = JSON.parse(data); // Parse the JSON string
             
        res.render('index', {
        jsonData: jsonData,
        dummy : 'hiii'
        });
    } catch (error) {
        console.error('Error reading JSON file:', error);
    }
});

// Sending lighthouse report
app.get('/view-lighthouse-report',(req,res)=>{
    res.render('lighthouse-report.html');
})

// sending scraped scripts JSON report
app.get('/view-scripts',(req,res)=>{
    res.sendFile('./results/scraped_scripts.json', { root: __dirname });
})

// sending scraped scripts lighthouse JSON report
app.get('/view-lighthouse-json', (req,res)=>{
    res.sendFile('./results/lighthouse-report.json', { root: __dirname });
})

app.get('/coverage-report', async (req,res)=>{
    try {
        const data = await readFile('./results/coverage-report.json', 'utf8'); 
        const jsonData = JSON.parse(data); // Parse the JSON string
             
        res.render('coverage', {
            jsonData: jsonData
        });
    } catch (error) {
        console.error('Error reading JSON file:', error);
    }
})

app.post('/get-url', (req, res) => {
    const data = req.body.url;
    console.log(data);
    res.send('hi');
})

const main = async () => {
    const url = process.argv[2];
    if (!url) {
        console.error("Please provide a URL as a command line argument");
        process.exit(1);
    }

    console.log(`Running performance check for ${url}`);
    try {
        await runPerformanceCheck(url);

    } catch (error) {
        console.error("An error occurred:", error);
    }  
};
    

app.listen(8080,()=>{
    console.log('express server running on http://localhost:8080');
    main();
})