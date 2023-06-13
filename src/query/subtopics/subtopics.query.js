import axios from '../../axios'

export async function getSubTopicList(params) {
  return await axios.get(`/subtopics/list?size=${params.size}&pageNumber=${params.pageNumber}`)
}

export async function addSubTopic(data) {
  return await axios.post('/subtopics/create', data)
}

export async function getSubTopicSelectList() {
  return await axios.get('/subtopic/dropdownSubject')
}

export function deleteSubTopic({ id }) {
  return axios.delete('/subtopics/delete/' + id)
}

export async function viewSubtopicbyid(id) {
  return await axios.get('/subtopics/view/' + id)
}

export async function editSubtopicById(data) {
  return await axios.put('/subtopic/edit/' + data?.id, { iSubjectId: data?.iSubjectId, sSubtopic: data?.sSubtopic })
}

export async function getsubtopicsubjectdropdown() {
  return await axios.get('/subtopics/dropdownSubject')
}
