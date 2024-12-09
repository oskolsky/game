import CanvasManager from '@/core/canvas-manager'
import LevelManager from '@/core/level-manager'

export default class EditModeManager {
    private static instance: EditModeManager
    private canvasManager: CanvasManager
    private levelManager: LevelManager

    constructor() {
        this.canvasManager = CanvasManager.getInstance()
        this.levelManager = LevelManager.getInstance()
    }

    public static getInstance(): EditModeManager {
        if (!EditModeManager.instance) {
            EditModeManager.instance = new EditModeManager()
        }
        return EditModeManager.instance
    }

    public renderButton(): void {
        const context = this.canvasManager.getContext()
        context.fillStyle = '#4CAF50'
        context.fillRect(10, 10, 100, 40)
        context.strokeStyle = '#000'
        context.strokeRect(10, 10, 100, 40)
        context.font = '16px Arial'
        context.fillStyle = '#000'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText('Download', 60, 30)
    }

    public handleButtonClick(event: MouseEvent): void {
        const canvas = this.canvasManager.getCanvas()
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        if (x >= 10 && x <= 110 && y >= 10 && y <= 50) {
            this.downloadLevel()
        }
    }

    private downloadLevel(): void {
        const dummyData = this.levelManager.getLevelData()
        const data = JSON.stringify(dummyData)
        const blob = new Blob([data], { type: 'application/json' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'level-1.json'
        a.click()
    }
}
