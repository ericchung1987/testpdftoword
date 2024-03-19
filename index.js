// Import required modules
const path = require('path');
const ejs = require('ejs');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { exec } = require('child_process');


// Create an instance of express
const app = express();


// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'), {index: false}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index.ejs');
});



app.post('/convertToDocx', upload.single('pdfFile'), (req, res) => {
    // req.file is the 'pdfFile' file
    const pythonScriptPath = path.join(__dirname + "/views", 'tes.py');
    const filePath = req.file.path;
    const outputPath = path.join(__dirname, 'output.docx');

    const child = exec(`python ${pythonScriptPath} ${filePath} ${outputPath}`);

    child.stdout.on('data', (data) => {
        console.log(`Progress: ${data}%`);
    });

    child.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    child.on('exit', (code, signal) => {
        if (code !== 0) {
            console.log(`Conversion process exited with code ${code}`);
            return res.status(500).send('An error occurred during conversion.');
        }

        // Send the converted file as a response
        res.download(outputPath, (err) => {
            if (err) {
                console.log(`Error: ${err.message}`);
                return res.status(500).send('An error occurred during file download.');
            }
        });
    });
});

/*----------------Server related-----------------*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});