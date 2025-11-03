import { CANVAS_PROPS, NODE_PROPERTIES, SPATIAL_HASHING } from "../consts";
import blendColors from "../helpers/blendColors";
import type { Edge, NodesMap } from "../types";


export default function render(ctx: CanvasRenderingContext2D, nodes: NodesMap, edges: Edge[]) {
  const WIDTH = CANVAS_PROPS.width
  const HEIGHT = CANVAS_PROPS.height
  const COLOR = CANVAS_PROPS.color

  function visualizeSpatialHashing() {
    const cellSize = NODE_PROPERTIES.r * 2
    const horizontalCells = HEIGHT / cellSize
    const verticalCells = WIDTH / cellSize

    for (let i = 0; i < horizontalCells; i++) {
      ctx.strokeStyle = SPATIAL_HASHING.strokeColor
      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(WIDTH, i * cellSize)
      ctx.stroke()
    }
    for (let j = 0; j < verticalCells; j++) {
      ctx.strokeStyle = SPATIAL_HASHING.strokeColor
      ctx.beginPath()
      ctx.moveTo(j * cellSize, 0)
      ctx.lineTo(j * cellSize, HEIGHT)
      ctx.stroke()
    }

    const nodesArr = Object.values(nodes)
    const grid = new Map<string, typeof nodesArr>()

    for (const node of nodesArr) {
      const cellX = Math.floor(node.x / cellSize)
      const cellY = Math.floor(node.y / cellSize)
      const key = `${cellX},${cellY}`
      if (!grid.has(key)) grid.set(key, [])
      grid.get(key)!.push(node)
    }

    for (const [key, cellNodes] of grid.entries()) {
      if (cellNodes.length === 0) continue
      const [cellX, cellY] = key.split(',').map(Number)
      const left = cellX * cellSize
      const top = cellY * cellSize
      ctx.fillStyle = SPATIAL_HASHING.cellColor
      ctx.fillRect(left, top, cellSize, cellSize)
    }
  }

  ctx.fillStyle = COLOR
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  visualizeSpatialHashing()

  ctx.lineWidth = 2
  for (const edge of edges) {
    const a = nodes[edge.a]
    const b = nodes[edge.b]
    if (!a || !b) continue
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    const strokeColor = blendColors(a.color, b.color, 0.5)
    ctx.strokeStyle = strokeColor
    ctx.stroke()
  }

  for (const node of Object.values(nodes)) {
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.currentR, 0, 2 * Math.PI)
    ctx.strokeStyle = node.color
    ctx.stroke()
    ctx.fillStyle = '#000'
    ctx.fill()
  }

}
