import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "../components/providers"
import { EB_Garamond } from "next/font/google"
import { cn } from "@/lib/utils"

import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const eb_garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "SweeP - Your Go-To Analytics Platform",
  description:
    "SweeP is a modern analytics platform that helps you track your data and make informed decisions.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn(inter.variable, eb_garamond.variable)}>
        <body className="min-h-[calc(100vh-1px)] flex flex-col font-sans antialiased">
          <main className="relative flex-1 flex flex-col ">
            <Providers
              themeProps={{
                attribute: "class",
                defaultTheme: "dark",
                enableSystem: true,
                disableTransitionOnChange: true,
              }}
            >
              {children}
            </Providers>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
