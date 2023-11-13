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

export const levelTransformerToString = (level: number) => {
  switch (level) {
    case 0:
      return 'Beginner'
    case 1:
      return 'Intermediate'
    case 2:
      return 'Advanced'
    default:
      return 'Beginner'
  }
}

export const levelTransformerToNumber = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 0
    case 'Intermediate':
      return 1
    case 'Advanced':
      return 2
    default:
      return 0
  }
}
