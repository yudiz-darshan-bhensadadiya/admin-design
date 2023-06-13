import axios from '../../axios'

export async function getGameFeatureById(id) {
  return await axios.get('cms/get/' + id)
}

export async function editGameFeature(data) {
  const id = data?.id
  delete data?.id
  return await axios.put('/cms/edit/' + id, data)
}
