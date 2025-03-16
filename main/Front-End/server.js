const express = require('express');
const { exec } = require('child_process');
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// POST /execute
app.post('/execute', (req, res) => {
  const { language, code } = req.body;
  
  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required' });
  }
  
  // For JavaScript, use Node's vm module
  if (language.toLowerCase() === 'javascript') {
    try {
      // Create a sandbox with a 'result' placeholder
      let sandbox = { console, result: null };
      vm.createContext(sandbox);
      // Run the code with a timeout for safety
      const script = new vm.Script(code);
      script.runInContext(sandbox, { timeout: 1000 });
      return res.json({ output: sandbox.result });
    } catch (err) {
      return res.status(500).json({ error: err.toString() });
    }
  }
  
  // For Python, write code to a temporary file and execute it
  if (language.toLowerCase() === 'python') {
    const filePath = path.join(__dirname, 'temp.py');
    fs.writeFileSync(filePath, code);
    
    exec(`python ${filePath}`, (error, stdout, stderr) => {
      // Clean up the temporary file
      fs.unlinkSync(filePath);
      
      if (error) {
        return res.status(500).json({ error: stderr || error.toString() });
      }
      return res.json({ output: stdout });
    });
    return; // Important: exit after starting exec
  }
  
  return res.status(400).json({ error: 'Unsupported language' });
});

// Basic route to check the API status
app.get('/', (req, res) => {
  res.send('Online Code Editor API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
