import { LineDataPreview, LineSticker, LineStickerSet } from "./typings"

const corsAnywhereDomain = "https://cors-anywhere-cobalt.herokuapp.com"

export async function fetchDoc(url: string): Promise<Document> {
  return fetch(`${corsAnywhereDomain}/${url}`)
    .then((response) => response.text())
    .then((text) => new DOMParser().parseFromString(text, `text/html`))
}

function getURL(preview: LineDataPreview): string {
  if (preview.animationUrl) return preview.animationUrl
  else if (preview.popupUrl) return preview.popupUrl
  else return preview.staticUrl
}

function isAnimated(preview: LineDataPreview): boolean {
  return !!preview.animationUrl || !!preview.popupUrl
}

function parseStickers(doc: Document): LineSticker[] {
  return Array.from(doc.querySelectorAll(`li.FnStickerPreviewItem`))
    .map((element) => {
      const str = element.getAttribute(`data-preview`)
      if (!str) throw Error(`No data preview string for sticker`)
      return JSON.parse(str) as LineDataPreview
    })
    .map((data) => {
      const id = parseInt(data.id, 10)
      const url = getURL(data)
        .replace(`;compress=true`, ``)
        .replace(`android`, `ios`)
        .replace(`sticker.png`, `sticker@2x.png`)
      return { id, url, emojis: "" }
    })
}

export function parseStickerSet(doc: Document): LineStickerSet {
  const nameElement = doc.querySelector(`[data-test=sticker-name-title]`)
  if (!nameElement) throw Error(`No name element`)
  const name = nameElement.textContent
  if (!name) throw Error(`No name`)

  const authorElement = doc.querySelector(`[data-test=sticker-author]`)
  if (!authorElement) throw Error(`No author element`)
  const author = authorElement.textContent
  if (!author) throw Error(`No author name`)
  const authorUrl = `https://store.line.me${authorElement.getAttribute(`href`)}`

  const mainImageElement = doc.querySelector(`[data-widget=MainSticker]`)
  if (!mainImageElement) throw Error(`No main image`)
  const str = mainImageElement.getAttribute(`data-preview`)
  if (!str) throw Error(`No data preview string for main image`)
  const mainImageData: LineDataPreview = JSON.parse(str)
  const id = parseInt(mainImageData.id, 10)
  const animated = isAnimated(mainImageData)
  const mainImageUrl = getURL(mainImageData)
    .replace(`;compress=true`, ``)

  const stickers = parseStickers(doc)

  return { name, id, author, authorUrl, mainImageUrl, animated, stickers }
}
