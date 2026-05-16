
async function test() {
  const payload = {
    name: 'Null User 1',
    email: 'null1' + Math.floor(Math.random() * 1000) + '@example.com',
    password: 'password123'
  };

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    console.log('User 1 Status:', response.status);
    
    const payload2 = {
      name: 'Null User 2',
      email: 'null2' + Math.floor(Math.random() * 1000) + '@example.com',
      password: 'password123'
    };
    
    const response2 = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload2)
    });
    const data2 = await response2.json();
    console.log('User 2 Status:', response2.status);
    console.log('User 2 Response:', data2);

  } catch (err) {
    console.error('Error:', err);
  }
}
test();
