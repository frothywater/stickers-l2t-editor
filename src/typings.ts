export interface LineSticker {
  id: number
  url: string
  emojis: string
}

export interface LineStickerSet {
  id: number
  name: string
  author: string
  authorUrl: string
  mainImageUrl: string
  animated: boolean
  stickers: LineSticker[]
}

export interface LineDataPreview {
  type: string
  id: string
  staticUrl: string
  fallbackStaticUrl?: string
  animationUrl: string
  popupUrl: string
  soundUrl: string
}
