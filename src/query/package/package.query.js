import axios from '../../axios'

export async function getPackageList(params) {
  return await axios.get(
    `/package/list?size=${params.size}&eStatus=${params.eStatus}&pageNumber=${params.pageNumber}&search=${params.search}&sort=${params.sort}&orderBy=${params.orderBy}`
  )
}

export async function addPackage(data) {
  return await axios.post('/package/add', data)
}

export async function getGameSelectList() {
  return await axios.get('/package/dropdownGame')
}

export async function getPackageById(id) {
  return await axios.get('package/viewPackage/' + id)
}

export async function updatePackageById(data) {
  const id = data?.id
  delete data?.id
  return await axios.put('package/editPackage/' + id, data)
}

export function deletePackage({ id }) {
  return axios.delete('/package/delete/' + id)
}
