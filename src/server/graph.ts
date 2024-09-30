import * as sv from '@minecraft/server'
import {Vector3X} from './vector3'

interface ParticleConfig {
   color: RGBA
   size: {width: number; height: number}
}

interface RGBA {
   r: number
   g: number
   b: number
   a: number
}

const sin = Math.sin
const arcsin = Math.asin
const tick = () => sv.system.currentTick
const pi = Math.PI
const deg2rad = (deg: number) => (deg * pi) / 180
const rad2deg = (rad: number) => (rad * 180) / pi

class a {
   selection: 'cmd' | 'script'
   id: string
   constructor(id: string, selection: 'cmd' | 'script') {
      this.selection = selection
      this.id = id
      switch (true) {
         case !id.includes(':'):
            throw new Error(
               `§lGraph Api §e| §cId "${id}" must have ":" (must be like "xxx:yyy" or "x_x:y-y")§r`
            )
         case id.startsWith(':'):
            throw new Error(
               `§lGraph Api §e| §cId "${id}" mustn't start with ":" (must be like "xxx:yyy" or "x_x:y-y")§r`
            )
         case id.endsWith(':'):
            throw new Error(
               `§lGraph Api §e| §cId "${id}" mustn't end with ":" (must be like "xxx:yyy" or "x_x:y-y")§r`
            )
         case id.split(':').length > 2:
            throw new Error(
               `§lGraph Api §e| §cId "${id}" must have only one ":" (must be like "xxx:yyy" or "x_x:y-y")§r`
            )
         case id.startsWith('minecraft:'):
            throw new Error(
               `§lGraph Api §e| §cId "${id}" mustn't start with "minecraft:" (must be like "xxx:yyy" or "x_x:y-y")§r`
            )
         case !/^[a-zA-Z_-]+:[a-zA-Z_-]+$/i.test(id):
            throw new Error(
               `§lGraph Api §e| §cInvalid id format "${id}" mustn't have number or special character (must be like "xxx:yyy" or "x_x:y-y")§r`
            )
      }
   }
}

export class Graph extends a {
   id: string
   location: sv.Vector3 = Vector3X.ZERO
   isActived: boolean = false
   RGBcolor: {r: number; g: number; b: number} = {r: 0, g: 0, b: 0}
   selection: 'cmd' | 'script' = 'cmd'
   private points: sv.Vector3[] = []
   constructor(id: string, selection: 'cmd' | 'script') {
      super(id, selection)
      this.id = id
   }

   private setParticle(
      x: number,
      y: number,
      z: number,
      config: ParticleConfig = {
         color: {r: 1, g: 1, b: 1, a: 1},
         size: {width: 0.1, height: 0.1},
      }
   ) {
      const molangVar = new sv.MolangVariableMap()
      molangVar.setColorRGBA('color', {
         red: config.color.r,
         green: config.color.g,
         blue: config.color.b,
         alpha: config.color.a,
      })
      molangVar.setFloat('width', config.size.width)
      molangVar.setFloat('height', config.size.height)
      sv.world
         .getDimension('overworld')
         .spawnParticle('graph:point', {x: x, y: y, z: z}, molangVar)
   }

   onRun(callback: (event: sv.ScriptEventCommandMessageAfterEvent) => void) {
      sv.system.afterEvents.scriptEventReceive.subscribe((event) => {
         if (event.id === this.id) {
            callback(event)
         }
      })
   }

   show(
      config: ParticleConfig = {
         color: {r: 1, g: 1, b: 1, a: 1},
         size: {width: 0.1, height: 0.1},
      }
   ) {
      // this.onRun((event) => {
      let location: sv.Vector3 = Vector3X.ZERO
      // switch (true) {
      //   case !!event.sourceEntity:
      //     location = event.sourceEntity.location;
      //     break;
      //   case !!event.sourceBlock:
      //     location = event.sourceBlock.location;
      //     break;
      //   default:
      //     throw new Error("Graph Api | §cError to get source§r");
      // }
      this.isActived = true
      this.location = location
      this.points.forEach((point) => {
         this.setParticle(point.x, point.y, point.z, config)
         this.points = this.points.filter((p) => p !== point)
      })
      // });
   }

   plot(location: sv.Vector3) {
      this.points.push(location)
      return this
   }

   line(start: sv.Vector3, end: sv.Vector3, steps: number = 100) {
      for (let i = 0; i <= steps; i++) {
         const x = start.x + ((end.x - start.x) * i) / steps
         const y = start.y + ((end.y - start.y) * i) / steps
         const z = start.z + ((end.z - start.z) * i) / steps
         this.plot({x, y, z})
      }

      return this
   }

   for(
      start: number,
      end: number,
      increase: number,
      callback: (i: number) => void
   ) {
      for (
         let i = start;
         start < end ? i <= end : i >= end;
         start < end ? (i += increase) : (i -= increase)
      ) {
         callback(i)
      }
   }

   interval(
      start: number,
      end: number,
      increase: number,
      callback: (i: number) => void
   ) {
      this.onRun(() => {
         this.for(start, end, increase, callback)
      })
   }

   genRainbowColor(speed: number = 1, offset: RGBA = {r: 0, g: 0, b: 0, a: 1}) {
      this.RGBcolor.r = sin(speed * deg2rad(tick()) + offset.r + 0) * 127 + 128
      this.RGBcolor.g = sin(speed * deg2rad(tick()) + offset.g + 2) * 127 + 128
      this.RGBcolor.b = sin(speed * deg2rad(tick()) + offset.b + 4) * 127 + 128
      return this.formatColor(this.RGBcolor.r, this.RGBcolor.g, this.RGBcolor.b)
   }

   formatColor(r: RGBA['r'], g: RGBA['g'], b: RGBA['b'], a: RGBA['a'] = 1) {
      return {
         r: Number((r / 255).toFixed(3)),
         g: Number((g / 255).toFixed(3)),
         b: Number((b / 255).toFixed(3)),
         a: a,
      }
   }
}
