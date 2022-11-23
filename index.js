const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
