export const getLevelLabel = (level: number) => {
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
