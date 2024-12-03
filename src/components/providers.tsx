"use client"

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { HTTPException } from "hono/http-exception"
import { PropsWithChildren, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

interface ProviderProps extends PropsWithChildren {
  themeProps?: ThemeProviderProps
}

export const Providers = ({ children, themeProps }: ProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (err) => {
            let errorMessage: string
            if (err instanceof HTTPException) {
              errorMessage = err.message
            } else if (err instanceof Error) {
              errorMessage = err.message
            } else {
              errorMessage = "An unknown error occurred."
            }
            // toast notify user, log as an example
            console.log(errorMessage)
          },
        }),
      })
  )

  return (
    <NextThemesProvider {...themeProps}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextThemesProvider>
  )
}
