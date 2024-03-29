import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/core/styles"
import { AppProps } from "next/app"
import Head from "next/head"
import React from "react"
import theme from "../src/theme"

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props

  return (
    <React.Fragment>
      <Head>
        <title>Stickers: Line to Telegram</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  )
}
