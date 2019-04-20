const POSITIONS = ['room-main', 'room-A', 'room-B', 'room-C', 'room-D']

export const checkPosition = (position) => {
  const { x, y, z } = position
  if (x >= 2 && x <= 11 && y >= 19 && y <= 28 && z === 1) {
    return POSITIONS[0]
  }
  if (x >= 2 && x <= 3 && y >= 1 && y <= 5 && z === 1) {
    return POSITIONS[1]
  }
  if (x >= 4 && x <= 5 && y >= 1 && y <= 5 && z === 1) {
    return POSITIONS[2]
  }
  if (x >= 6 && x <= 7 && y >= 1 && y <= 5 && z === 1) {
    return POSITIONS[3]
  }
  if (x >= 8 && x <= 9 && y >= 1 && y <= 5 && z === 1) {
    return POSITIONS[4]
  }
  return ''
}
