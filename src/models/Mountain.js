import * as THREE from 'three'
import { TweenMax, Sine } from 'gsap'

class Mountain {
  constructor () {
    this.greyMat = new THREE.MeshLambertMaterial({
      color: 0xa99a9d,
      flatShading: THREE.FlatShading,
      wireframe: false,
      side: THREE.DoubleSide
    })

    this.threegroup = new THREE.Group()

    this.init()
  }

  init () {
    /* var boxGeom = new THREE.CylinderGeometry(20 + Math.random() * 50, 76 + Math.random() * 200, Math.random() * 400 + 50, 20, 20, false);
      */
    const zeroVector = new THREE.Vector3()
    const size = Math.random() * 200 + 100
    const heightScale = Math.random() * 0.5 + 2
    const boxGeom = new THREE.PlaneGeometry(size, size, 8 + Math.floor(Math.random() * 3), 8 + Math.floor(Math.random() * 3))

    for (let i = 0; i < boxGeom.vertices.length; i++) {
      const vertex = boxGeom.vertices[i]
      // vertex.x =0
      vertex.z = (-vertex.distanceTo(zeroVector) * 0.5) * heightScale + 15 + Math.random() * 3 - 6

      vertex.y += Math.random() * 10 - 5
      vertex.x += Math.random() * 10 - 5
      vertex.z += Math.random() * 20 - 10
    }
    boxGeom.computeFaceNormals()
    boxGeom.computeVertexNormals()

    this.boxMesh = new THREE.Mesh(boxGeom, this.greyMat)
    // const box = new THREE.Box3().setFromObject(this.boxMesh)
    // console.log(box)
    this.boxMesh.position.y = Math.random() * 15 + 10
    this.boxMesh.rotation.x = -Math.PI / 2
    this.threegroup.add(this.boxMesh)

    this.threegroup.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })

    // const rnd1 = Math.random() * 40 + 30 - (35)
    // const rnd2 = Math.random() * 10 + 10 - 5

    // TweenMax.to(this.threegroup.position, 12 + Math.random() * 10, {
    //   repeat: -1,
    //   yoyo: true,
    //   x: this.threegroup.position.x + rnd1,
    //   ease: Sine.easeInOut
    // })

    TweenMax.to(this.threegroup.position, 2 + Math.random() * 2, {
      repeat: -1,
      yoyo: true,
      overwrite: false,
      y: this.threegroup.position.y + 100,
      ease: Sine.easeInOut
    })
  }
}

export default Mountain
