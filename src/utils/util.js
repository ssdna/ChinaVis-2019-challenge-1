import * as THREE from 'three'

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
