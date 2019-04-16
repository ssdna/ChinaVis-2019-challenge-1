import * as THREE from 'three'

export const drawCurve = (mPoints) => {
  var curve = new THREE.CatmullRomCurve3(mPoints)
  curve.curveType = 'chordal'

  var points = curve.getPoints(mPoints.length * 5)
  var geometry = new THREE.BufferGeometry().setFromPoints(points)
  var material = new THREE.LineBasicMaterial({ color: 0xff0000 })

  const curveObject = new THREE.Line(geometry, material)
  curveObject.position.set(-15, 0, -8)

  return curveObject
}

export const drawPoint = (opacity = 0.4, color = 0xff7744) => {
  var geometry = new THREE.BufferGeometry()
  var vertices = new Float32Array([
    THREE.Math.randFloatSpread(0.8),
    0,
    THREE.Math.randFloatSpread(0.8)
  ])
  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))

  var material = new THREE.PointsMaterial({
    size: 0.3,
    color: color,
    opacity: opacity,
    transparent: true,
    sizeAttenuation: true,
    depthTest: false
  })

  var mesh = new THREE.Points(geometry, material)
  // mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.1;
  return mesh
}

export const drawCube = (x, y, z) => {
  var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  var cube = new THREE.Mesh(geometry, material)
  cube.position.set(x - 15, y, z - 8)
  return cube
}
