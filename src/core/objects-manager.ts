import AssetManager from '@/core/asset-manager'
import CanvasManager from '@/core/canvas-manager'
import LevelManager from '@/core/level-manager'

import type { MapShift } from '@/utils/types'

import { gameConfig } from '@/configs/game.config'
import { calculateTileX, calculateTileY, getObjectTileFromSprite } from '@/utils/helpers'

export default class ObjectsManager {
    private static instance: ObjectsManager
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

    public static getInstance(): ObjectsManager {
        if (!ObjectsManager.instance) {
            ObjectsManager.instance = new ObjectsManager()
        }
        return ObjectsManager.instance
    }

    public render(row: number, col: number, mapShift: MapShift): void {
        const matrix = this.levelManager.getObjectsMatrix()

        if (matrix) {
            const tileString = matrix[row][col]

            if (tileString) {
                const tile = getObjectTileFromSprite(tileString)
                const x = calculateTileX(row, col) + mapShift.x
                const y = calculateTileY(row, col) + mapShift.y
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
        }
    }

    public getPosition(row: number, col: number): { x: number; y: number } {
        return {
            x: calculateTileX(row, col),
            y: calculateTileY(row, col),
        }
    }
}
