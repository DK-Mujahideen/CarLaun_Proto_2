'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, Camera, Send, CheckCircle2 } from 'lucide-react'
import { useStore } from '@/lib/store'
import { ScreenHeader } from '@/components/screen-header'

export function ComplaintScreen() {
  const { back, orders, toast } = useStore()
  const [orderId, setOrderId] = useState('')
  const [category, setComplaintCategory] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId || !category || !description) {
      toast('Please fill in all required fields', 'error')
      return
    }

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true)
      toast('Complaint registered successfully', 'success')
    }, 1000)
  }

  if (submitted) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Complaint Received</h2>
            <p className="mt-2 text-muted-foreground">
              Your ticket ID is <span className="font-mono font-bold text-primary">#TIC{Math.floor(Math.random() * 9000) + 1000}</span>.
              Our team will get back to you within 4 hours.
            </p>
          </div>
          <button
            onClick={back}
            className="w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg active:scale-95 transition-all"
          >
            Back to Support
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background pb-24 text-pretty">
      <ScreenHeader title="Raise Complaint" onBack={back} />

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Related Order</label>
            <select
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/50 py-3 px-4 text-sm outline-none focus:border-primary appearance-none"
            >
              <option value="" disabled>Select an order</option>
              {orders.map(o => (
                <option key={o.id} value={o.id}>Order {o.id} ({new Date(o.createdAt).toLocaleDateString()})</option>
              ))}
              <option value="general">General Issue (Not order specific)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Complaint Category</label>
            <div className="grid grid-cols-2 gap-2">
              {['Delayed Pickup', 'Item Damage', 'Missing Item', 'Payment Issue', 'Quality Issue', 'Other'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setComplaintCategory(cat)}
                  className={`rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                    category === cat
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-card text-muted-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Describe the issue</label>
            <textarea
              placeholder="Tell us what went wrong…"
              rows={4}
              className="w-full rounded-xl border border-border bg-muted/50 py-3 px-4 text-sm outline-none focus:border-primary resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attach Photos (Optional)</label>
            <button
              type="button"
              onClick={() => toast('Camera access coming soon', 'info')}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-6 text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
            >
              <Camera className="h-5 w-5" />
              <span className="text-sm font-medium">Add Photo</span>
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-primary/5 p-4 border border-primary/20">
          <AlertCircle className="h-5 w-5 text-primary shrink-0" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            We take every complaint seriously. If this is an urgent matter regarding an active delivery, please call our 24/7 hotline at <span className="font-bold text-foreground">1800-CARLAUN</span>.
          </p>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] active:scale-[0.98] transition-all"
        >
          <Send className="h-4 w-4" /> Submit Complaint
        </button>
      </form>
    </div>
  )
}
