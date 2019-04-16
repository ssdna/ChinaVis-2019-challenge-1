import * as THREE from 'three'
import AbstractApplication from './AbstractApplication'
import Cube from '../models/Cube'
import Forest from '../models/Forest'
import Mountain from '../models/Mountain'
import Cloud from '../models/Cloud'

class Application extends AbstractApplication {
  constructor (debug) {
    super(debug)

    this._scene.fog = new THREE.Fog(0xece9ca, 500, 4000)
    this._raycaster = new THREE.Raycaster()

    // console.log(store)

    // this.createCube()
    this.createLights()
    this.createFloor()
    this.createTree()
    this.createMountain()
    this.createCloud()

    if (this.debug) {
      this.initGUI()
    }

    this.animate()
  }

  initGUI () {
    const API = {
      mountainX: 100
    }

    this._gui.add(API, 'mountainX')
  }

  createLights () {
    this._light = new THREE.HemisphereLight(0xffffff, 0xb3858c, 0.65)

    this._shadowLight = new THREE.DirectionalLight(0xffe79d, 0.7)
    this._shadowLight.position.set(80, 120, 50)
    this._shadowLight.castShadow = true
    // this._shadowLight.shadowDarkness = 0.3
    this._shadowLight.shadow.mapSize.width = 2048
    this._shadowLight.shadow.mapSize.height = 2048

    this._backLight = new THREE.DirectionalLight(0xffffff, 0.4)
    this._backLight.position.set(200, 100, 100)
    // this._backLight.shadowDarkness = 0.1
    // this._backLight.castShadow = true

    this._scene.add(this._backLight)
    this._scene.add(this._light)
    this._scene.add(this._shadowLight)
  }

  createFloor () {
    if (this._env) {
      this._scene.remove(this._env)
      this._env = null
    }
    this._env = new THREE.Group()

    const waterGeo = new THREE.BoxGeometry(1000, 1000, 100, 22, 22)
    for (let i = 0; i < waterGeo.vertices.length; i++) {
      const vertex = waterGeo.vertices[i]
      if (vertex.z > 0) { vertex.z += Math.random() * 2 - 1 }
      vertex.x += Math.random() * 5 - 2.5
      vertex.y += Math.random() * 5 - 2.5

      vertex.wave = Math.random() * 100
    }

    waterGeo.computeFaceNormals()
    waterGeo.computeVertexNormals()

    const floor = new THREE.Mesh(waterGeo, new THREE.MeshLambertMaterial({
      color: 0x6092c1,
      flatShading: THREE.FlatShading,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    }))
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -105
    floor.receiveShadow = true
    floor.name = 'Floor'
    this._env.floor = floor

    this._env.add(floor)

    const islandGeo = new THREE.PlaneGeometry(700, 700, 60, 60)
    const zeroVector = new THREE.Vector3()

    const mods = []
    let modVector = null
    let modAmount = Math.floor(Math.random() * 6 + 1)

    for (let j = 0; j < modAmount; j++) {
      modVector = new THREE.Vector3(Math.random() * 350, Math.random() * 350, 0)
      modVector.radius = Math.random() * 400
      modVector.dir = Math.random() * 1 - 0.6 + modVector.radius / 5000
      mods.push(modVector)
    }

    let midY = 0
    console.warn('no unused vars: midY = ' + midY)

    for (let i = 0; i < islandGeo.vertices.length; i++) {
      let vertex = islandGeo.vertices[i]
      // if(vertex.distanceTo(zeroVector) < 300)
      // {

      vertex.z = -vertex.distanceTo(zeroVector) * 0.15 + 15 + Math.random() * 3 - 6

      for (var j = 0; j < mods.length; j++) {
        modVector = mods[j]

        if (vertex.distanceTo(modVector) < modVector.radius) { vertex.z += vertex.distanceTo(modVector) / 2 * modVector.dir }
      }

      // }

      vertex.y += Math.random() * 20 - 10
      vertex.x += Math.random() * 20 - 10
      midY += vertex.z
    }

    midY = midY / islandGeo.vertices.length

    islandGeo.computeFaceNormals()
    islandGeo.computeVertexNormals()
    const island = new THREE.Mesh(islandGeo, new THREE.MeshLambertMaterial({
      color: 0x9bb345,
      flatShading: THREE.FlatShading,
      side: THREE.DoubleSide,
      wireframe: false
    }))
    island.rotation.x = -Math.PI / 2
    island.position.y = -14
    island.receiveShadow = true
    island.castShadow = true
    island.name = 'island'
    this._env.island = island
    this._env.add(island)

    this._scene.add(this._env)
  }

  createCube () {
    const cube = new Cube()
    this._scene.add(cube.threegroup)
  }

  createTree () {
    const forest = new Forest(Math.random() * 20 + 10, new THREE.Vector3(0, 0, 0), 700)
    forest.addTo(this)
    this._env.add(forest.threegroup)

    const extraForests = Math.floor(Math.random() * 15)
    for (let i = 0; i < extraForests; i++) {
      const forest = new Forest(Math.random() * 100, new THREE.Vector3(Math.random() * 500 - 250, 0, Math.random() * 500 - 250), Math.random() * 300)
      forest.addTo(this)
      this._env.add(forest.threegroup)
    }
  }

  createMountain () {
    // const num = Math.floor(Math.random() * 5 - 2)
    const num = 1
    console.log('Mountain: ', num)

    for (let i = 0; i < num; i++) {
      const mountain = new Mountain()
      this._env.add(mountain.threegroup)
      mountain.threegroup.position.x = Math.random() * 600 - 350
      mountain.threegroup.position.z = Math.random() * 600 - 350
      mountain.threegroup.position.y = 30
    }
  }

  createCloud () {
    let num = 1 + Math.floor(Math.random() * 5)
    console.log('Cloud: ', num)
    for (let i = 0; i < num; i++) {
      const c = new Cloud()
      this._env.add(c.threegroup)
    }
  }
}

export default Application
