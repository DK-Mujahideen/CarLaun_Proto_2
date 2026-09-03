'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Clock,
  MapPin,
  Search,
  Star,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { OFFERS, PARTNERS, SERVICES } from '@/lib/data'
import { Icon } from '@/lib/icons'
import { useStore } from '@/lib/store'

export function Marketplace() {
  const { navigate, location, user, setProviderId } = useStore()

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* 1. Advertisement Bar */}
      <Reveal className="mb-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary p-6 text-primary-foreground shadow-[var(--shadow-lift)]">
          <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Limited Time
              </span>
              <h2 className="font-display text-2xl font-extrabold tracking-tight">
                Launch Special: Free Pickup!
              </h2>
              <p className="max-w-md text-sm text-primary-foreground/80">
                Get your laundry picked up and delivered for free on your first 3 orders. Use code <span className="font-bold text-white">FREEDEL</span>
              </p>
            </div>
            <button className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary transition-transform active:scale-95">
              Claim Now
            </button>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -right-12 -top-12 size-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 left-1/4 size-32 rounded-full bg-accent/20 blur-xl" />
        </div>
      </Reveal>

      {/* 2. Welcome & Categories */}
      <div className="mb-8">
        <Reveal>
          <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
            Hey {user?.name.split(' ')[0] || 'there'},
          </h1>
          <p className="text-muted-foreground">What can we take care of today?</p>
        </Reveal>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05}>
              <button
                onClick={() => navigate({ name: 'service', serviceId: s.id })}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className="flex size-16 items-center justify-center rounded-3xl text-primary-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg sm:size-20"
                  style={{ background: s.accent }}
                >
                  <Icon name={s.icon} className="size-8 sm:size-10" strokeWidth={1.5} />
                </div>
                <span className="text-center text-xs font-bold text-foreground sm:text-sm">
                  {s.name}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* 3. Offer Carousel */}
      <section className="mb-10">
        <Reveal className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-extrabold text-foreground">
            Deals for you
          </h3>
          <button className="flex items-center gap-1 text-xs font-bold text-primary">
            View all <ChevronRight className="size-3.5" />
          </button>
        </Reveal>

        <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
          {OFFERS.filter(o => o.featured).concat(OFFERS.filter(o => !o.featured)).map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[280px] shrink-0 rounded-[2rem] border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:min-w-[320px]"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="size-4 fill-current" />
                  <span className="text-xs font-bold uppercase tracking-widest">{offer.code}</span>
                </div>
                <div>
                  <h4 className="font-display text-lg font-extrabold text-foreground">{offer.title}</h4>
                  <p className="text-xs text-muted-foreground">{offer.description}</p>
                </div>
                <button className="mt-2 inline-flex w-fit items-center gap-1.5 text-xs font-bold text-primary">
                  Apply Coupon <ArrowRight className="size-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Care Partners (Swiggy Style List) */}
      <section>
        <Reveal className="mb-6">
          <h3 className="font-display text-xl font-extrabold text-foreground">
            Care Partners Near {location}
          </h3>
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['Ratings 4.5+', 'Fastest', 'Laundry', 'Dry Clean', 'Offers'].map((filter) => (
              <button
                key={filter}
                className="shrink-0 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-semibold transition-colors hover:border-primary/40 hover:text-primary"
              >
                {filter}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          {PARTNERS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <button
                onClick={() => {
                  setProviderId(p.id)
                  navigate({ name: 'provider' })
                }}
                className="group flex w-full flex-col gap-4 text-left sm:flex-row sm:items-center"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-muted sm:aspect-square sm:w-40">
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 font-display text-3xl font-extrabold text-primary transition-transform duration-500 group-hover:scale-110">
                    {p.name.slice(0, 2)}
                  </div>
                  <div className="absolute bottom-2 left-2 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold text-foreground backdrop-blur">
                    {p.turnaround}
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-1 rounded-lg bg-success/10 px-2 py-1 text-xs font-bold text-success">
                      <Star className="size-3 fill-current" />
                      {p.rating}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{p.services}</p>

                  <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-primary" />
                      {p.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5 text-primary" />
                      {p.turnaround.split(' ')[0]} turnaround
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Sparkles className="size-3.5" />
                    FREE DELIVERY above ₹399
                  </div>
                </div>
              </button>
              <div className="mt-6 h-px w-full bg-border/50 last:hidden" />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
