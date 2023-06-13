import axios from '../../axios'

export async function getAdminList(params) {
  return await axios.get(
    `/admin/list?size=${params.size}&eStatus=${params.eStatus}&pageNumber=${params.pageNumber}&search=${params.search}&sort=${params.sort}&orderBy=${params.orderBy}`
  )
}

export async function addAdmin(data) {
  return await axios.post('/admin/create', data)
}

export async function renewPackage(id) {
  return await axios.post('/admin/renew/package/' + id)
}
export async function modifyPackage(data) {
  const iAdminId = data?.iAdminId
  const iPackageId = data?.iPackageId
  return await axios.post('/admin/modify/package/' + iAdminId, { iPackageId })
}
export async function createCustomPackage(data) {
  return await axios.post('/package/customPackage', data)
}

export async function getAdminById(id) {
  return await axios.get('/admin/view/' + id)
}

export async function getPackageSelectList(id) {
  return await axios.get('/admin/dropdownPackage/' + id)
}
export async function getPackageSelectListAdd() {
  return await axios.get('/package/dropdownPackage')
}

export async function updateAdminById(data) {
  const id = data?.id
  delete data?.id
  return await axios.put('/admin/edit/' + id, data?.payload)
}

export async function changeAdminStatus(data) {
  const id = data?.id
  delete data?.id
  return await axios.post('/admin/changeStatus/' + id, { eStatus: data?.eStatus })
}

export async function changeAdminPass(data) {
  const id = data?.id
  delete data?.id
  return await axios.put('/admin/edit/' + id, { sPassword: data?.sPassword })
}

export async function deleteAdmin(id) {
  return await axios.delete('/admin/delete/' + id)
}
