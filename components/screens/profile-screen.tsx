'use client'

import {
  ChevronRight,
  Gift,
  Heart,
  HelpCircle,
  Leaf,
  MapPin,
  Settings,
  Store,
  Wallet,
  X,
  Plus,
  LogOut,
  type LucideIcon,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { Modal } from '@/components/ui/modal'
import { useStore } from '@/lib/store'
import { ScreenHeader } from '@/components/screen-header'

export function ProfileScreen() {
  const { user, orders, navigate, logout, toast, removeAddress, addAddress } = useStore()
  const delivered = useMemo(() => orders.filter((o) => o.status === 'delivered').length, [orders])
  const [addAddressOpen, setAddAddressOpen] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newLine, setNewLine] = useState('')

  if (!user) return null

  const handleAddAddress = () => {
    if (!newLabel || !newLine) return
    addAddress({
      id: Math.random().toString(36).slice(2, 11),
      label: newLabel,
      line: newLine,
      icon: 'MapPin',
    })
    setNewLabel('')
    setNewLine('')
    setAddAddressOpen(false)
    toast('Address added successfully')
  }

  const handleLogout = () => {
    logout()
    toast('Logged out successfully')
  }

  return (
    <div className="min-h-dvh bg-background pb-24">
      <ScreenHeader title="Profile" showBack={false} />

      {/* User card */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary font-display text-2xl font-bold text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="font-display text-xl font-bold text-foreground truncate">{user.name}</h1>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-accent/12 px-2.5 py-0.5 text-xs font-bold text-accent">
              {user.role === 'admin' ? 'Administrator' : 'CARLAUN Prime'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            title="Logout"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-4">
        <Stat label="Orders" value={String(orders.length)} />
        <Stat label="Delivered" value={String(delivered)} />
        <Stat label="Eco Points" value={String(user.ecoPoints)} />
      </div>

      {/* Wallet */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-gradient-to-br from-primary to-accent p-5 text-primary-foreground">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium opacity-90">
              <Wallet className="h-3.5 w-3.5" /> CARLAUN Wallet
            </p>
            <p className="mt-1 font-display text-2xl font-bold">₹250.00</p>
          </div>
          <button
            onClick={() => toast('Add money coming soon', 'info')}
            className="rounded-full bg-card/20 px-4 py-2 text-xs font-semibold backdrop-blur"
          >
            Add Money
          </button>
        </div>
      </div>

      {/* Saved addresses */}
      <div className="px-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Saved Addresses
          </p>
          <button
            onClick={() => setAddAddressOpen(true)}
            className="flex items-center gap-1 text-xs font-bold text-primary"
          >
            <Plus className="h-3 w-3" /> Add New
          </button>
        </div>
        <div className="space-y-2">
          {user.addresses.map((a) => (
            <div
              key={a.id}
              className="group relative flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3 pr-10"
            >
              <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{a.label}</p>
                <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
                  {a.line}
                </p>
              </div>
              <button
                onClick={() => {
                  removeAddress(a.id)
                  toast('Address removed')
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 py-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <MenuItem icon={Gift} label="Refer & Earn" onClick={() => toast('Share your code: AARAV50')} />
          <MenuItem icon={Heart} label="Favourite Services" onClick={() => toast('No favourites yet', 'info')} />
          <MenuItem icon={Leaf} label="My Eco Impact" onClick={() => toast('You saved 1,240 L of water')} />
          <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => navigate({ name: 'help' })} />
          <MenuItem icon={Settings} label="Settings" onClick={() => navigate({ name: 'settings' })} />
        </div>
      </div>

      {/* Role switcher for demo */}
      <div className="px-4 pb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Demo · Switch Dashboard
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate({ name: 'provider' })}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold text-foreground"
          >
            <Store className="h-4 w-4" /> Provider
          </button>
          <button
            onClick={() => navigate({ name: 'admin' })}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold text-foreground"
          >
            <Settings className="h-4 w-4" /> Admin
          </button>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        open={addAddressOpen}
        onClose={() => setAddAddressOpen(false)}
        title="Add New Address"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="address-label" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Label</label>
            <input
              id="address-label"
              placeholder="e.g. Home, Office, Gym"
              className="w-full rounded-xl border border-border bg-muted/50 py-3 px-4 text-sm outline-none focus:border-primary"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="address-full" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Address</label>
            <textarea
              id="address-full"
              placeholder="Enter complete address details…"
              rows={3}
              className="w-full rounded-xl border border-border bg-muted/50 py-3 px-4 text-sm outline-none focus:border-primary resize-none"
              value={newLine}
              onChange={(e) => setNewLine(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddAddress}
            disabled={!newLabel || !newLine}
            className="w-full rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            Save Address
          </button>
        </div>
      </Modal>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <p className="font-display text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function MenuItem({
  icon: IconCmp,
  label,
  onClick,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left last:border-0"
    >
      <IconCmp className="h-4.5 w-4.5 text-muted-foreground" />
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  )
}
