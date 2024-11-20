import { useState } from 'react';
import axios from 'axios';
import './App.css';

import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';


interface Resolutions {
  [resolution: string]: string;
}

function App() {
  const [url, setUrl] = useState<string>('');
  const [resolutions, setResolutions] = useState<Resolutions>({});
  const [quality, setQuality] = useState<[string, string] | null>(null);
  // const [downloadPath, setDownloadPath] = useState<string>('');
  

  const fetchResolutions = async () => {
    try {
      const res = await axios.get<Resolutions>('/api/resolutions', {
        params: { url: url }
      });
      console.log(res.data);
      setResolutions(res.data);

    }
    catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Error fetching resolutions:', err.message);
      }
      else {
        console.error('Unexpected error:', err);
      }

    }
  };


  const handleDownload = async () => {
    try {
      if (!quality) {
        alert('Please select a resolution');
        return
      }

      await axios.post('/api/download', {
        url: url,
        itag: quality[1]
      });
    }
    catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Error downloading:', err.message);
      }
      else {
        console.error('Unexpected error:', err);
      }    }
  };

  // const selectDownloadFolder = async () => {
  //   try {
  //     // Open a folder picker dialog
  //     const directoryHandle = await window.showDirectoryPicker(); // it does exist
  //     const folderName = directoryHandle.name;

  //     // Get full path for backend (Electron apps only)
  //     const path = folderName; // This assumes Electron integration
  //     setDownloadPath(path);
  //   } catch (err) {
  //     console.error('Error selecting folder:', err);
  //   }
  // };


  return (
    <div>
      <h1>YouTube Video Downloader</h1>
      <Input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter video URL"
        sx={{ marginBottom: 2, width: '100%' }} // Space below input
      />
      <Button onClick={fetchResolutions} size='lg' sx={{ marginBottom: 2 }}>
        Get Resolutions
      </Button>

      <h2>Available Resolutions:</h2>
      
      <ButtonGroup
        size="lg"
        variant="solid"
        spacing={2} // Space between buttons
        sx={{ marginBottom: 2 }} // Space below ButtonGroup
      >
        {Object.entries(resolutions).map(([resolution, itagValue]) => (
          <Button onClick={() => setQuality([resolution, itagValue])}>
            {resolution} (itag: {itagValue})
          </Button>
        ))}
      </ButtonGroup>

      {quality && (
        <Button onClick={handleDownload} size='lg' color='success' sx={{ marginTop: 2 }}>
          Download Video in {quality[0]}
        </Button>
      )}
    </div>

  );
}

export default App;