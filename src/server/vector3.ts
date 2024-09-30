import {Vector2, Vector3, system} from '@minecraft/server'
import {Vector2X} from './vector2'

const cos = Math.cos
const sin = Math.sin
const atan2 = Math.atan2
const sqrt = Math.sqrt
const pi = Math.PI
const tick = () => system.currentTick
const deg2rad = (deg: number) => (deg * pi) / 180
const rad2deg = (rad: number) => (rad * 180) / pi

type VectorT = Vector3 | [number, number, number]

export class Vector3X implements Vector3 {
   private values: {x: number; y: number; z: number; name?: string} = {
      x: 0,
      y: 0,
      z: 0,
      name: undefined,
   }
   private vectors: {x: number; y: number; z: number} = {x: 0, y: 0, z: 0}

   static get ZERO() {
      return new Vector3X(0, 0, 0)
   }

   static get FORWARD() {
      return new Vector3X(0, 0, 1)
   }

   static get UP() {
      return new Vector3X(0, 1, 0)
   }

   static get FORWARD_UP() {
      return new Vector3X(0, 1, 1)
   }

   static get RIGHT() {
      return new Vector3X(1, 0, 0)
   }

   static get FORWARD_RIGHT() {
      return new Vector3X(1, 0, 1)
   }

   static get RIGHT_UP() {
      return new Vector3X(1, 1, 0)
   }

   static get ONE() {
      return new Vector3X(1, 1, 1)
   }

   static get BACKWARD() {
      return new Vector3X(0, 0, -1)
   }

   static get DOWN() {
      return new Vector3X(0, -1, 0)
   }

   static get BACKWARD_DOWN() {
      return new Vector3X(0, -1, -1)
   }

   static get LEFT() {
      return new Vector3X(-1, 0, 0)
   }

   static get LEFT_BACKWARD() {
      return new Vector3X(-1, 0, -1)
   }

   static get LEFT_DOWN() {
      return new Vector3X(-1, -1, 0)
   }

   static get ONE_NEG() {
      return new Vector3X(-1, -1, -1)
   }

   static get INFINITY() {
      return new Vector3X(Infinity, Infinity, Infinity)
   }

   static get INFINITY_NEG() {
      return new Vector3X(-Infinity, -Infinity, -Infinity)
   }

   static from(location: VectorT) {
      if (Array.isArray(location)) {
         return new Vector3X(location[0], location[1], location[2])
      }
      return new Vector3X(location.x, location.y, location.z)
   }

   static add(a: VectorT, b: VectorT | number) {
      return Vector3X.from(a).add(b)
   }

   static subtract(a: VectorT, b: VectorT | number) {
      return Vector3X.from(a).subtract(b)
   }

   static multiply(a: VectorT, b: VectorT | number) {
      return Vector3X.from(a).multiply(b)
   }

   static divide(a: VectorT, b: VectorT | number) {
      return Vector3X.from(a).divide(b)
   }

   static equals(a: VectorT, b: VectorT) {
      return Vector3X.from(a).equals(b)
   }

   static scale(a: VectorT, b: VectorT | number) {
      return Vector3X.from(a).multiply(b)
   }

   static magnitude(a: VectorT) {
      return Vector3X.from(a).length
   }

   static distance(a: VectorT, b: VectorT) {
      return Vector3X.from(a).distance(b)
   }

   static distanceSquared(a: VectorT, b: VectorT) {
      return Vector3X.from(a).distanceSquared(b)
   }

   static dot(a: VectorT, b: VectorT) {
      return Vector3X.from(a).dot(b)
   }

   static cross(a: VectorT, b: VectorT) {
      return Vector3X.from(a).cross(b)
   }

   static angle(a: VectorT, b: VectorT) {
      return Vector3X.from(a).angle(b)
   }

   static min(a: VectorT, b: VectorT) {
      return Vector3X.from(a).min(b)
   }

   static max(a: VectorT, b: VectorT) {
      return Vector3X.from(a).max(b)
   }

   static random(min: number = 1, max: number = 1) {
      return new Vector3X(
         Math.random() * (max - min) + min,
         Math.random() * (max - min) + min,
         Math.random() * (max - min) + min
      )
   }

   static fromAngleXZ(angle: number) {
      return Vector3X.from([cos(angle), 0, sin(angle)])
   }

   static fromAngleY(angle: number) {
      return Vector3X.from([0, cos(angle), sin(angle)])
   }

   constructor(vec: Vector3, name?: string)
   constructor(vec: number[], name?: string)
   constructor(x: number, y: number, z: number, name?: string)
   constructor(
      first: number | Vector3 | number[],
      y?: number | string,
      z?: number,
      name?: string
   ) {
      if (typeof first === 'object') {
         if (first instanceof Array) {
            this.values = {
               x: first[0],
               y: first[1],
               z: first[2],
               name: y as string,
            }

            this.vectors = {
               x: first[0],
               y: first[1],
               z: first[2],
            }
            return
         }
         this.values = {x: first.x, y: first.y, z: first.z, name: y as string}
         this.vectors = first
      } else {
         this.values = {x: first, y: y as number, z, name}
         this.vectors = {x: first, y: y as number, z}
      }
   }

   get name() {
      return this.values.name
   }
   set name(value: string) {
      this.values.name = value
   }

   get x() {
      return this.values.x
   }
   set x(value: number) {
      this.values.x = value
   }

   get y() {
      return this.values.y
   }
   set y(value: number) {
      this.values.y = value
   }

   get z() {
      return this.values.z
   }
   set z(value: number) {
      this.values.z = value
   }

   get lengthSquared() {
      return this.x * this.x + this.y * this.y + this.z * this.z
   }

   get length() {
      return Math.hypot(this.x, this.y, this.z)
   }
   set length(value: number) {
      const length = this.length
      this.x = (this.x / length) * value
      this.y = (this.y / length) * value
      this.z = (this.z / length) * value
   }

   get deg2rad() {
      return new Vector3X(deg2rad(this.x), deg2rad(this.y), deg2rad(this.z))
   }

   get rad2deg() {
      return new Vector3X(rad2deg(this.x), rad2deg(this.y), rad2deg(this.z))
   }

   normalized() {
      const lengthSqrd = this.lengthSquared
      return this.divide(lengthSqrd === 0 ? 1 : Math.sqrt(lengthSqrd))
   }

   clone() {
      return new Vector3X(this.vectors)
   }

   equals(vector: VectorT) {
      const vec = Vector3X.from(vector)
      return this.x === vec.x && this.y === vec.y && this.z === vec.z
   }

   offset(x: number, y: number, z: number) {
      this.add(new Vector3X(x, y, z))
      return this
   }

   distance(vector: VectorT) {
      return this.subtract(vector).length
   }

   distanceSquared(vector: VectorT) {
      return this.subtract(vector).lengthSquared
   }

   add(vector: VectorT | number) {
      if (typeof vector === 'number') {
         return new Vector3X(this.x + vector, this.y + vector, this.z + vector)
      } else {
         vector = Vector3X.from(vector)
         return new Vector3X(
            this.x + vector.x,
            this.y + vector.y,
            this.z + vector.z
         )
      }
   }

   sub = (vector: VectorT | number) => this.subtract(vector)
   subtract(vector: VectorT | number) {
      if (typeof vector === 'number') {
         return new Vector3X(this.x - vector, this.y - vector, this.z - vector)
      } else {
         vector = Vector3X.from(vector)
         return new Vector3X(
            this.x - vector.x,
            this.y - vector.y,
            this.z - vector.z
         )
      }
   }

   mul = (vector: VectorT | number) => this.multiply(vector)
   multiply(vector: VectorT | number) {
      if (typeof vector === 'number') {
         return new Vector3X(this.x * vector, this.y * vector, this.z * vector)
      } else {
         vector = Vector3X.from(vector)
         return new Vector3X(
            this.x * vector.x,
            this.y * vector.y,
            this.z * vector.z
         )
      }
   }

   div = (vector: VectorT | number) => this.divide(vector)
   divide(vector: VectorT | number) {
      if (typeof vector === 'number') {
         return new Vector3X(this.x / vector, this.y / vector, this.z / vector)
      } else {
         vector = Vector3X.from(vector)
         return new Vector3X(
            this.x / vector.x,
            this.y / vector.y,
            this.z / vector.z
         )
      }
   }

   scale(scale: number) {
      return new Vector3X(this.x * scale, this.y * scale, this.z * scale)
   }

   dot(vector: VectorT) {
      vector = Vector3X.from(vector)
      return this.x * vector.x + this.y * vector.y + this.z * vector.z
   }

   cross(vector: VectorT) {
      vector = Vector3X.from(vector)
      return new Vector3X(
         this.y * vector.z - this.z * vector.y,
         this.z * vector.x - this.x * vector.z,
         this.x * vector.y - this.y * vector.x
      )
   }

   lerp(vector: VectorT, t: number) {
      vector = Vector3X.from(vector)
      return new Vector3X(
         (1 - t) * this.x + t * vector.x,
         (1 - t) * this.y + t * vector.y,
         (1 - t) * this.z + t * vector.z
      )
   }

   angle(vector: VectorT) {
      vector = Vector3X.from(vector)
      return Math.acos(
         this.dot(vector) / (this.length * new Vector3X(vector).length)
      )
   }

   rotateX(angle: number, origin: VectorT = Vector3X.ZERO) {
      if (!angle) return this.clone()
      origin = Vector3X.from(origin)
      const ang = deg2rad(angle)
      const y = this.y - origin.y
      const z = this.z - origin.z
      this.y = y * cos(ang) - z * sin(ang) + origin.y
      this.z = y * sin(ang) + z * cos(ang) + origin.z

      return this
   }

   rotateY(angle: number, origin: VectorT = Vector3X.ZERO) {
      if (!angle) return this.clone()
      origin = Vector3X.from(origin)
      const ang = deg2rad(angle)
      const x = this.x - origin.x
      const z = this.z - origin.z
      this.x = z * sin(ang) + x * cos(ang) + origin.x
      this.z = z * cos(ang) - x * sin(ang) + origin.z

      return this
   }

   rotateZ(angle: number, origin: VectorT = Vector3X.ZERO) {
      if (!angle) return this.clone()
      origin = Vector3X.from(origin)
      const ang = deg2rad(angle)
      const x = this.x - origin.x
      const y = this.y - origin.y
      this.x = x * cos(ang) - y * sin(ang) + origin.x
      this.y = x * sin(ang) + y * cos(ang)
      ;+origin.y

      return this
   }

   parametric(angle: Vector2, scale: number) {
      if (!angle) return this.clone()
      const ang = new Vector2X(angle).deg2rad
      const x = -scale * cos(ang.x) * sin(ang.y) + this.x
      const y = scale * sin(-ang.x) + this.y
      const z = -scale * cos(ang.x) * cos(ang.y + pi) + this.z
      this.x = x
      this.y = y
      this.z = z

      return this
   }

   min(vector: VectorT) {
      vector = Vector3X.from(vector)
      return new Vector3X(
         Math.min(this.x, vector.x),
         Math.min(this.y, vector.y),
         Math.min(this.z, vector.z)
      )
   }

   max(vector: VectorT) {
      vector = Vector3X.from(vector)
      return new Vector3X(
         Math.max(this.x, vector.x),
         Math.max(this.y, vector.y),
         Math.max(this.z, vector.z)
      )
   }

   abs() {
      return new Vector3X(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z))
   }

   floor() {
      return new Vector3X(
         Math.floor(this.x),
         Math.floor(this.y),
         Math.floor(this.z)
      )
   }

   ceil() {
      return new Vector3X(
         Math.ceil(this.x),
         Math.ceil(this.y),
         Math.ceil(this.z)
      )
   }

   round() {
      return new Vector3X(
         Math.round(this.x),
         Math.round(this.y),
         Math.round(this.z)
      )
   }

   print() {
      return `${this.x} ${this.y} ${this.z}`
   }

   toString() {
      return JSON.stringify(this.values)
   }

   toArray() {
      return [this.x, this.y, this.z] as [number, number, number]
   }

   toFixed(precision: number) {
      return new Vector3X(
         +this.x.toFixed(precision),
         +this.y.toFixed(precision),
         +this.z.toFixed(precision)
      )
   }

   static fromString(str: string) {
      const {x, y, z, name} = JSON.parse(str) as {
         x: number
         y: number
         z: number
         name: string
      }
      return new Vector3X(x, y, z, name)
   }

   *[Symbol.iterator]() {
      yield this.vectors.x
      yield this.vectors.y
      yield this.vectors.z
   }
}
