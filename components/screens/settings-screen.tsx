'use client'

import {
  Bell,
  ChevronRight,
  Moon,
  Sun,
  Trash2,
  Zap,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ScreenHeader } from '@/components/screen-header'

export function SettingsScreen() {
  const {
    theme,
    setTheme,
    recommendationsEnabled,
    setRecommendationsEnabled,
    remindersEnabled,
    setRemindersEnabled,
    clearCache,
    back,
  } = useStore()

  return (
    <div className="min-h-dvh bg-background pb-24">
      <ScreenHeader title="Settings" onBack={back} />

      <div className="px-4 py-4 space-y-6">
        {/* Appearance */}
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Appearance
          </p>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
                <div>
                  <p className="text-sm font-medium text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Adjust app theme</p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Notifications
          </p>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Recommendations</p>
                  <p className="text-xs text-muted-foreground">Personalized offers & tips</p>
                </div>
              </div>
              <Switch
                checked={recommendationsEnabled}
                onChange={setRecommendationsEnabled}
              />
            </div>
            <div className="flex items-center justify-between px-4 py-4 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Reminders</p>
                  <p className="text-xs text-muted-foreground">Order pickups & drop-offs</p>
                </div>
              </div>
              <Switch
                checked={remindersEnabled}
                onChange={setRemindersEnabled}
              />
            </div>
          </div>
        </section>

        {/* Data & Storage */}
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Data & Storage
          </p>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <button
              onClick={clearCache}
              className="flex w-full items-center justify-between px-4 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-foreground">Clear Cache</p>
                  <p className="text-xs text-muted-foreground">Free up local space</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
