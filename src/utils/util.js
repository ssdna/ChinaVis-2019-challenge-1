import * as THREE from 'three'

export const parseCSV = (csv) => {
  const [title, ...content] = csv.trim().split(/\r?\n/)
  const keys = title.split(',')

  const data = content.map(item => {
    const values = item.split(',').map(i => parseInt(i))

    let obj = {}
    for (let i = 0; i < keys.length; i++) {
      obj[keys[i]] = values[i]
    }
    // sid 按规则解析（这样可以不用引入position.csv）：
    // 21404 => 表示 2层 x=14 y=04
    const sid = obj.sid
    obj.x = Math.floor(sid / 100) % 100
    obj.y = sid % 100
    obj.z = Math.floor(sid / 10000)

    return obj
  }).sort((a, b) => {
    // id升序+time升序
    if (a.id - b.id > 0) {
      return 1
    } else if (a.id - b.id < 0) {
      return -1
    } else if (a.id - b.id === 0) {
      return a.time - b.time
    }
  })

  return data
}

/**
 * 按人员id编号做简单hash
 * >>>>>>
 * from: [{"id":10000,"sid":11300,"time":32070,"x":13,"y":0,"z":1}, ...]
 * ======
 * to: {10000:[{"id":10000,"sid":11300,"time":32070,"x":13,"y":0,"z":1}, ...], ...}
 * <<<<<<
 * @param {Array} data 日志数据
 */
export const hashById = (data) => {
  let global = {}
  for (let i = 0, last = data[0], tmp = []; i < data.length; i++) {
    const cur = data[i]
    if (last.id !== cur.id) {
      global[last.id] = tmp

      tmp = []
      last = cur
    } else {
      tmp.push(cur)
    }
    i++
  }
  return global
}

export const mergeMeshes = (meshes) => {
  var combined = new THREE.Geometry()

  for (var i = 0; i < meshes.length; i++) {
    meshes[i].updateMatrix()
    combined.merge(meshes[i].geometry, meshes[i].matrix)
  }

  return combined
}

export const clamp = (v, min, max) => {
  return Math.min(Math.max(v, min), max)
}

export const rule3 = (v, vmin, vmax, tmin, tmax) => {
  var nv = Math.max(Math.min(v, vmax), vmin)
  var dv = vmax - vmin
  var pc = (nv - vmin) / dv
  var dt = tmax - tmin
  var tv = tmin + (pc * dt)
  return tv
}

export const findByTime = (arr, time) => {
  let left = 0; let right = arr.length - 1; let mid = Math.floor((left + right) / 2)

  while (left <= right) {
    const m = arr[mid]
    if (time === m.time) {
      return m
    }
    if (time > m.time) {
      if (mid + 1 < arr.length && time < arr[mid + 1].time) {
        return m
      }
      left = mid + 1
    }
    if (time < m.time) {
      if (mid - 1 >= 0 && time > arr[mid - 1].time) {
        return arr[mid - 1]
      }
      right = mid - 1
    }
    mid = Math.floor((left + right) / 2)
  }
  return false
}
