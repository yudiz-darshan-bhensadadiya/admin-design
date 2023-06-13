import axios from '../../axios'

export async function getInquiryList(params) {
  return await axios.get(
    `/inquiry/list?size=${params.size}&eStatus=${params.eStatus}&pageNumber=${params.pageNumber}&search=${params.search}&sort=${params.sort}&orderBy=${params.orderBy}`
  )
}
export async function getInquiryById(id) {
  return await axios.get(`inquiry/view/` + id)
}

export function deleteInquiry({ id }) {
  return axios.delete('/inquiry/delete/' + id)
}
