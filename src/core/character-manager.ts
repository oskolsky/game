import AssetManager from '@/core/asset-manager'
import CanvasManager from '@/core/canvas-manager'

import type { MapShift } from '@/utils/types'

import { gameConfig } from '@/configs/game.config'
import { characterConfig } from '@/configs/character.config'
import { CharacterAction, CharacterDirection } from '@/utils/enums'
import { calculateTileX, calculateTileY } from '@/utils/helpers'

export default class CharacterManager {
    private static instance: CharacterManager
    private assetManager: AssetManager
    private canvasManager: CanvasManager

    private context: CanvasRenderingContext2D
    private tick: number = 0
    private moveSpeed: number = 3 // speed of character movement px/frame
    private position: { x: number; y: number }
    private targetPosition: { x: number; y: number } | null = null
    private direction: CharacterDirection = CharacterDirection.E
    private action: CharacterAction = CharacterAction.Base

    private constructor() {
        this.assetManager = AssetManager.getInstance()
        this.canvasManager = CanvasManager.getInstance()

        this.context = this.canvasManager.getContext()

        this.position = {
            x: calculateTileX(gameConfig.characterPosition[0], gameConfig.characterPosition[1]),
            y: calculateTileY(gameConfig.characterPosition[0], gameConfig.characterPosition[1]),
        }
    }

    public static getInstance(): CharacterManager {
        if (!CharacterManager.instance) {
            CharacterManager.instance = new CharacterManager()
        }
        return CharacterManager.instance
    }

    public render(mapShift: MapShift): void {
        const head = this.assetManager.getImage('character/head')
        const clothes = this.assetManager.getImage('character/clothes')

        if (head && clothes) {
            const width = characterConfig.size.width
            const height = characterConfig.size.height
            const actionFrames = characterConfig.actionFrames[this.action]
            const directionFrame = characterConfig.directionFrame[this.direction]
            const frame = this.getFrame(actionFrames.length)

            this.context.drawImage(
                clothes,
                actionFrames[frame],
                directionFrame,
                width,
                height,
                this.position.x - width / 2 + mapShift.x,
                this.position.y - height + gameConfig.tile.height + 20 + mapShift.y,
                width,
                height,
            )
            this.context.drawImage(
                head,
                actionFrames[frame],
                directionFrame,
                width,
                height,
                this.position.x - width / 2 + mapShift.x,
                this.position.y - height + gameConfig.tile.height + 20 + mapShift.y,
                width,
                height,
            )

            this.updatePosition()
        }
    }

    public moveToTile(tile: { row: number; col: number }): void {
        this.targetPosition = {
            x: calculateTileX(tile.row, tile.col),
            y: calculateTileY(tile.row, tile.col),
        }
        this.action = CharacterAction.Run
        this.direction = this.calculateDirection(this.targetPosition)
    }

    public getPosition(): { x: number; y: number } {
        return this.position // Где position задается в пикселях
    }

    private getFrame(length: number): number {
        this.tick += characterConfig.frameSpeed[this.action]
        return Math.floor(this.tick % length)
    }

    private updatePosition(): void {
        if (this.targetPosition) {
            const dx = this.targetPosition.x - this.position.x
            const dy = this.targetPosition.y - this.position.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance <= this.moveSpeed) {
                // Reached target
                this.position = this.targetPosition
                this.targetPosition = null
                this.action = CharacterAction.Base
            } else {
                // Move towards target
                const stepX = (dx / distance) * this.moveSpeed
                const stepY = (dy / distance) * this.moveSpeed
                this.position.x += stepX
                this.position.y += stepY
            }
        }
    }

    private calculateDirection(targetPosition: { x: number; y: number }): CharacterDirection {
        const dx = targetPosition.x - this.position.x
        const dy = targetPosition.y - this.position.y
        const angle = Math.atan2(dy, dx)

        if (angle >= -Math.PI / 8 && angle < Math.PI / 8) {
            return CharacterDirection.E
        } else if (angle >= Math.PI / 8 && angle < (3 * Math.PI) / 8) {
            return CharacterDirection.SE
        } else if (angle >= (3 * Math.PI) / 8 && angle < (5 * Math.PI) / 8) {
            return CharacterDirection.S
        } else if (angle >= (5 * Math.PI) / 8 && angle < (7 * Math.PI) / 8) {
            return CharacterDirection.SW
        } else if (angle >= -(3 * Math.PI) / 8 && angle < -Math.PI / 8) {
            return CharacterDirection.NE
        } else if (angle >= -(5 * Math.PI) / 8 && angle < -(3 * Math.PI) / 8) {
            return CharacterDirection.N
        } else if (angle >= -(7 * Math.PI) / 8 && angle < -(5 * Math.PI) / 8) {
            return CharacterDirection.NW
        } else {
            return CharacterDirection.W
        }
    }
}
