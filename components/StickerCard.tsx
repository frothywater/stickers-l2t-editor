import { Card, CardContent } from "@material-ui/core"
import React, { useState } from "react"
import { LineSticker } from "../src/typings"
import EmojiTextfield from "./EmojiTextfield"

interface StickerCardProps {
  sticker: LineSticker
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function StickerCard({ sticker, onChange }: StickerCardProps) {
  const [emojis, setEmojis] = useState<string>(sticker.emojis)

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setEmojis(newValue)
    onChange(event)
  }

  return (
    <Card
      style={{
        width: 200,
        margin: "10px 10px",
      }}
    >
      <CardContent>
        <img
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          src={sticker.url}
        />
        <EmojiTextfield value={emojis} onChange={handleTextChange} />
      </CardContent>
    </Card>
  )
}
