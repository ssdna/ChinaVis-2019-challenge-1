import * as THREE from 'three'

class Cube {
  constructor () {
    this.yellowMat = new THREE.MeshLambertMaterial({
      color: 0xffde79,
      flatShading: THREE.FlatShading
    })
    this.whiteMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      flatShading: THREE.FlatShading,
      wireframe: true
    })

    this.threegroup = new THREE.Group()

    var boxGeom = new THREE.BoxGeometry(2, 4, 2)
    this.boxMesh = new THREE.Mesh(boxGeom, this.yellowMat)
    this.boxMesh.position.y = 0
    this.threegroup.add(this.boxMesh)

    this.threegroup.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }
}

export default Cube
