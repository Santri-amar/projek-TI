import axios from 'axios';

const endpoints = [
  'https://school.petik.or.id/api/guru',
  'https://school.petik.or.id/api/admin',
  'https://school.petik.or.id/api/siswa',
  'https://school.petik.or.id/login/guru',
  'https://school.petik.or.id/login/admin',
  'https://school.petik.or.id/login/siswa'
];

const payloads = [
  { username: 'Sukma Hidayatullah', password: 'sukma123' },
  { name: 'Sukma Hidayatullah', password: 'sukma123' },
  { email: 'Sukma Hidayatullah', password: 'sukma123' },
  { identifier: 'Sukma Hidayatullah', password: 'sukma123' }
];

async function test() {
  const testCases = [
    { endpoint: 'https://school.petik.or.id/login/admin', payload: { email: 'admin1@gmail.com', password: '123456' } },
    { endpoint: 'https://school.petik.or.id/login/siswa', payload: { name: 'Muhammad Hilmy Zaky', password: '123456' } }
  ];

  for (const testCase of testCases) {
    console.log(`Testing ${testCase.endpoint} with payload ${JSON.stringify(testCase.payload)}...`);
    try {
      const response = await axios.post(testCase.endpoint, testCase.payload);
      console.log(`SUCCESS! Endpoint: ${testCase.endpoint}, Payload: ${JSON.stringify(testCase.payload)}`);
    } catch (error) {
      console.log(`FAILED: ${error.message} ${error.response?.data?.msg || error.response?.data?.message || ''}`);
    }
  }
}

test();
