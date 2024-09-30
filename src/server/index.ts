import './5d_3d'

// import * as sv from "@minecraft/server";
// import { Graph } from "./graph";
// import { Vector3X } from "./vector3";

// const cos = Math.cos;
// const sin = Math.sin;
// const atan2 = Math.atan2;
// const sqrt = Math.sqrt;
// const pi = Math.PI;
// const tick = () => sv.system.currentTick;
// const deg2rad = (deg: number) => (deg * pi) / 180;
// const rad2deg = (rad: number) => (rad * 180) / pi;
// const rotate = (x: number, y: number, angle: number) => {
//   const cosA = cos(angle);
//   const sinA = sin(angle);
//   return {
//     x: x * cosA - y * sinA,
//     y: -x * sinA - y * cosA,
//   };
// };

// sv.system.runInterval(() => {
//   const g = new Graph("graph:test", "script");
//   sv.world.getAllPlayers().forEach((player) => {
//     if (player.name !== "Wuw Sh") return;
//     // player.sendMessage('w')
//     const blVD = player.getBlockFromViewDirection();
//     if (!blVD) return;
//     const blockLoc = Vector3X.add(blVD.block, blVD.faceLocation);
//     const distance = Vector3X.distance(blockLoc, new Vector3X(0, -60, 0));
//     const angle = -atan2(blockLoc.z, blockLoc.x);
//     player.onScreenDisplay.setActionBar(
//       `Distance: ${distance.toFixed(2)}\nAngle: ${rad2deg(
//         angle < 0 ? angle + 2 * pi : angle
//       ).toFixed(2)}`
//     );
//     g.for(0, 2 * pi, 0.2, (t) => {
//       const a = rotate(sqrt(3) * cos(t), sqrt(3) * sin(t) + sqrt(3), angle);
//       const b = rotate(sqrt(3) * cos(t), sqrt(3) * sin(t) - sqrt(3), angle);
//       const c = rotate(
//         (distance * cos(t)) / 2 + distance / 2,
//         (distance * sin(t)) / 8,
//         angle
//       );
//       const d = rotate(
//         sqrt(distance / 8) * cos(t) + distance,
//         sqrt(distance / 4) * sin(t),
//         angle
//       );
//       g.plot({ x: a.x, y: -60, z: a.y });
//       g.plot({ x: b.x, y: -60, z: b.y });
//       g.plot({ x: c.x, y: -60, z: c.y });
//       g.plot({ x: d.x, y: -60, z: d.y });
//     });
//     // g.for(0, 1, 0.1, (t) => {
//     //   const x = t * blockLoc.x;
//     //   const z = t * blockLoc.z;
//     //   g.plot({ x: x, y: -60, z: z });
//     // });
//     g.for(0, 2 * pi, 0.1, (t) => {
//       const x = distance * cos(t);
//       const z = distance * sin(t);
//       g.plot({ x: x, y: -60, z: z });
//     });
//     g.show();
//     g.for(0, distance * cos(angle), 0.3, (t) => {
//       const x = t;
//       const z = distance * -sin(angle);
//       g.plot({ x: x, y: -60, z: z });
//     });
//     g.show({
//       color: { r: 1, g: 105 / 255, b: 105 / 255, a: 1 },
//       size: { width: 0.1, height: 0.1 },
//     });
//     g.for(0, distance * sin(angle), 0.3, (t) => {
//       const x = distance * cos(angle);
//       const z = -t;
//       g.plot({ x: x, y: -60, z: z });
//     });
//     g.show({
//       color: { r: 105 / 255, g: 105 / 255, b: 1, a: 1 },
//       size: { width: 0.1, height: 0.1 },
//     });
//     g.for(-distance, distance, 0.5, (x) => {
//       g.plot({ x: x, y: -60, z: 0 });
//     });
//     g.show({
//       color: { r: 1, g: 0, b: 0, a: 1 },
//       size: { width: 0.1, height: 0.1 },
//     });
//     g.for(-distance, distance, 0.5, (y) => {
//       g.plot({ x: 0, y: -60, z: y });
//     });
//     g.show({
//       color: { r: 0, g: 0, b: 1, a: 1 },
//       size: { width: 0.1, height: 0.1 },
//     });
//     g.for(0, 5, 0.5, (z) => {
//       g.plot({ x: 0, y: z - 60, z: 0 });
//     });
//     g.show({
//       color: { r: 0, g: 1, b: 0, a: 1 },
//       size: { width: 0.1, height: 0.1 },
//     });
//   });
// });
