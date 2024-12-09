import { gameConfig } from '@/configs/game.config'
import { ObjectsMatrix, TerrainMatrix } from '@/utils/types'

export default class LevelManager {
    private static instance: LevelManager
    private currentLevel: any | null = null

    constructor() {}

    public static getInstance(): LevelManager {
        if (!LevelManager.instance) {
            LevelManager.instance = new LevelManager()
        }
        return LevelManager.instance
    }

    public async loadLevel(levelId: number): Promise<void> {
        try {
            const response = await fetch(`data/level-${levelId}.json`)

            if (!response.ok) {
                throw new Error(`Failed to load level-${levelId}.json, status: ${response.status}`)
            }

            this.currentLevel = await response.json()

            if (gameConfig.mapSize.rows !== this.currentLevel.terrainMatrix.length) {
                this.currentLevel.terrainMatrix = this.createMatrix(
                    this.currentLevel.terrainMatrix,
                    'terrain/grass:0:0',
                )
            }

            if (gameConfig.mapSize.rows !== this.currentLevel.objectsMatrix.length) {
                this.currentLevel.objectsMatrix = this.createMatrix(this.currentLevel.objectsMatrix, null)
            }
        } catch (error) {
            throw error
        }
    }

    public getTerrainMatrix(): TerrainMatrix | undefined {
        if (!this.currentLevel) {
            throw new Error('No level is currently loaded')
        }
        return this.currentLevel.terrainMatrix
    }

    public getObjectsMatrix(): ObjectsMatrix | undefined {
        if (!this.currentLevel) {
            throw new Error('No level is currently loaded')
        }
        return this.currentLevel.objectsMatrix
    }

    public getLevelData(): any {
        if (!this.currentLevel) {
            throw new Error('No level is currently loaded')
        }
        return this.currentLevel
    }

    private createMatrix<T>(matrix: T[][], defaultValue: T): T[][] {
        const resizedMatrix: T[][] = []

        for (let i = 0; i < gameConfig.mapSize.rows; i++) {
            const row: T[] = []
            for (let j = 0; j < gameConfig.mapSize.cols; j++) {
                if (i < matrix.length && j < matrix[i].length) {
                    row.push(matrix[i][j])
                } else {
                    row.push(defaultValue)
                }
            }
            resizedMatrix.push(row)
        }

        return resizedMatrix
    }
}
