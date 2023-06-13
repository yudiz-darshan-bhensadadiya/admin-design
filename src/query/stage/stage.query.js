import axios from '../../axios'

export async function getStageList(params) {
  return await axios.get(
    `/stage/list?size=${params.size}&eStatus=${params.eStatus}&pageNumber=${params.pageNumber}&search=${params.search}&sort=${params.sort}&orderBy=${params.orderBy}`
  )
}

export async function deleteStage(data) {
  return await axios.delete(`/stage/delete/${data?.id}`)
}
export async function getSubjectList() {
  return await axios.get('/subtopics/dropdownSubject')
}

export async function getSubtopicList(id) {
  return await axios.get(`/stage/dropdownSubtopic/${id}`)
}

export async function getStageDropDownList(id) {
  return await axios.get('/stage/dropDownStag/' + id)
}

export async function createStage(data) {
  return await axios.post('/stage/create', data)
}

export async function getStage(id) {
  return await axios.get(`/stage/view/` + id)
}

export async function updateStage(data) {
  return await axios.put(`/stage/edit/${data.id}`, data)
}

export async function updateQuestion(data) {
  return await axios.put(`/stage/edit/${data.id}`, data?.updateQuestion)
}

export async function checkStage(data) {
  return await axios.post(`stage/CreateStageName`, data)
}
