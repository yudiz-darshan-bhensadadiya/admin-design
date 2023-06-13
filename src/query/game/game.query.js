import axios from '../../axios'

export async function getGameList(params) {
  return await axios.get(
    `/game/list?size=${params.size}&eStatus=${params.eStatus}&pageNumber=${params.pageNumber}&search=${params.search}&dStartDate=${params.startDate}&endDate=${params.endDate}&sort=${params.sort}&orderBy=${params.orderBy}`
  )
}

export async function addGame(data) {
  return await axios.post('/game/create', data)
}
export async function updateGame(data) {
  return await axios.put(`/game/edit/${data.id}`, data.gameData)
}

export async function getGameById(id) {
  return await axios.get('/game/view/' + id)
}

export async function updateGameById(data) {
  const id = data?.id
  delete data?.id
  return await axios.put('/game/edit/' + id, data)
}

export function deleteGame({ id }) {
  return axios.delete('/game/delete/' + id)
}
