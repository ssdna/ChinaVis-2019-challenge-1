import * as THREE from 'three'
import { TweenMax, Sine } from 'gsap'

class Cloud {
  constructor () {
    this.whiteMat = new THREE.MeshLambertMaterial({
      color: 0xfae2c8,
      flatShading: THREE.FlatShading,
      wireframe: false
    })

    var sphereGeom = new THREE.SphereGeometry(6 + Math.floor(Math.random() * 12), 8, 8)

    for (var i = 0; i < sphereGeom.vertices.length; i++) {
      var vertex = sphereGeom.vertices[i]
      vertex.y += Math.random() * 4 - 2
      vertex.x += Math.random() * 3 - 1.5
      vertex.z += Math.random() * 3 - 1.5
    }

    sphereGeom.computeFaceNormals()
    sphereGeom.computeVertexNormals()

    this.threegroup = new THREE.Mesh(sphereGeom, this.whiteMat)

    this.init()
  }

  init () {
    this.threegroup.position.y = 60 + Math.random() * 150
    this.threegroup.castShadow = true

    this.threegroup.scale.x = 1.3 + Math.random() * 2
    this.threegroup.scale.y = this.threegroup.scale.x / 2 + Math.random() * 0.5 - 0.25
    this.threegroup.scale.z = 0.7 + Math.random() * 0.8
    this.threegroup.rotation.y = Math.random() * 3
    this.threegroup.position.x = Math.random() * 800 - 400
    this.threegroup.position.z = Math.random() * 800 - 400

    const rnd1 = Math.random() * 40 + 30 - (35)
    const rnd2 = Math.random() * 10 + 10 - 10

    TweenMax.to(this.threegroup.position, 12 + Math.random() * 10, {
      repeat: -1,
      yoyo: true,
      x: this.threegroup.position.x + rnd1,
      ease: Sine.easeInOut
    })

    TweenMax.to(this.threegroup.position, 4 + Math.random() * 2, {
      repeat: -1,
      yoyo: true,
      overwrite: false,
      y: this.threegroup.position.y + rnd2,
      ease: Sine.easeInOut
    })
  }
}

export default Cloud
