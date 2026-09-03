'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  LifeBuoy,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { ScreenHeader } from '@/components/screen-header'

const FAQS = [
  {
    q: 'How do I track my order?',
    a: 'You can track your order in real-time by going to the "Track" tab in the bottom navigation bar. We provide updates at every stage from pickup to delivery.',
  },
  {
    q: 'What is the turnaround time?',
    a: 'Standard turnaround is 24-48 hours depending on the service. Express service (24 hours) is available for an additional charge.',
  },
  {
    q: 'How do I pay for my order?',
    a: 'We support UPI, Credit/Debit cards, and Cash on Delivery. You can also use your CARLAUN Wallet for faster checkouts.',
  },
  {
    q: 'What if my clothes are damaged?',
    a: 'We take utmost care of your garments. In the rare event of damage, please contact support within 24 hours of delivery. We have a comprehensive insurance policy for your peace of mind.',
  },
]

export function HelpScreen() {
  const { back } = useStore()

  return (
    <div className="min-h-dvh bg-background pb-24">
      <ScreenHeader title="Help & Support" onBack={back} />

      <div className="px-4 py-6 space-y-8">
        {/* Contact Support */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground text-pretty">Contact Support</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ContactCard
              icon={MessageCircle}
              label="WhatsApp"
              sub="Chat with us"
              color="bg-green-500"
            />
            <ContactCard
              icon={Phone}
              label="Call Us"
              sub="1800-CARLAUN"
              color="bg-blue-500"
            />
            <ContactCard
              icon={Mail}
              label="Email"
              sub="support@carlaun.com"
              color="bg-primary"
            />
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="mb-4 font-display text-lg font-bold text-foreground">Common Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </section>

        {/* Links */}
        <section className="pt-4 border-t border-border">
          <div className="flex flex-col gap-2">
            <button className="flex items-center justify-between py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Terms of Service <ChevronRight className="h-4 w-4" />
            </button>
            <button className="flex items-center justify-between py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Privacy Policy <ChevronRight className="h-4 w-4" />
            </button>
            <button className="flex items-center justify-between py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Refund Policy <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function ContactCard({ icon: Icon, label, sub, color }: any) {
  return (
    <button className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-sm">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </button>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="text-sm font-semibold text-foreground">{question}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50 bg-muted/20"
          >
            <p className="p-4 text-sm leading-relaxed text-muted-foreground">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
