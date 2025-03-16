import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleExecute = async () => {
    try {
      const response = await axios.post('http://localhost:5000/execute', {
        language,
        code,
      });
      setOutput(response.data.output);
    } catch (err) {
      setOutput(err.response?.data?.error || 'Error executing code');
    }
  };

  return (
    <div className="App">
      <h1>Online Code Editor</h1>
      <div className="editor-container">
        <label>
          Select Language:{' '}
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </label>
        <br />
        <textarea
          placeholder="Write your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={10}
          cols={50}
        ></textarea>
        <br />
        <button onClick={handleExecute}>Run Code</button>
      </div>
      <div className="output-container">
        <h2>Output:</h2>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default App;
