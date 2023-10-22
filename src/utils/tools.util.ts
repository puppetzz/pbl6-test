import * as b from 'bcrypt'

export const hashedPassword = async (password: string) => {
  const hashedPassword = await b.hash(password, 10)
  return hashedPassword
}

export const comparePassword = async ({
  password,
  passwordHash
}: {
  password: string
  passwordHash: string
}) => {
  const isMatch = await b.compare(password, passwordHash)
  return isMatch
}

export const pagingDataReturn = <T>({
  items,
  page,
  total
}: {
  items: T
  page: number
  total: number
}) => {
  const totalPage = Math.ceil(total / 10)
  return {
    items,
    page,
    total,
    totalPage,
    hasMore: page < totalPage
  }
}

export const getLocalItem = (key: string) => {
  const value = JSON.parse(window.localStorage.getItem(key) || 'null')
  return value
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setLocalItem = (key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}
