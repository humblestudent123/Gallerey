const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.static('uploads'));

app.post('/upload', upload.single('image'), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('Файл не загружен');

    const ext = path.extname(file.originalname);
    const newPath = `uploads/${file.filename}${ext}`;
    fs.renameSync(file.path, newPath);

    res.json({ url: `/${newPath}` });
});

app.get('/images', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) return res.status(500).send('Ошибка чтения папки');
        const urls = files.map(file => `/uploads/${file}`);
        res.json(urls);
    });
});

app.listen(3000, () => console.log('Сервер запущен на http://localhost:3000'));
