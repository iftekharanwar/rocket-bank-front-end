//Auth methods
import { isAuthenticatedStore } from '@/stores/isAuthenticatedStore'

const proxyURL = import.meta.env.VITE_PROXY_URL

export const signIn = async (username, password) => {
  try {
    const store = isAuthenticatedStore()
    const response = await fetch(proxyURL + '/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    if (response.status === 200) {
      const data = await response.json()
      store.isAuthenticated = true
      sessionStorage.setItem('isAuthenticated', JSON.stringify(store.isAuthenticated))
      return { data: data, isAuthenticated: store.isAuthenticated, status: response.status }
    } else {
      const data = await response.json()
      return { data: data, isAuthenticatedStore: store.isAuthenticated, status: response.status }
    }
  } catch (e) {
    console.error(e)
  }
}

export const signOut = () => {
  // eslint-disable-next-line no-unused-vars
  try {
    const store = isAuthenticatedStore()
    fetch(proxyURL + '/signout', {
      method: 'GET',
      credentials: 'include'
    })
    store.isAuthenticated = false
    sessionStorage.setItem('isAuthenticated', JSON.stringify(store.isAuthenticated))
  } catch (e) {
    console.error(e)
  }
}

export const createAccount = async (fname, lname, username, password) => {
  try {
    const response = await fetch(proxyURL + '/signup', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
        fname: fname,
        lname: lname
      })
    })

    if (response.status === 201) {
      const data = await response.json()
      return { data: data, status: response.status }
    } else {
      const data = response.json()
      return { data: data, status: response.status }
    }
  } catch (e) {
    console.error(e)
  }
}
