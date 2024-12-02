import AssetManager from '@/core/asset-manager'
import LevelManager from '@/core/level-manager'

export default class Loader {
    private assetManager: AssetManager
    private levelManager: LevelManager

    private onCompleteCallback: () => void = () => {}
    private onErrorCallback: (error: string) => void = () => {}

    constructor() {
        this.assetManager = AssetManager.getInstance()
        this.levelManager = LevelManager.getInstance()
    }

    public onComplete(callback: () => void): void {
        this.onCompleteCallback = callback
    }

    public onError(callback: (error: string) => void): void {
        this.onErrorCallback = callback
    }

    public async load(): Promise<void> {
        try {
            await this.assetManager.loadImages()
            await this.levelManager.loadLevel(1)
            this.onCompleteCallback()
        } catch (error: any) {
            this.onErrorCallback(error)
        }
    }
}
