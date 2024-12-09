import AssetManager from '@/core/asset-manager'
import CanvasManager from '@/core/canvas-manager'
import CharacterManager from '@/core/character-manager'
import LevelManager from '@/core/level-manager'
import ObjectsManager from '@/core/objects-manager'
import TerrainManager from '@/core/terrain-manager'

import { gameConfig } from '@/configs/game.config'
import { calculateTileX, calculateTileY } from '@/utils/helpers'

export default class GameManager {
    private assetManager: AssetManager
    private canvasManager: CanvasManager
    private characterManager: CharacterManager
    private levelManager: LevelManager
    private objectsManager: ObjectsManager
    private terrainManager: TerrainManager

    private context: CanvasRenderingContext2D
    private canvas: HTMLCanvasElement

    private mapShift: { x: number; y: number }
    private mapMoving: boolean = false
    private initialMousePosition: { x: number; y: number } | null = null
    private hoveredTile: { row: number; col: number } | null = null

    constructor() {
        this.assetManager = AssetManager.getInstance()
        this.canvasManager = CanvasManager.getInstance()
        this.characterManager = CharacterManager.getInstance()
        this.levelManager = LevelManager.getInstance()
        this.objectsManager = ObjectsManager.getInstance()
        this.terrainManager = TerrainManager.getInstance()

        this.context = this.canvasManager.getContext()
        this.canvas = this.canvasManager.getCanvas()
        this.mapShift = this.calculateInitialMapShift(gameConfig.mapCenter[0], gameConfig.mapCenter[1])

        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))
    }

    public render(): void {
        const elementsToRender: Array<{ render: () => void; depth: number }> = []

        const rows = gameConfig.mapSize.rows
        const cols = gameConfig.mapSize.cols

        const characterPosition = this.characterManager.getPosition()

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const objectPosition = this.objectsManager.getPosition(row, col)

                elementsToRender.push({
                    render: () => this.terrainManager.render(row, col, this.mapShift),
                    depth: 0,
                })

                elementsToRender.push({
                    render: () => this.objectsManager.render(row, col, this.mapShift),
                    depth: objectPosition.y < characterPosition.y ? 2 : 4,
                })
            }
        }

        elementsToRender.push({
            render: () => this.renderHoveredTile(),
            depth: 1,
        })

        elementsToRender.push({
            render: () => this.characterManager.render(this.mapShift),
            depth: 3,
        })

        elementsToRender.sort((a, b) => a.depth - b.depth)
        elementsToRender.forEach(element => element.render())

        this.renderScreenCenter()
    }

    private renderHoveredTile(): void {
        const hoverImage = this.assetManager.getImage('hover')
        if (this.hoveredTile && hoverImage) {
            const x = calculateTileX(this.hoveredTile.row, this.hoveredTile.col) + this.mapShift.x
            const y = calculateTileY(this.hoveredTile.row, this.hoveredTile.col) + this.mapShift.y
            this.context.drawImage(
                hoverImage,
                x - gameConfig.tile.width_half,
                y,
                gameConfig.tile.width,
                gameConfig.tile.height,
            )
        }
    }

    private renderScreenCenter(): void {
        if (gameConfig.debug.showScreenCenter) {
            this.context.fillStyle = 'red'
            this.context.fillRect(this.canvas.width / 2 - 2, this.canvas.height / 2 - 2, 4, 4)
        }
    }

    private handleMouseMove(event: MouseEvent): void {
        if (this.mapMoving && this.initialMousePosition) {
            this.calculateMapShift(event)
        } else {
            this.hoveredTile = this.getCellByCoordinates(event.clientX, event.clientY)
        }
    }

    private handleMouseDown(event: MouseEvent): void {
        this.mapMoving = true
        this.initialMousePosition = { x: event.clientX, y: event.clientY }
    }

    private handleMouseUp(event: MouseEvent): void {
        const tile = this.getCellByCoordinates(event.clientX, event.clientY)

        if (tile) {
            this.characterManager.moveToTile(tile)
        } else {
            console.log('Clicked outside the map')
        }

        this.mapMoving = false
        this.initialMousePosition = null
    }

    private calculateInitialMapShift(row: number, col: number): { x: number; y: number } {
        const x = calculateTileX(row, col)
        const y = calculateTileY(row, col) + gameConfig.tile.height_half
        return {
            x: this.canvas.width / 2 - x,
            y: this.canvas.height / 2 - y,
        }
    }

    private calculateMapShift(event: MouseEvent): void {
        if (this.initialMousePosition) {
            const deltaX = event.clientX - this.initialMousePosition.x
            const deltaY = event.clientY - this.initialMousePosition.y

            this.mapShift.x += deltaX
            this.mapShift.y += deltaY
            this.initialMousePosition = { x: event.clientX, y: event.clientY }
        }
    }

    private getCellByCoordinates(x: number, y: number): { row: number; col: number } | null {
        const terrainMatrix = this.levelManager.getTerrainMatrix()
        const adjustedX = x - this.mapShift.x
        const adjustedY = y - this.mapShift.y - 1

        const row = Math.floor((adjustedY / gameConfig.tile.height_half - adjustedX / gameConfig.tile.width_half) / 2)
        const col = Math.floor((adjustedY / gameConfig.tile.height_half + adjustedX / gameConfig.tile.width_half) / 2)

        return terrainMatrix && row >= 0 && row < terrainMatrix.length && col >= 0 && col < terrainMatrix[row].length
            ? { row, col }
            : null
    }
}
