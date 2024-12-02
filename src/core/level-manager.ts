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
        } catch (error) {
            throw error
        }
    }

    public getTerrainMatrix(): number[][] | undefined {
        if (!this.currentLevel) {
            throw new Error('No level is currently loaded')
        }
        return this.currentLevel.terrainMatrix
    }

    public getObjectsMatrix(): number[][] | undefined {
        if (!this.currentLevel) {
            throw new Error('No level is currently loaded')
        }
        return this.currentLevel.objectsMatrix
    }
}
