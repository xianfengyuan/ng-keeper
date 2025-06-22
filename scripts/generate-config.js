const fs = require('fs');

const config = {
  apiKey: process.env.API_KEY,
  dbName: process.env.DB_NAME,
  projectName: process.env.PROJECT_NAME
};

fs.writeFileSync('src/assets/config.json', JSON.stringify(config, null, 2));
