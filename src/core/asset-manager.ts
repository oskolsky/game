import { assets } from '@/assets/assets'

export default class AssetManager {
    private static instance: AssetManager
    private images: { [key: string]: HTMLImageElement } = {}

    constructor() {}

    public static getInstance(): AssetManager {
        if (!AssetManager.instance) {
            AssetManager.instance = new AssetManager()
        }
        return AssetManager.instance
    }

    public async loadImages(): Promise<void> {
        try {
            await Promise.all(assets.map(({ key, path }) => this.loadImage(key, path)))
        } catch (error) {
            throw new Error('Failed to load images')
        }
    }

    private loadImage(key: string, path: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image()
            image.src = path
            image.onload = () => {
                this.images[key] = image
                resolve(image)
            }
            image.onerror = err => reject(new Error(`Failed to load image at ${path}`))
        })
    }

    public getImage(key: string): HTMLImageElement | undefined {
        return this.images[key]
    }
}
