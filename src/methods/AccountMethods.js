import { useAccountStore } from '@/stores/useAccountStore'

const proxyAddress = import.meta.env.VITE_PROXY_URL

const postMethod = (payload) => {
  return {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }
}

const putMethod = (payload) => {
  return {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }
}

const getMethod = () => {
  return {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }
}

export const getCustomer = async () => {
  try {
    const response = await fetch(proxyAddress + '/api/customer', getMethod())
    if (response.ok) {
      const data = await response.json()
      return { data: data, status: response.status }
    } else {
      return { status: response.status }
    }
  } catch (e) {
    console.error('Fetch', e)
  }
}

export const openAccount = async (payload) => {
  try {
    const response = await fetch(proxyAddress + '/api/account/add', postMethod(payload))
    if (response.status === 201) {
      const data = await response.json()
      return { data: data, status: response.status }
    } else {
      return { status: response.status}
    }
  } catch(e) {
    console.error('Fetch', e)
  }
}

export const getAccount = async () => {
  try {
    const store = useAccountStore()
    const response = await fetch(proxyAddress + '/api/account', postMethod(store.accountNumber))
    if (response.ok) {
      const data = await response.json()
      return { data: data, status: response.status }
    } else {
      return { status: response.status }
    }
  } catch (e) {
    console.error('Fetch', e)
  }
}

export const getTransactions = async () => {
  try {
    const store = useAccountStore()
    const response = await fetch(
      proxyAddress + '/api/account/transactions',
      postMethod(store.accountNumber)
    )
    if (response.ok) {
      const data = await response.json()
      return { data: data, status: response.status }
    } else {
      return { status: response.status }
    }
  } catch (e) {
    console.error('Fetch', e)
  }
}

export const getAllTransactions = async () => {
  try {
    const store = useAccountStore()
    const response = await fetch(
      proxyAddress + '/api/account/transactions/getall',
      postMethod(store.accountNumber)
    )
    if (response.ok) {
      const data = await response.json()
      return { data: data, status: response.status }
    } else {
      return { status: response.status }
    }
  } catch (e) {
    console.error('Fetch', e)
  }
}

export const getAccountHistory = async () => {
  try {
    const store = useAccountStore()
    const response = await fetch(
      proxyAddress + '/api/account/history',
      postMethod(store.accountNumber)
    )
    if (response.ok) {
      const data = await response.json()
      return { data: data, status: response.status }
    } else {
      return { status: response.status }
    }
  } catch (e) {
    console.error('Fetch', e)
  }
}

export const getAllAccounts = async () => {
  try {
    const response = await fetch(proxyAddress + '/api/account/getall', getMethod())
    if (response.ok) {
      const data = await response.json()
      return { data: data, status: response.status }
    } else {
      return { status: response.status }
    }
  } catch (e) {
    console.error('Fetch', e)
  }
}

export const deposit = async (payload) => {
  try {
    const response = await fetch(proxyAddress + '/api/account/deposit', putMethod(payload))
    if (response.ok) {
      const data = await response.json()
      return { data: data, status: response.status }
    } else {
      return { status: response.status }
    }
  } catch (e) {
    console.error('Fetch', e)
  }
}

export const withdraw = async (payload) => {
  try {
    const response = await fetch(proxyAddress + '/api/account/withdraw', putMethod(payload))
    if (response.ok) {
      const data = await response.json()
      return { data: data, status: response.status }
    } else {
      return { status: response.status }
    }
  } catch (e) {
    console.error('Fetch', e)
  }
}

export const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export const formatDate = (date) => {
  const options = { month: 'numeric', day: 'numeric' }
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
}

export const formatPercent = (percent) => {
  return new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(percent / 100)
}

export const cleanAmount = (amount) => {
  amount = amount.replaceAll(',', '')
  amount = amount.split('$')
  amount = amount[1]
  return amount
}
