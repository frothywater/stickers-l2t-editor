import { TextField } from "@material-ui/core"
import emojiRegex from "emoji-regex"
import GraphemeSplitter from "grapheme-splitter"
import React, { useState } from "react"

interface EmojiTextfieldProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function hasDuplicates(array: string[]): boolean {
  let dict: { [key: string]: boolean } = {}
  for (let item of array) {
    if (!dict[item]) dict[item] = true
    else return true
  }
  return false
}

export default function EmojiTextfield({ value, onChange }: EmojiTextfieldProps) {
  const [localValue, setLocalValue] = useState<string>(value)

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    if (newValue === "") {
      setLocalValue(newValue)
      onChange(event)
    } else {
      const matches = Array.from(newValue.match(emojiRegex()) ?? [])
      const emojiCount = matches.length
      const stringLength = new GraphemeSplitter().countGraphemes(newValue)
      if (emojiCount === stringLength && !hasDuplicates(matches)) {
        setLocalValue(newValue)
        onChange(event)
      }
    }
  }

  return <TextField color="secondary" value={localValue} onChange={handleTextChange} />
}
