const express = require('express');
require('dotenv').config();
const multer = require('multer');
const {uploadFile,getFile} = require('./s3');
const upload = multer({dest:'uploads/'});
const fs = require('fs');
const app = express();

app.get('/:key',async(req,res)=>{
    const fileKey = req.params.key;
    const readableStream = getFile(fileKey);
    readableStream.pipe(res);
});

app.post('/upload', upload.single('images'), async(req,res)=>{
    const file = req.file;
    
    await uploadFile(file)
                    .then((value) => {
                        const deletedObject = fs.unlink(file.path,(err)=>{
                            if(err){
                                throw err;
                            }else{
                                console.log(`Yüklenen ${file.path} Silindi!`);
                            };
                        });
                        console.log(value);
                        res.send(value);
                    })
                    .catch(error => console.log(error));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server starting on the ${PORT}`);
});