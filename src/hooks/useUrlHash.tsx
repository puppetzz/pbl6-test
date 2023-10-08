import { useRouter } from 'next/router'

export const useUrlHash = () => {
  const { asPath } = useRouter()
  return asPath.split('#')[1]
}
