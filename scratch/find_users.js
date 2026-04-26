import axios from 'axios';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6Imd1cnUiLCJpYXQiOjE3NzcxOTU3NjgsImV4cCI6MTc3NzI4MjE2OH0.4ncXaNrftshXziTAKmfVPDPsadoLwQ8fi4758qunaA4';
const baseURL = 'https://school.petik.or.id';

async function find() {
  const endpoints = ['/api/siswa', '/api/guru', '/api/admin', '/siswa', '/guru', '/admin'];
  
  for (const endpoint of endpoints) {
    console.log(`Fetching ${baseURL}${endpoint}...`);
    try {
      const response = await axios.get(`${baseURL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`SUCCESS ${endpoint}:`, JSON.stringify(response.data, null, 2).substring(0, 1000));
    } catch (error) {
      console.log(`FAILED ${endpoint}: ${error.message}`);
    }
  }
}

find();
