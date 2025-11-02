import './App.css'
import { useEffect, useRef } from 'react'
import { CANVAS_PROPS, STATES } from './consts.ts'
import type { Edge, NodesMap, States } from './types'
import updatePhysics from './physics/updatePhysics.ts'
import checkCollisions from './physics/checkCollisions.ts'
import render from './render/render.ts'
import addElement from './helpers/addElement.ts'

const WIDTH = CANVAS_PROPS.width
const HEIGHT = CANVAS_PROPS.height

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const draggingId = useRef<string | null>(null)
  const lastMouse = useRef<{ x: number; y: number } | null>(null)
  const stateRef = useRef<States>(STATES.ADD_NODES)
  const selectedRef = useRef<string | null>(null)
  const nodesRef = useRef<NodesMap>({})
  const edgesRef = useRef<Edge[]>([])

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const { left, top } = canvas.getBoundingClientRect()
    const mx = e.clientX - left
    const my = e.clientY - top
    const nodes = nodesRef.current

    for (const node of Object.values(nodes)) {
      const dx = mx - node.x
      const dy = my - node.y
      if (Math.hypot(dx, dy) <= node.currentR) {
        node.isDragging = true
        node.offsetX = dx
        node.offsetY = dy
        draggingId.current = node.id
        lastMouse.current = { x: mx, y: my }
        break
      }
    }
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!draggingId.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const { left, top } = canvas.getBoundingClientRect()
    const mx = e.clientX - left
    const my = e.clientY - top
    const nodes = nodesRef.current

    const node = nodes[draggingId.current]
    if (!node || !node.isDragging) return

    const prev = lastMouse.current
    if (prev) {
      node.vx = mx - prev.x
      node.vy = my - prev.y
    }

    node.x = mx - (node.offsetX ?? 0)
    node.y = my - (node.offsetY ?? 0)
    lastMouse.current = { x: mx, y: my }

    checkCollisions(nodes)
  }

  function onMouseUp() {
    if (draggingId.current) {
      const nodes = nodesRef.current
      const node = nodes[draggingId.current]
      if (node) node.isDragging = false
      draggingId.current = null
      lastMouse.current = null
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Shift') {
        stateRef.current = STATES.ADD_EDGES
      }
    }

    function handleKeyup(e: KeyboardEvent) {
      if (e.key === 'Shift') {
        stateRef.current = STATES.ADD_NODES
      }
    }
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('keyup', handleKeyup)

    let lastTime = performance.now()
    let animationId: number

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.033) // ~30 FPS max step
      lastTime = now

      updatePhysics(nodesRef.current, edgesRef.current, dt)
      render(ctx, nodesRef.current, edgesRef.current)

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('keyup', handleKeyup)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      onClick={(e) => addElement(e, stateRef.current, canvasRef.current, nodesRef.current, edgesRef.current, selectedRef)}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  )
}

export default App

