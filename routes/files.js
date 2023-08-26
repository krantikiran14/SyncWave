const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const {v4:uuid4} = require('uuid');
const sendMail = require('../services/emailService');

let storage = multer.diskStorage({
    destination: (req,file,cb)=> cb(null, 'uploads/'),
    filename: (req,file,cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    },

})

let upload = multer({
    storage,
    limit:{ fileSize: 1000000 * 100 },
}).single('myfile');    

router.post('/', (req,res)=>{
    //validation
   
        // Store file
        upload(req, res, async (err) => {
            if(!req.file){
                return res.json ({error: 'All fields are required'});
        
            }
            
            if(err){
                return res.status(500).send({erro: err.message})

            }
            const file = new File({
                filename: req.file.filename,
                uuid: uuid4(),
                path: req.file.path,
                size: req.file.size

            });

            const respone = await file.save();
            return res.json({file: `${process.env.APP_BASE_URL}/files/${respone.uuid}`});
        });

    
})

router.post('/send', async (req, res) => {
    try {
        const { uuid, emailTo, emailFrom } = req.body;

        // Input validation
        if (!uuid || !emailTo || !emailFrom) {
            return res.status(422).send({ error: 'All fields are required except expiry.' });
        }

        // Database query
        const file = await File.findOne({ uuid: uuid });
        if (!file) {
            return res.status(404).send({ error: 'File not found.' });
        }
        if (file.sender) {
            return res.status(422).send({ error: 'Email already sent once.' });
        }
        file.sender = emailFrom;
        file.receiver = emailTo;
        await file.save();

        // Send email
        await sendMail({
            from: emailFrom,
            to: emailTo,
            subject: 'SyncWave File Sharing',
            text: `${emailFrom} shared a file with you.`,
            html: require('../services/emailTemplate')({
                emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
                size: parseInt(file.size / 1000) + ' KB',
                expires: '24 hours'
            })
        });

        return res.json({ success: true });
    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).send({ error: 'Something went wrong.' });
    }
});

module.exports = router;

