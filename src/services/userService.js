// if(process.env.NODE_ENV !== 'production'){
//       require('dotenv').config();
// }

const BASE_URL = '/api';

export async function fetchUserProfile() {
      const response = await fetch(`${BASE_URL}/user/profile`, {
            method: 'GET',
            headers: {
                  'Content-Type': 'application/JSON',
                  'Authorization': `Bearer ${getAuthToken()}`
            }
      })

      if (!response) {
            console.log('Cannot able to fetch user data.');
            alert('Cannot able to Fetch User.')
      }

      return response.json();
}


export async function updateUserProfile(updates) {
      const response = await fetch(`${BASE_URL}/user/profile`, {
            method: 'PATCH',
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${getAuthToken()}`,

            },
            body: JSON.stringify(updates)
      });
      if (!response.ok) {
            const arror = await response.json()
            console.log('Error updating User Profile')
            alert('Cannot update Profile.')
      }

      return response.json();
}



function getAuthToken() {
      return localStorage.getItem('authToken')
}