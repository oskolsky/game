import AssetManager from '@/core/asset-manager'
import CanvasManager from '@/core/canvas-manager'
import LevelManager from '@/core/level-manager'

import type { MapShift } from '@/utils/types'

import { gameConfig } from '@/configs/game.config'
import { calculateTileX, calculateTileY, getTerrainTileFromSprite } from '@/utils/helpers'

export default class TerrainManager {
    private static instance: TerrainManager
    private assetManager: AssetManager
    private canvasManager: CanvasManager
    private levelManager: LevelManager

    private context: CanvasRenderingContext2D

    constructor() {
        this.assetManager = AssetManager.getInstance()
        this.canvasManager = CanvasManager.getInstance()
        this.levelManager = LevelManager.getInstance()

        this.context = this.canvasManager.getContext()
    }

    public static getInstance(): TerrainManager {
        if (!TerrainManager.instance) {
            TerrainManager.instance = new TerrainManager()
        }
        return TerrainManager.instance
    }

    public render(row: number, col: number, mapShift: MapShift): void {
        const matrix = this.levelManager.getTerrainMatrix()
        const x = calculateTileX(row, col) + mapShift.x
        const y = calculateTileY(row, col) + mapShift.y

        if (matrix) {
            const tileString = matrix[row][col]

            if (tileString) {
                const tile = getTerrainTileFromSprite(tileString)
                const image = this.assetManager.getImage(tile.name)
                const sx = tile.x
                const sy = tile.y
                const width = tile.width
                const height = tile.height
                const dx = x - width / 2
                const dy = y - height + gameConfig.tile.height

                if (image) {
                    this.context.drawImage(image, sx, sy, width, height, dx, dy, width, height)
                }
            }

            if (gameConfig.debug.showTileGrid) {
                this.drawTileGrid(x, y)
                this.drawTileText(x, y, `${row}:${col}`)
            }
        }
    }

    private drawTileGrid(x: number, y: number): void {
        this.context.strokeStyle = '#fff'
        this.context.beginPath()
        this.context.moveTo(x, y)
        this.context.lineTo(x + gameConfig.tile.width_half, y + gameConfig.tile.height_half)
        this.context.lineTo(x, y + gameConfig.tile.height)
        this.context.lineTo(x - gameConfig.tile.width_half, y + gameConfig.tile.height_half)
        this.context.closePath()
        this.context.stroke()
    }

    private drawTileText(x: number, y: number, text: string): void {
        const textWidth = this.context.measureText(text).width
        this.context.fillStyle = 'white'
        this.context.font = '10px Arial'
        this.context.fillText(text, x - textWidth / 2, y + 18)
    }
}
