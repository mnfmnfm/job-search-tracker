const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('now you\'re looking for jobs'));

app.listen(3000);
