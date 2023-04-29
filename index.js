const express = require('express');

const cwd = process.cwd();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`API server for Social Network API running on port ${PORT}!`);
});