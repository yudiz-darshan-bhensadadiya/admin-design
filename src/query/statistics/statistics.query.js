import axios from '../../axios'

export async function getDashboard() {
  return await axios.get('/dashboard')
}
