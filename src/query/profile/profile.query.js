import axios from '../../axios'

export async function profile() {
  return await axios.get('/profile')
}

export async function UpdateProfile(profileData) {
  return await axios.post('/profile/updateProfile', profileData)
}

export async function checkToken(sVerifyToken) {
  return await axios.post('/auth/token', sVerifyToken)
}
