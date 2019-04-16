import * as THREE from 'three'

class Tree1 {
  constructor () {
    const height = 9 + Math.random() * 8
    const boxGeom = new THREE.BoxGeometry(2, height, 1)
    this.root = new THREE.Mesh(boxGeom, this.yellowMat)
    this.root.position.y = 0

    const sphereGeometry = new THREE.SphereGeometry(6, 8)

    for (let i = 0; i < sphereGeometry.vertices.length; i++) {
      const vertex = sphereGeometry.vertices[i]
      vertex.y += Math.random() * 3 - 1.5
      vertex.x += Math.random() * 1 - 0.5
      vertex.z += Math.random() * 1 - 0.5
    }

    sphereGeometry.computeFaceNormals()
    sphereGeometry.computeVertexNormals()

    this.sphereGeometry = sphereGeometry
    this.sphere = new THREE.Mesh(sphereGeometry, this.greenMat)
    this.sphere.position.y = height / 2 + 2
    this.sphere.scale.y = 0.75 + Math.random() * 0.5
  }
}

export default Tree1
