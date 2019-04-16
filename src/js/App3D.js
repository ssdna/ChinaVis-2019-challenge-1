import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/js/libs/stats.min.js'
import dat from 'three/examples/js/libs/dat.gui.min.js'
import {
  drawPoint
} from '../utils/draw'
import {
  findByTime
} from '../utils/util'

import store from '../store'

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight
const MAX_POINTS = 5000

const timerDOM = document.getElementById('timer')
const contentDOM = document.getElementById('content')

/**
 *
 * 抽象Application类，主要用来完成THREE场景初始化（如camera、scene等）和应用的设置
 *
 * @class AbstractApplication
 */
class App3D {
  constructor (debug = false) {
    this.debug = debug
    this.pointsPool = []
    this.lastPointsNum = 0
    this.params = {
      reset () {
        this.params.current = 0
        this.params.timestamp = 40000
      },
      current: 0,
      timestamp: 40000,
      ratio: 24,
      auto: true
    }

    this.init()
    this.createFloors()
    this.createPointPool()
  }

  get renderer () {
    return this._renderer
  }

  get camera () {
    return this._camera
  }

  get scene () {
    return this._scene
  }

  init () {
    const aspect = SCREEN_WIDTH / SCREEN_HEIGHT
    // camera
    this._camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000)
    this._camera.position.set(-19, 25, 28)
    this._camera.rotation.set(-0.78, -0.41, -0.38)
    // scene
    this._scene = new THREE.Scene()
    this._scene.background = new THREE.Color(0xf0f0f0)
    // light
    const ambientLight = new THREE.AmbientLight(0xf0f0f0)
    this._scene.add(ambientLight)
    // renderer
    this._renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })
    this._renderer.setPixelRatio(window.devicePixelRatio)
    this._renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
    this._renderer.setClearColor(0x000000, 0)
    this._renderer.autoClear = false
    document.body.appendChild(this._renderer.domElement)
    // debug mode
    if (this.debug) {
      // dat.GUI
      this._gui = new dat.GUI()
      this._gui.add(this.params, 'reset')
      this._gui.add(this.params, 'timestamp', 20000, 70000).step(10)
      this._gui.add(this.params, 'ratio', 1, 60).step(1)
      this._gui.add(this.params, 'auto')
      this._gui.open()
      // Stats
      this._stats = new Stats()
      document.body.appendChild(this._stats.dom)
      // grid & axis helper
      // const gridHelper = new THREE.GridHelper(30, 30)
      // this._scene.add(gridHelper)
      // const axisHelper = new THREE.AxisHelper(30)
      // this._scene.add(axisHelper)
    }
    // control
    this._controls = new OrbitControls(this._camera, this._renderer.domElement)
    this._controls.update()
    // resize
    this._timeout_window_resize = null
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }

  createFloors () {
    // floor 1
    const mapFloor1 = new THREE.TextureLoader().load('public/floor1.jpg')
    mapFloor1.wrapS = mapFloor1.wrapT = THREE.RepeatWrapping
    mapFloor1.anisotropy = 16
    const materialFloor1 = new THREE.MeshPhongMaterial({ map: mapFloor1, side: THREE.DoubleSide, transparent: true })
    materialFloor1.opacity = 0.6
    const meshFloor1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(30, 16), materialFloor1)
    meshFloor1.position.set(-0.5, -0.1, -0.5)
    meshFloor1.rotation.x = -Math.PI / 2
    this._scene.add(meshFloor1)

    // floor 2
    const mapFloor2 = new THREE.TextureLoader().load('public/floor2.jpg')
    mapFloor2.wrapS = mapFloor2.wrapT = THREE.RepeatWrapping
    mapFloor2.anisotropy = 16
    const materialFloor2 = new THREE.MeshPhongMaterial({ map: mapFloor2, side: THREE.DoubleSide, transparent: true })
    materialFloor2.opacity = 0.6
    const meshFloor2 = new THREE.Mesh(new THREE.PlaneBufferGeometry(30, 16), materialFloor2)
    meshFloor2.position.set(-0.5, 10 - 0.1, -0.5)
    meshFloor2.rotation.x = -Math.PI / 2
    this._scene.add(meshFloor2)
  }

  createPointPool () {
    for (let i = 0; i < MAX_POINTS; i++) {
      const point = drawPoint()
      point.visible = false
      this.pointsPool.push(point)
      this._scene.add(point)
    }
  }

  getPosition (item) {
    return [ item.y - 15, (item.z - 1) * 10, item.x - 8 ]
  }

  drawPoints () {
    // 清空scene
    for (let i = 0; i < this.lastPointsNum; i++) {
      this.pointsPool[i].visible = false
    }
    // 查找
    const result = Object.values(store.getters.getData)
      .map(item => findByTime(item, this.params.timestamp))
      .filter(item => item)
    this.lastPointsNum = result.length
    // console.log(result.length);
    // 绘制
    result.forEach((item, index) => {
      this.pointsPool[index].position.fromArray(this.getPosition(item))
      this.pointsPool[index].visible = true
      this.pointsPool[index].userData.log = item
    })
  }

  onWindowResize () {
    clearTimeout(this._timeout_window_resize)
    setTimeout(() => {
      this._camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT
      this._camera.updateProjectionMatrix()

      this._renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
    }, this._timeout_window_resize)
  }

  animate () {
    requestAnimationFrame(this.animate.bind(this))

    if (this.debug) {
      this._stats.begin()
    }

    let { timestamp, auto, ratio } = this.params
    this.drawPoints()

    timerDOM.textContent = `
      ${Math.floor(timestamp / 3600)}
      :
      ${Math.floor(timestamp % 3600 / 60)}
      :
      ${timestamp % 60}
    `
    contentDOM.textContent = `
      当前总人数：${this.lastPointsNum}
    `
    if (auto) {
      this.params.timestamp += ratio
    }

    this._renderer.clear()
    this._renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    this._renderer.render(this._scene, this._camera)

    if (this.debug) {
      this._stats.end()
    }
  }
}

export default App3D
