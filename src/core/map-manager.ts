import AssetManager from '@/core/asset-manager'
import CanvasManager from '@/core/canvas-manager'
import LevelManager from '@/core/level-manager'

import { grasslandConfig } from '@/assets/grassland/grassland.config'
import { config } from '@/configs/game.config'

export default class MapManager {
    private assetManager: AssetManager
    private canvasManager: CanvasManager
    private levelManager: LevelManager

    private mapShift: { x: number; y: number }
    private mapMoving: boolean = false
    private hoveredTile: { row: number; cell: number } | null = null
    private initialMousePosition: { x: number; y: number } | null = null

    constructor() {
        this.assetManager = AssetManager.getInstance()
        this.canvasManager = CanvasManager.getInstance()
        this.levelManager = LevelManager.getInstance()

        this.mapShift = this.calculateInitialMapShift()

        this.addEventListeners()
    }

    public renderMap(): void {
        this.canvasManager.clear()
        this.renderTerrain()
        this.renderTileGrid()
        this.renderSelectedTile()
        this.renderObjects()
        this.renderScreenCenter()
    }

    private renderTerrain(): void {
        const tileImage = this.assetManager.getImage('tile')
        const terrainMatrix = this.levelManager.getTerrainMatrix()

        // console.log('terrainMatrix', terrainMatrix)

        if (tileImage && terrainMatrix) {
            const context = this.canvasManager.getContext()
            terrainMatrix.forEach((row, rowIndex) => {
                row.forEach((_, colIndex) => {
                    const { x, y } = this.calculateTilePosition(rowIndex, colIndex)
                    context.drawImage(tileImage, x - config.tile.width_half, y, config.tile.width, config.tile.height)
                })
            })
        }
    }

    private renderObjects(): void {
        const treeImage = this.assetManager.getImage('grasslandTrees')
        const objectsMatrix = this.levelManager.getObjectsMatrix()

        if (treeImage && objectsMatrix) {
            objectsMatrix.forEach((row, rowIndex) => {
                row.forEach((tileType, colIndex) => {
                    if (tileType > 0) {
                        const context = this.canvasManager.getContext()
                        const { x, y } = this.calculateTilePosition(rowIndex, colIndex)
                        const { sprite, width, height } = grasslandConfig.trees
                        context.drawImage(
                            treeImage,
                            sprite[tileType - 1][0],
                            sprite[tileType - 1][1],
                            width,
                            height,
                            x - width / 2,
                            y - height + config.tile.height,
                            width,
                            height,
                        )
                    }
                })
            })
        }
    }

    private renderSelectedTile(): void {
        const selectTileImage = this.assetManager.getImage('selectTile')
        if (this.hoveredTile && selectTileImage) {
            const context = this.canvasManager.getContext()
            const { x, y } = this.calculateTilePosition(this.hoveredTile.row, this.hoveredTile.cell)
            context.drawImage(selectTileImage, x - config.tile.width_half, y, config.tile.width, config.tile.height)
        }
    }

    private renderTileGrid(terrainMatrix: number[][] = []): void {
        if (config.debug.showTileGrid) {
            terrainMatrix.forEach((row, rowIndex) => {
                row.forEach((_, colIndex) => {
                    const context = this.canvasManager.getContext()
                    const { x, y } = this.calculateTilePosition(rowIndex, colIndex)

                    context.strokeStyle = '#fff'
                    context.beginPath()
                    context.moveTo(x, y)
                    context.lineTo(x + config.tile.width_half, y + config.tile.height_half)
                    context.lineTo(x, y + config.tile.height)
                    context.lineTo(x - config.tile.width_half, y + config.tile.height_half)
                    context.closePath()
                    context.stroke()

                    const text = `${rowIndex}x${colIndex}`
                    context.fillStyle = 'white'
                    context.font = '10px Arial'

                    const textWidth = context.measureText(text).width

                    context.fillText(text, x - textWidth / 2, y + config.tile.height_half + 3)
                })
            })
        }
    }

    private renderScreenCenter(): void {
        if (config.debug.showScreenCenter) {
            const context = this.canvasManager.getContext()
            const canvas = this.canvasManager.getCanvas()
            context.fillStyle = 'red'
            context.fillRect(canvas.width / 2 - 2, canvas.height / 2 - 2, 4, 4)
        }
    }

    private calculateTilePosition(row: number, col: number): { x: number; y: number } {
        return {
            x: (col - row) * config.tile.width_half + this.mapShift.x,
            y: (col + row) * config.tile.height_half + this.mapShift.y,
        }
    }

    private calculateInitialMapShift(): { x: number; y: number } {
        const canvas = this.canvasManager.getCanvas()
        const centerMap = this.getCoordinatesByCell(config.mapCenter[0], config.mapCenter[1])
        return {
            x: canvas.width / 2 - centerMap.x,
            y: canvas.height / 2 - centerMap.y,
        }
    }

    private addEventListeners(): void {
        const canvas = this.canvasManager.getCanvas()
        canvas.addEventListener('click', this.handleClick.bind(this))
        canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))
        canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
        canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))
    }

    private handleClick(event: MouseEvent): void {
        const cell = this.getCellByCoordinates(event.x, event.y)
        console.log(cell ? `Clicked tile coordinates: row ${cell.row}, cell ${cell.cell}` : 'Clicked outside the map')
    }

    private handleMouseMove(event: MouseEvent): void {
        const cell = this.getCellByCoordinates(event.x, event.y)
        this.hoveredTile = cell || null

        if (this.mapMoving && this.initialMousePosition) {
            this.handleMapShift(event)
        }
    }

    private handleMouseDown(event: MouseEvent): void {
        this.mapMoving = true
        this.initialMousePosition = { x: event.clientX, y: event.clientY }
    }

    private handleMouseUp(): void {
        this.mapMoving = false
        this.initialMousePosition = null
    }

    private handleMapShift(event: MouseEvent): void {
        if (!this.initialMousePosition) return

        const deltaX = event.clientX - this.initialMousePosition.x
        const deltaY = event.clientY - this.initialMousePosition.y

        this.mapShift.x += deltaX
        this.mapShift.y += deltaY
        this.initialMousePosition = { x: event.clientX, y: event.clientY }
    }

    private getCoordinatesByCell(row: number, col: number): { x: number; y: number } {
        return {
            x: (col - row) * config.tile.width_half,
            y: (col + row) * config.tile.height_half + config.tile.height_half,
        }
    }

    private getCellByCoordinates(x: number, y: number): { row: number; cell: number } | null {
        const terrainMatrix = this.levelManager.getTerrainMatrix()
        const adjustedX = x - this.mapShift.x
        const adjustedY = y - this.mapShift.y - 1

        const row = Math.floor((adjustedY / config.tile.height_half - adjustedX / config.tile.width_half) / 2)
        const cell = Math.floor((adjustedY / config.tile.height_half + adjustedX / config.tile.width_half) / 2)

        return terrainMatrix && row >= 0 && row < terrainMatrix.length && cell >= 0 && cell < terrainMatrix[row].length
            ? { row, cell }
            : null
    }
}
