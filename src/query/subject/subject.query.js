import axios from '../../axios'

export async function getSubjectList(params) {
  return await axios.get(
    `/subject/list?size=${params.size}&eStatus=${params.eStatus}&pageNumber=${params.pageNumber}&search=${params.search}&sort=${params.sort}&orderBy=${params.orderBy}`
  )
}

export async function addSubject(data) {
  return await axios.post('/subject/create', data)
}

export async function viewSubjectById(id) {
  return await axios.get('/subject/view/' + id)
}

export async function editSubjectById(data) {
  return await axios.put('/subject/edit/' + data?.id, { sSubjectName: data?.sSubjectName, sSubjectInfo: data?.sSubjectInfo })
}

export async function updateSubjectById(data) {
  const id = data?.id
  delete data?.id
  return await axios.put('/subject/edit/' + id, data)
}

export function deleteSubject({ id }) {
  return axios.delete('/subject/delete/' + id)
}
