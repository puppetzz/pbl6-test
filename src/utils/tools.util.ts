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
