import { CANVAS_PROPS } from "../consts";
import blendColors from "../helpers/blendColors";
import type { Edge, NodesMap } from "../types";


export default function render(ctx: CanvasRenderingContext2D, nodes: NodesMap, edges: Edge[]) {
  const WIDTH = CANVAS_PROPS.width
  const HEIGHT = CANVAS_PROPS.height
  const COLOR = CANVAS_PROPS.color

  ctx.fillStyle = COLOR
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

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
