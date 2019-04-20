import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import 'three/examples/js/controls/OrbitControls.js'
import 'three/examples/js/renderers/CSS2DRenderer.js'
import Stats from 'three/examples/js/libs/stats.min.js'
import dat from 'three/examples/js/libs/dat.gui.min.js'
import {
  drawPoint,
  drawCurve
} from '../utils/draw'
import {
  findByTime
} from '../utils/util'

import store from '../store'

const OrbitControls = THREE.OrbitControls

const SCREEN_WIDTH = 1000
const SCREEN_HEIGHT = 600
const MAX_POINTS = 5000

window.drawCurve = drawCurve

/**
 *
 * 抽象Application类，主要用来完成THREE场景初始化（如camera、scene等）和应用的设置
 *
 * @class AbstractApplication
 */
class App3D {
  constructor (debug = false) {
    window.b = this
    let { timestamp, auto, ratio } = store.getters.all

    this.debug = debug
    this.pointsPool = []
    this._currentCurve = {}
    this.params = {
      reset () {
        store.dispatch('setState', {
          key: 'timestamp',
          value: 24000
        })
      },
      timestamp,
      ratio,
      auto () {
        store.dispatch('setState', {
          key: 'auto',
          value: !auto
        })
      }
    }

    this.init()
    this.createFloors()
    this.createPointPool()
    this.createRaycaster()
    this.createLabel()
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
    // var cameraFloor1 = new THREE.PerspectiveCamera(110, aspect, 0.1, 11)
    // cameraFloor1.position.set(0, 9.9, 0)
    // cameraFloor1.rotation.x = -Math.PI / 2
    // scene.add(cameraFloor1)

    // var cameraFloor2 = new THREE.PerspectiveCamera(110, aspect, 0.1, 11)
    // cameraFloor2.position.set(0, 19.9, 0)
    // cameraFloor2.rotation.x = -Math.PI / 2
    // scene.add(cameraFloor2)
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
    // document.body.appendChild(this._renderer.domElement)
    this._labelRenderer = new THREE.CSS2DRenderer()
    this._labelRenderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
    this._labelRenderer.domElement.style.position = 'absolute'
    this._labelRenderer.domElement.style.top = 0
    // document.body.appendChild(this._labelRenderer.domElement)
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
      // document.body.appendChild(this._stats.dom)
      // grid & axis helper
      // const gridHelper = new THREE.GridHelper(30, 30)
      // this._scene.add(gridHelper)
      // const axisHelper = new THREE.AxisHelper(30)
      // this._scene.add(axisHelper)
    }
    // control
    // this._controls = new OrbitControls(this._camera, this._renderer.domElement)
    // this._controls = new OrbitControls(this._camera, this._dom)
    // this._controls.update()
    // mouse
    this._mouse = new THREE.Vector2()
    // resize
    this._timeout_window_resize = null
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }

  mount (dom) {
    this._dom = dom
    this._controls = new OrbitControls(this._camera, this._dom)
    this._controls.update()
    this._dom.appendChild(this._renderer.domElement)
    this._dom.appendChild(this._labelRenderer.domElement)
    this._dom.appendChild(this._stats.dom)
    this._dom.addEventListener('mousemove', this.onMouseMove.bind(this), false)
  }

  createFloors () {
    // floor 1
    const mapFloor1 = new THREE.TextureLoader().load('public/img/floor1.jpg')
    mapFloor1.wrapS = mapFloor1.wrapT = THREE.RepeatWrapping
    mapFloor1.anisotropy = 16
    const materialFloor1 = new THREE.MeshPhongMaterial({ map: mapFloor1, side: THREE.DoubleSide, transparent: true })
    materialFloor1.opacity = 0.6
    const meshFloor1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(30, 16), materialFloor1)
    meshFloor1.position.set(-0.5, -0.1, -0.5)
    meshFloor1.rotation.x = -Math.PI / 2
    this._scene.add(meshFloor1)

    // floor 2
    const mapFloor2 = new THREE.TextureLoader().load('public/img/floor2.jpg')
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

  createRaycaster () {
    this._raycaster = new THREE.Raycaster()
    this._raycaster.params.Points.threshold = 0.1
  }

  createLabel () {
    this._labelDiv = document.createElement('div')
    this._labelDiv.className = 'label'
    // this._labelDiv.textContent = 'Person'
    this._labelDiv.style.marginTop = '-1em'
    this._label = new THREE.CSS2DObject(this._labelDiv)

    this._labelPoint = drawPoint(0)
    this._labelPoint.add(this._label)
    this._scene.add(this._labelPoint)
  }

  getPosition (item) {
    return [ item.y - 15, (item.z - 1) * 10, item.x - 8 ]
  }

  drawPoints () {
    const lastPointsNum = store.getters.getState('lastPointsNum')
    // 清空scene
    for (let i = 0; i < lastPointsNum; i++) {
      this.pointsPool[i].visible = false
    }
    // 查找
    const result = findByTime(window.data || {}, this.params.timestamp)
    store.dispatch('setState', {
      key: 'lastPointsNum',
      value: result.length
    })
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

  onMouseMove (event) {
    // event.preventDefault()
    this._mouse.x = (event.clientX / SCREEN_WIDTH) * 2 - 1
    this._mouse.y = -(event.clientY / SCREEN_HEIGHT) * 2 + 1
    // return false
  }

  animate () {
    requestAnimationFrame(this.animate.bind(this))

    this._raycaster.setFromCamera(this._mouse, this._camera)
    const intersections = this._raycaster.intersectObjects(this.pointsPool)
    const intersection = (intersections.length) > 0 ? intersections[ 0 ] : null
    if (intersection !== null) {
      this._labelPoint.position.copy(intersection.point)
      const log = intersection.object.userData.log
      this._labelDiv.textContent = 'ID: ' + log.id

      store.dispatch('setState', {
        key: 'currentLog',
        value: intersection.object.userData.log
      })

      const points = window.data[log.id].map(item => {
        return new THREE.Vector3(item.y, (item.z - 1) * 10, item.x)
      })
      this._scene.remove(this._currentCurve)
      this._currentCurve = drawCurve(points)
      this._scene.add(this._currentCurve)
    }

    if (this.debug) {
      this._stats.begin()
    }

    let { timestamp, auto, ratio } = store.getters.all
    if (window.data) {
      this.drawPoints()
    }

    if (auto) {
      this.params.timestamp += ratio
      store.dispatch('setState', {
        key: 'timestamp',
        value: timestamp + ratio
      })
    }

    this._renderer.clear()
    this._renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    this._renderer.render(this._scene, this._camera)
    this._labelRenderer.render(this._scene, this._camera)

    // // renderer.setViewport( 0, 0, 400, 300 );
    // renderer.setViewport( 0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
    // renderer.render( scene, cameraFloor1 );

    // // renderer.setViewport( 400, 0, 400, 300 );
    // renderer.setViewport( SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
    // renderer.render( scene, cameraFloor2 );

    if (this.debug) {
      this._stats.end()
    }
  }
}

export default App3D
