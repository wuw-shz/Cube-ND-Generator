import * as sv from '@minecraft/server'
import {Graph} from './graph'
import {Vector3X} from './vector3'

const cos = Math.cos
const sin = Math.sin
const tick = () => sv.system.currentTick

type CubeT = number[]
enum ScreenMode {
   '2D',
   '3D',
}

class Cube<
   Config extends {
      dimension?: number
      screenMode?: ScreenMode
      size?: number
      speed?: number
      step?: number
      offset?: {x?: number; y?: number; z?: number}
   }
> {
   dimension: number
   screenMode: ScreenMode
   size: number
   speed: number
   step: number
   offset: {x: number; y: number; z: number}
   vertices: CubeT[]

   constructor(config?: Config) {
      this.dimension = config?.dimension ?? 3
      this.screenMode = config?.screenMode ?? ScreenMode['3D']
      this.size = config?.size ?? 10
      this.speed = config?.speed ?? 1
      this.step = config?.step ?? 10
      this.offset = {
         x: config.offset?.x ?? 0,
         y: config.offset?.y ?? 0,
         z: config.offset?.z ?? 0,
      }
      this.vertices = this.genVertices()
   }

   private genVertices(): CubeT[] {
      if (this.dimension === 0) {
         return [[0]]
      }
      const arr: CubeT[] = []
      for (let i = 0; i < 2 ** this.dimension; i++) {
         const pos: CubeT = []
         for (let j = 0; j < this.dimension; j++) {
            pos.push([-0.5, 0.5][(i >> j) & 1])
         }
         arr.push(pos)
      }

      return arr
   }

   to3D(point: CubeT): Vector3X {
      let loc: Vector3X = Vector3X.ZERO

      if (this.dimension === 0) {
         return Vector3X.ZERO
      } else if (this.dimension === 1) {
         loc.x = point[0]
      } else if (this.dimension === 2) {
         loc.x = point[0]
         loc.y = point[1]
      } else if (this.dimension === 3) {
         loc = new Vector3X(point)
      } else {
         const projected = new Vector3X(point.slice(0, 4))
         for (let i = this.dimension - 1; i >= 4; i--) {
            const factor = 1 / (2 - point[i])
            projected.mul(factor)
         }

         if (this.screenMode === ScreenMode['4D']) {
            const factor4D = 1 / (2 - projected.z)
            projected.mul(factor4D)
         }

         loc = projected
      }

      if (this.screenMode === ScreenMode['2D']) {
         loc.z = 0
         return loc
      }

      return loc
   }

   rotate(angle: number): CubeT[] {
      return this.vertices.map((point) => {
         if (this.dimension <= 1) return point
         for (let i = 0; i < this.dimension - 1; i++) {
            for (let j = i + 1; j < this.dimension; j++) {
               const cosA = cos(angle)
               const sinA = sin(angle)
               const newPoint = point.slice()

               newPoint[i] = cosA * point[i] - sinA * point[j]
               newPoint[j] = sinA * point[i] + cosA * point[j]
               point = newPoint
            }
         }
         return point
      })
   }

   genPoints(): number[][] {
      if (this.dimension === 0) return [[0]]
      const arr: number[][] = []
      for (let i = 0; i < 2 ** this.dimension; i++) {
         for (let j = 0; j < this.dimension; j++) {
            const n = i ^ (1 << j)
            if (i < n) {
               arr.push([i, n])
            }
         }
      }

      return arr
   }

   show(callback: (start: Vector3X, end: Vector3X, step: number) => void) {
      const points = this.genPoints()
      const rotatePoints = this.rotate((Date.now() * this.speed) / 10000)

      points.forEach(([i, j]) => {
         const p1 = new Vector3X(this.to3D(rotatePoints[i]))
            .mul(this.size)
            .add(this.offset)
         const p2 = new Vector3X(this.to3D(rotatePoints[j]))
            .mul(this.size)
            .add(this.offset)
         callback(p1, p2, this.step)
      })
   }
}

const cube = new Cube({
   dimension: 3,
   speed: 2,
   size: 5,
   step: 10,
   screenMode: ScreenMode['3D'],
   offset: {
      x: 8,
   },
})

const cube1 = new Cube({
   dimension: 3,
   speed: 1000,
   size: 5,
   step: 10,
   screenMode: ScreenMode['3D'],
   offset: {
      x: 0,
   },
})

sv.system.runInterval(() => {
   const g = new Graph('graph:test', 'script')

   cube.show(g.line.bind(g))
   // cube1.show(g.line.bind(g))
   g.show({
      color: {r: 92 / 255, g: 69 / 255, b: 222 / 255, a: 1},
      size: {width: 0.05, height: 0.05},
   })
})
