
var data; var position; var points = []
var formatedData = []
var globalData = {}

var MAX_POINTS = 5000
var pointsPool = []
var lastPointsNum = 0

function createPointsPool () {
  for (let i = 0; i < MAX_POINTS; i++) {
    const point = drawPoint()

    point.visible = false

    pointsPool.push(point)
    scene.add(point)
  }
}

var curveObject

async function getData () {
  const json = await fetch('./assets/json/log-day2.json')
  const data = await json.json()

  for (let i = 0, last = data[0], tmp = []; i < data.length; i++) {
    const cur = data[i]
    if (last.id !== cur.id) {
      globalData[last.id] = tmp

      tmp = []
      last = cur
    } else {
      tmp.push(cur)
    }
    i++
  }
  return data
}

async function init () {
  data = await getData()
}

function drawCurve (mPoints) {
  var curve = new THREE.CatmullRomCurve3(mPoints)
  curve.curveType = 'chordal'

  var points = curve.getPoints(mPoints.length * 5)
  var geometry = new THREE.BufferGeometry().setFromPoints(points)
  var material = new THREE.LineBasicMaterial({ color: 0xff0000 })

  // Create the final object to add to the scene
  curveObject = new THREE.Line(geometry, material)
  curveObject.position.set(-15, 0, -8)

  return curveObject
}

function drawPoint (opacity = 0.4, color = 0xff7744) {
  // This will add a starfield to the background of a scene
  var geometry = new THREE.BufferGeometry()
  var vertices = new Float32Array([
    THREE.Math.randFloatSpread(0.8),
    0,
    THREE.Math.randFloatSpread(0.8)
  ])
  // itemSize = 3 因为每个顶点都是一个三元组。
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

  // var labelDiv = document.createElement( 'div' );
  // labelDiv.className = 'label';
  // labelDiv.textContent = 'Person';
  // labelDiv.style.marginTop = '-1em';

  // var label = new THREE.CSS2DObject( labelDiv );
  // // label.position.set( 0, EARTH_RADIUS, 0 );
  // mesh.add( label );

  // scene.add( starField );
  return mesh
}

function drawCube (x, y, z) {
  var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  var cube = new THREE.Mesh(geometry, material)
  cube.position.set(x - 15, y, z - 8)
  return cube
}

function getPosition (item) {
  return [ item.y - 15, (item.z - 1) * 10, item.x - 8 ]
}

function draw () {
  // 清空scene
  for (let i = 0; i < lastPointsNum; i++) {
    pointsPool[i].visible = false
  }
  // 查找
  const result = findArrByTime(params.timestamp)
  lastPointsNum = result.length
  // console.log(result.length);
  // 绘制
  result.forEach((item, index) => {
    pointsPool[index].position.fromArray(getPosition(item))
    pointsPool[index].visible = true
    pointsPool[index].userData.log = item
  })
}

function findArrByTime (time) {
  return Object.values(globalData)
    .map(item => findByTime(item, time))
    .filter(item => item)
}

function findByTime (arr, time) {
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

async function main () {
  await init()
}

main()
