
async function test() {
  const payload = {
    name: 'Test User',
    username: 'testuser' + Math.floor(Math.random() * 1000),
    email: 'test' + Math.floor(Math.random() * 1000) + '@example.com',
    password: 'password123'
  };

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
