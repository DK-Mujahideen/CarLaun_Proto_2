'use client'

import { useEffect, type ReactNode } from 'react'
import { AppShell } from '@/components/app-shell'
import { StoreProvider } from '@/lib/store'

function HideNativeSplash() {
  useEffect(() => {
    // Only runs inside the Capacitor native wrapper; no-op on the plain web build.
    import('@capacitor/core')
      .then(async ({ Capacitor }) => {
        if (!Capacitor.isNativePlatform()) return
        const { SplashScreen } = await import('@capacitor/splash-screen')
        await SplashScreen.hide()
      })
      .catch(() => {})
  }, [])
  return null
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <HideNativeSplash />
      {children ?? <AppShell />}
    </StoreProvider>
  )
}
