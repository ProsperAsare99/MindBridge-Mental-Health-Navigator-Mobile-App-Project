
import axios from 'axios';

async function testRegister() {
  const payload = {
    name: 'Test User',
    username: 'testuser' + Math.floor(Math.random() * 1000),
    email: 'test' + Math.floor(Math.random() * 1000) + '@example.com',
    phoneNumber: '1234567890',
    password: 'password123',
    academic: { 
      institution: 'University of Ghana (UG)', 
      faculty: 'Computer Science', 
      level: 'Level 100', 
      status: 'Full-time' 
    },
    preferences: { 
      stressSources: ['Academics'], 
      supportTypes: ['Self-help'], 
      reminders: true 
    }
  };

  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', payload);
    console.log('Registration Success:', response.data);
  } catch (error) {
    console.error('Registration Failed:', error.response?.status, error.response?.data || error.message);
  }
}

testRegister();
