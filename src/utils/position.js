// const POSITIONS = ['room-main', 'room-A', 'room-B', 'room-C', 'room-D']
export const POSITIONS = {
  'room_main': '主会场',
  'room_A': '分会场A',
  'room_B': '分会场B',
  'room_C': '分会场C',
  'room_D': '分会场D',
  'check_in_area': '签到处',
  'posters_area': '海报区',
  'reception_desk': '服务台',
  'exhibition_hall': '展厅',
  'dining_hall': '餐厅',
  'leisure_area': '休闲区',
  'room1': 'room1',
  'room2': 'room2',
  'room3': 'room3',
  'room4': 'room4',
  'room5': 'room5',
  'room6': 'room6',
  'toilet1': '厕所1',
  'toilet2': '厕所2',
  'toilet3': '厕所3',
  'escalator1': '扶梯1',
  'escalator2': '扶梯2'
}

export const checkPosition = (position) => {
  const { x, y, z } = position
  if (x >= 2 && x <= 11 && y >= 19 && y <= 28 && z === 1) {
    return POSITIONS['room_main']
  }
  if (x >= 2 && x <= 3 && y >= 1 && y <= 5 && z === 1) {
    return POSITIONS['room_A']
  }
  if (x >= 4 && x <= 5 && y >= 1 && y <= 5 && z === 1) {
    return POSITIONS['room_B']
  }
  if (x >= 6 && x <= 7 && y >= 1 && y <= 5 && z === 1) {
    return POSITIONS['room_C']
  }
  if (x >= 8 && x <= 9 && y >= 1 && y <= 5 && z === 1) {
    return POSITIONS['room_D']
  }
  if (x >= 12 && x <= 13 && y >= 2 && y <= 5 && z === 1) {
    return POSITIONS['check_in_area']
  }
  if (x >= 3 && x <= 9 && y >= 7 && y <= 8 && z === 1) {
    return POSITIONS['posters_area']
  }
  if (x >= 14 && x <= 15 && y >= 19 && y <= 20 && z === 1) {
    return POSITIONS['reception_desk']
  }
  if (x >= 2 && x <= 11 && y >= 15 && y <= 18 && z === 1) {
    return POSITIONS['exhibition_hall']
  }
  if (x >= 2 && x <= 9 && y >= 1 && y <= 5 && z === 2) {
    return POSITIONS['dining_hall']
  }
  if (x >= 13 && x <= 15 && y >= 0 && y <= 5 && z === 2) {
    return POSITIONS['leisure_area']
  }
  if (x >= 6 && x <= 9 && y >= 10 && y <= 11 && z === 1) {
    return POSITIONS['room1']
  }
  if (x >= 10 && x <= 11 && y >= 10 && y <= 11 && z === 1) {
    return POSITIONS['room2']
  }
  if (x >= 14 && x <= 15 && y >= 21 && y <= 24 && z === 1) {
    return POSITIONS['room3']
  }
  if (x >= 14 && x <= 15 && y >= 25 && y <= 26 && z === 1) {
    return POSITIONS['room4']
  }
  if (x >= 10 && x <= 11 && y >= 1 && y <= 5 && z === 2) {
    return POSITIONS['room5']
  }
  if (x >= 6 && x <= 7 && y >= 10 && y <= 11 && z === 2) {
    return POSITIONS['room6']
  }
  if (x >= 4 && x <= 5 && y >= 10 && y <= 11 && z === 1) {
    return POSITIONS['toilet1']
  }
  if (x >= 14 && x <= 15 && y >= 27 && y <= 28 && z === 1) {
    return POSITIONS['toilet2']
  }
  if (x >= 4 && x <= 5 && y >= 10 && y <= 11 && z === 2) {
    return POSITIONS['toilet3']
  }
  if (x === 1 && y >= 10 && y <= 11 && (z === 1 || z === 2)) {
    return POSITIONS['escalator1']
  }
  if (x === 14 && y >= 10 && y <= 11 && (z === 1 || z === 2)) {
    return POSITIONS['escalator2']
  }
  return ''
}
