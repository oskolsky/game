import AssetManager from '@/core/asset-manager'
import LevelManager from '@/core/level-manager'

export default class Loader {
    private static instance: Loader
    private assetManager: AssetManager
    private levelManager: LevelManager

    private onCompleteCallback: () => void = () => {}
    private onErrorCallback: (error: string) => void = () => {}

    constructor() {
        this.assetManager = AssetManager.getInstance()
        this.levelManager = LevelManager.getInstance()
    }

    public static getInstance(): Loader {
        if (!Loader.instance) {
            Loader.instance = new Loader()
        }
        return Loader.instance
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
