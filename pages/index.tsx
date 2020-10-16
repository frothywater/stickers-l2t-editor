import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core"
import { Error as ErrorIcon, Replay as ReplayIcon, Save as SaveIcon } from "@material-ui/icons"
import { Alert } from "@material-ui/lab"
import { cloneDeep } from "lodash"
import React, { CSSProperties, useEffect, useState } from "react"
import EmojiTextfield from "../components/EmojiTextfield"
import StickerCard from "../components/StickerCard"
import { fetchDoc, parseStickerSet } from "../src/functions"
import { LineStickerSet } from "../src/typings"

const boxStyle: CSSProperties = {
  display: "flex",
  margin: "180px 20px 0px 20px",
  flexDirection: "column",
  alignItems: "center",
  flexWrap: "wrap",
}

export default function Index() {
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)

  const [url, setUrl] = useState("")

  const [userInput, setUserInput] = useState("")
  const [inputError, setInputError] = useState(false)
  const handleUrlTextfieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (inputError) setInputError(false)
    setUserInput(event.target.value)
  }

  const [fillAllEmoji, setFillAllEmoji] = useState("")
  const handleFillAllEmojiTextfieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFillAllEmoji(event.target.value)
  }

  const [stickerSet, setStickerSet] = useState<LineStickerSet | null>(null)

  const [alert, setAlert] = useState(false)

  useEffect(() => {
    if (url !== "" && !stickerSet) {
      setLoading(true)
      fetchDoc(url)
        .then((doc) => {
          setStickerSet(parseStickerSet(doc))
          setLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
          setFailed(true)
        })
    }
  }, [url])

  const handleLoad = () => {
    const regex = /^https:\/\/store.line.me\/stickershop\/product\/\d+(\/.*)?/
    if (regex.test(userInput)) setUrl(userInput)
    else setInputError(true)
  }

  const handleRetry = () => {
    setUrl("")
    setFailed(false)
    setStickerSet(null)
  }

  const handleEmojiChange = (stickerId: number, value: string) => {
    if (stickerSet) {
      const newSet: LineStickerSet = cloneDeep(stickerSet)
      const stickerFound = newSet.stickers.find((sticker) => sticker.id === stickerId)
      if (stickerFound) {
        stickerFound.emojis = value
        setStickerSet(newSet)
      }
    }
  }

  const handleFillAll = (value: string) => {
    if (stickerSet) {
      const newSet: LineStickerSet = cloneDeep(stickerSet)
      newSet.stickers.forEach((sticker) => (sticker.emojis = value))
      setStickerSet(newSet)
    }
  }

  const handleExport = () => {
    if (stickerSet) {
      if (stickerSet.stickers.some((sticker) => !sticker.emojis || sticker.emojis === "")) {
        setAlert(true)
        return
      }
      const file = new Blob([JSON.stringify(stickerSet, null, 2)], { type: "application/json" })
      const element = document.createElement("a")
      element.setAttribute("href", URL.createObjectURL(file))
      element.setAttribute("download", `LineStickerSet-${stickerSet?.id}.json`)
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  const UrlPage = (
    <div style={boxStyle}>
      <TextField
        style={{ width: "100%", maxWidth: 600 }}
        label="URL"
        error={inputError}
        value={userInput}
        onChange={handleUrlTextfieldChange}
        helperText="Example: https://store.line.me/stickershop/product/1962096/en"
      />
      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: 30, width: 80 }}
        onClick={handleLoad}
      >
        Go
      </Button>
    </div>
  )

  const ErrorPage = (
    <div style={boxStyle}>
      <ErrorIcon color="error" style={{ fontSize: 50 }} />
      <Button style={{ marginTop: 30, width: 80 }} onClick={handleRetry}>
        Retry
      </Button>
    </div>
  )

  const LoadingPage = (
    <div style={boxStyle}>
      <CircularProgress color="secondary" />
    </div>
  )

  const StickerGrid = (
    <Grid container style={{ justifyContent: "center" }}>
      {stickerSet?.stickers.map((sticker) => (
        <Grid item key={`${sticker.id}-${sticker.emojis}`}>
          <StickerCard
            sticker={sticker}
            onChange={(e) => handleEmojiChange(sticker.id, e.target.value)}
          />
        </Grid>
      ))}
    </Grid>
  )

  const ControlArea = (
    <>
      <EmojiTextfield value={fillAllEmoji} onChange={handleFillAllEmojiTextfieldChange} />
      <Button color="inherit" onClick={() => handleFillAll(fillAllEmoji)}>
        Fill All
      </Button>
      <IconButton color="inherit" aria-label="export" onClick={handleExport}>
        <SaveIcon />
      </IconButton>
      <IconButton color="inherit" aria-label="reset" onClick={handleRetry}>
        <ReplayIcon />
      </IconButton>
    </>
  )

  return (
    <>
      <AppBar position="relative" style={{}}>
        <Toolbar>
          <Typography style={{ marginLeft: 12, flexGrow: 1 }} variant="h6">
            {!!stickerSet
              ? `${stickerSet.name} by ${stickerSet.author}`
              : "Stickers: Line to Telegram"}
          </Typography>
          {!!stickerSet && ControlArea}
        </Toolbar>
      </AppBar>
      <Container style={{ margin: "30px 0 80px 0" }}>
        {url === "" && UrlPage}
        {loading && LoadingPage}
        {failed && ErrorPage}
        {!!stickerSet && StickerGrid}
        <Snackbar open={alert} autoHideDuration={6000} onClose={() => setAlert(false)}>
          <Alert onClose={() => setAlert(false)} severity="warning">
            All stickers need an emoji!
          </Alert>
        </Snackbar>
      </Container>
    </>
  )
}
