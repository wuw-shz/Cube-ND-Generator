import { Vector2, system } from "@minecraft/server";

const cos = Math.cos
const sin = Math.sin
const atan2 = Math.atan2
const sqrt = Math.sqrt
const pi = Math.PI
const tick = () => system.currentTick
const deg2rad = (deg: number) => (deg * pi) / 180
const rad2deg = (rad: number) => (rad * 180) / pi

type VectorT = Vector2 | [number, number];

export class Vector2X implements Vector2 {
  private values: { x: number; y: number; name?: string } = { x: 0, y: 0, name: undefined };
  private vectors: { x: number; y: number } = { x: 0, y: 0 };

  static get ZERO() {
    return new Vector2X(0, 0);
  }

  static get ONE() {
    return new Vector2X(1, 1);
  }

  static get UP() {
    return new Vector2X(0, 1);
  }

  static get DOWN() {
    return new Vector2X(0, -1);
  }

  static get FORWARD() {
    return new Vector2X(1, 0);
  }

  static get BACKWARD() {
    return new Vector2X(-1, 0);
  }

  static get INFINITY() {
    return new Vector2X(Infinity, Infinity);
  }

  static get NEGATIVE_INFINITY() {
    return new Vector2X(-Infinity, -Infinity);
  }

  static from(location: VectorT) {
    if (Array.isArray(location)) {
      return new Vector2X(location[0], location[1]);
    }
    return new Vector2X(location.x, location.y);
  }

  static add(a: VectorT, b: VectorT | number) {
    return Vector2X.from(a).add(b);
  }

  static subtract(a: VectorT, b: VectorT | number) {
    return Vector2X.from(a).subtract(b);
  }

  static multiply(a: VectorT, b: VectorT | number) {
    return Vector2X.from(a).multiply(b);
  }

  static divide(a: VectorT, b: VectorT | number) {
    return Vector2X.from(a).divide(b);
  }

  static equals(a: VectorT, b: VectorT) {
    return Vector2X.from(a).equals(b);
  }

  static scale(a: VectorT, b: VectorT | number) {
    return Vector2X.from(a).multiply(b);
  }

  static magnitude(a: VectorT) {
    return Vector2X.from(a).length;
  }

  static distance(a: VectorT, b: VectorT) {
    return Vector2X.from(a).distance(b);
  }

  static distanceSquared(a: VectorT, b: VectorT) {
    return Vector2X.from(a).distanceSquared(b);
  }

  static dot(a: VectorT, b: VectorT) {
    return Vector2X.from(a).dot(b);
  }

  static cross(a: VectorT, b: VectorT) {
    return Vector2X.from(a).cross(b);
  }

  static angle(a: VectorT, b: VectorT) {
    return Vector2X.from(a).angle(b);
  }

  static min(a: VectorT, b: VectorT) {
    return Vector2X.from(a).min(b);
  }

  static max(a: VectorT, b: VectorT) {
    return Vector2X.from(a).max(b);
  }

  static random(min: number = 1, max: number = 1) {
    return new Vector2X(Math.random() * (max - min) + min, Math.random() * (max - min) + min);
  }

  static fromAngle(angle: number) {
    return Vector2X.from([cos(angle), sin(angle)]);
  }

  constructor(vec: Vector2, name?: string);
  constructor(x: number, y: number, name?: string);
  constructor(first: number | Vector2, y?: number | string, name?: string) {
    if (typeof first === "object") {
      this.values = { name, ...first };
      this.vectors = first;
    } else {
      this.values = { name, x: first, y: y as number };
      this.vectors = { x: first, y: y as number };
    }
  }

  get name() {
    return this.values.name;
  }
  set name(value: string) {
    this.values.name = value;
  }

  get x() {
    return this.values.x;
  }
  set x(value: number) {
    this.values.x = value;
  }

  get y() {
    return this.values.y;
  }
  set y(value: number) {
    this.values.y = value;
  }

  get lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }

  get length() {
    return Math.hypot(this.x, this.y);
  }
  set length(value: number) {
    const length = this.length;
    this.x = (this.x / length) * value;
    this.y = (this.y / length) * value;
  }

  get deg2rad() {
    return new Vector2X(deg2rad(this.x), deg2rad(this.y));
  }

  get rad2deg() {
    return new Vector2X(rad2deg(this.x), rad2deg(this.y));
  }

  normalized() {
    const lengthSqrd = this.lengthSquared;
    return this.divide(lengthSqrd === 0 ? 1 : Math.sqrt(lengthSqrd));
  }

  clone() {
    return new Vector2X(this.vectors);
  }

  equals(vector: VectorT) {
    const vec = Vector2X.from(vector);
    return this.x === vec.x && this.y === vec.y;
  }

  offset(x: number, y: number, z: number) {
    this.add(new Vector2X(x, y));
    return this;
  }

  distance(vector: VectorT) {
    return this.subtract(vector).length;
  }

  distanceSquared(vector: VectorT) {
    return this.subtract(vector).lengthSquared;
  }

  add(vector: VectorT | number) {
    if (typeof vector === "number") {
      this.x += vector;
      this.y += vector;
      return this;
    } else {
      vector = Vector2X.from(vector);
      this.x += vector.x;
      this.y += vector.y;
      return this;
    }
  }

  subtract(vector: VectorT | number) {
    if (typeof vector === "number") {
      this.x -= vector;
      this.y -= vector;
      return this;
    } else {
      vector = Vector2X.from(vector);
      this.x -= vector.x;
      this.y -= vector.y;
      return this;
    }
  }

  multiply(vector: VectorT | number) {
    if (typeof vector === "number") {
      return this.scale(vector);
    } else {
      vector = Vector2X.from(vector);
      this.x *= vector.x;
      this.y *= vector.y;
      return this;
    }
  }

  divide(vector: VectorT | number) {
    if (typeof vector === "number") {
      this.x /= vector;
      this.y /= vector;
      return this;
    } else {
      vector = Vector2X.from(vector);
      this.x /= vector.x;
      this.y /= vector.y;
      return this;
    }
  }

  scale(scale: number) {
    this.x *= scale;
    this.y *= scale;
    return this;
  }

  dot(vector: VectorT) {
    vector = Vector2X.from(vector);
    return this.x * vector.x + this.y * vector.y;
  }

  cross(vector: VectorT) {
    vector = Vector2X.from(vector);
    return new Vector2X(this.x * vector.y - this.y * vector.x, this.y * vector.x - this.x * vector.y);
  }

  lerp(vector: VectorT, t: number) {
    vector = Vector2X.from(vector);
    return new Vector2X((1 - t) * this.x + t * vector.x, (1 - t) * this.y + t * vector.y);
  }

  angle(vector: VectorT) {
    vector = Vector2X.from(vector);
    return Math.acos(this.dot(vector) / (this.length * new Vector2X(vector).length));
  }

  rotate(angle: number, origin: VectorT = Vector2X.ZERO) {
    if (!angle) return this.clone();
    origin = Vector2X.from(origin);
    const ang = deg2rad(angle);
    const x = this.x - origin.x;
    const y = this.y - origin.y;
    this.x = x * cos(ang) - y * sin(ang) + origin.x;
    this.y = x * sin(ang) + y * cos(ang) + origin.y;

    return this;
  }

  parametric(angle: number, scale: number) {
    const x = scale * cos(deg2rad(angle)) + this.x;
    const y = scale * sin(deg2rad(angle)) + this.y;
    this.x = x;
    this.y = y;

    return this;
  }

  min(vector: VectorT) {
    vector = Vector2X.from(vector);
    return new Vector2X(Math.min(this.x, vector.x), Math.min(this.y, vector.y));
  }

  max(vector: VectorT) {
    vector = Vector2X.from(vector);
    return new Vector2X(Math.max(this.x, vector.x), Math.max(this.y, vector.y));
  }

  abs() {
    return new Vector2X(Math.abs(this.x), Math.abs(this.y));
  }

  floor() {
    return new Vector2X(Math.floor(this.x), Math.floor(this.y));
  }

  ceil() {
    return new Vector2X(Math.ceil(this.x), Math.ceil(this.y));
  }

  round() {
    return new Vector2X(Math.round(this.x), Math.round(this.y));
  }

  print() {
    return `${this.x} ${this.y}`;
  }

  toString() {
    return JSON.stringify(this.values);
  }

  toArray() {
    return [this.x, this.y] as [number, number];
  }

  toFixed(precision: number) {
    return new Vector2X(+this.x.toFixed(precision), +this.y.toFixed(precision));
  }

  static fromString(str: string) {
    return new Vector2X(JSON.parse(str));
  }

  *[Symbol.iterator]() {
    yield this.vectors.x;
    yield this.vectors.y;
  }
}
