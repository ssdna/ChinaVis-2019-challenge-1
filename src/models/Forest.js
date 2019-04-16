import * as THREE from 'three'
import Tree1 from './Tree1'
import { mergeMeshes } from '../utils/util'

class Forest {
  constructor (amount, pos, radius) {
    this._treeCache = []

    this.amount = amount
    this.pos = pos
    this.radius = radius

    if (!this._treeCache || this._treeCache.length < 5) {
      for (let i = 0; i < 10; i++) {
        const t = new Tree1()
        this._treeCache.push(t)
      }
    }

    this._yellowMat = new THREE.MeshLambertMaterial({
      color: 0xffde79,
      flatShading: THREE.FlatShading
    })

    this._greenMat = new THREE.MeshLambertMaterial({
      color: 0xa6d247,
      flatShading: THREE.FlatShading
    })
  }

  addTo (app) {
    let roots = []
    let crowns = []
    const downVector = new THREE.Vector3(0, -1, 0)
    for (let i = 0; i < this.amount; i++) {
      // var c = new Tree1();
      const c = {
        position: new THREE.Vector3()
      }

      c.position.y = 100
      const angle = Math.random() * 360
      const rRadius = Math.random() * this.radius
      c.position.x = this.pos.x + rRadius * Math.cos(angle)
      c.position.z = this.pos.z + rRadius * Math.sin(angle)

      app._scene.updateMatrixWorld()
      app._raycaster.set(c.position, downVector)
      var collisions = app._raycaster.intersectObject(app._env, true)

      if (collisions.length > 0) {
        if (collisions[0].object.name === 'island') {
          const rnd = Math.floor(Math.random() * this._treeCache.length)
          c.root = this._treeCache[rnd].root.clone()
          c.sphere = this._treeCache[rnd].sphere.clone()

          c.root.position.y = c.sphere.position.y = collisions[0].point.y + 6
          c.root.position.x = c.sphere.position.x = c.position.x
          c.root.position.z = c.sphere.position.z = c.position.z
          c.sphere.position.y += 4 + Math.random() * 4

          console.log(collisions[0].object.name)
          roots.push(c.root)
          crowns.push(c.sphere)
        }
      } else {
        console.log('NOT FOUND')
      }

      // console.log(collisions)
    }

    roots = mergeMeshes(roots)
    crowns = mergeMeshes(crowns)

    this.threegroup = new THREE.Group()
    this.roots = new THREE.Mesh(roots, this._yellowMat)
    this.crowns = new THREE.Mesh(crowns, this._greenMat)
    this.threegroup.add(this.roots)
    this.threegroup.add(this.crowns)

    this.threegroup.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }
}

export default Forest
