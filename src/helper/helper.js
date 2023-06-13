import { queryClient } from 'App'
let nav

export function setNav(n) {
  nav = n
}

export function navigationTo(link) {
  nav(link)
}

export function removeToken() {
  localStorage.clear('')
  sessionStorage.clear('')
}

export function toaster(message, type) {
  queryClient.defaultOptions.message(message, type)
}

export function getDirtyFormValues(dirtyFields, allValues) {
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues
  return Object.fromEntries(Object.keys(dirtyFields).map((key) => [key, getDirtyFormValues(dirtyFields[key], allValues[key])]))
}
