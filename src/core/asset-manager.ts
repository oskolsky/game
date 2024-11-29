export default class AssetManager {
    private images: { [key: string]: HTMLImageElement } = {}

    public loadImage(key: string, path: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image()
            image.src = path
            image.onload = () => {
                this.images[key] = image
                resolve(image)
            }
            image.onerror = reject
        })
    }

    public getImage(key: string): HTMLImageElement | undefined {
        return this.images[key]
    }
}
