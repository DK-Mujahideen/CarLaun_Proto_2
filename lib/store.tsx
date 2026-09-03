'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import {
  ADDRESSES,
  ADMIN_EMAILS,
  COUPONS,
  EXPRESS_MULTIPLIER,
  getItem,
  getService,
  ORDER_STATUS_STEPS,
  SEED_PAST_ORDER,
} from './data'
import type {
  Address,
  CareLevel,
  CareSelection,
  CartLine,
  Coupon,
  Order,
  OrderStatus,
  User,
  View,
} from './types'

const DELIVERY_FEE = 40

export interface Toast {
  id: number
  message: string
  variant: 'success' | 'error' | 'info'
}

interface ServiceGroup {
  serviceId: string
  serviceName: string
  care: CareLevel
  lines: { itemId: string; name: string; unit: string; qty: number; unitPrice: number }[]
  itemCount: number
  amount: number
}

interface StoreValue {
  // navigation
  view: View
  navigate: (view: View) => void
  back: () => void

  // cart
  cart: CartLine[]
  care: CareSelection
  addItem: (serviceId: string, itemId: string) => void
  removeItem: (serviceId: string, itemId: string) => void
  setQty: (serviceId: string, itemId: string, qty: number) => void
  getQty: (serviceId: string, itemId: string) => number
  setCare: (serviceId: string, level: CareLevel) => void
  clearCart: () => void
  groups: ServiceGroup[]
  totalItems: number

  // pricing
  subtotal: number
  delivery: number
  discount: number
  total: number

  // coupon
  coupon: Coupon | null
  couponError: string | null
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void

  // checkout
  address: Address
  setAddress: (a: Address) => void
  providerId: string
  setProviderId: (id: string) => void
  pickupDate: string
  setPickupDate: (d: string) => void
  pickupSlot: string
  setPickupSlot: (s: string) => void
  payment: string
  setPayment: (p: string) => void

  // location
  location: string
  setLocation: (l: string) => void

  // orders
  orders: Order[]
  placeOrder: () => Order
  advanceStatus: (orderId: string, status: OrderStatus) => void
  reorder: (orderId: string) => void
  getOrder: (id: string) => Order | undefined

  // toasts
  toasts: Toast[]
  toast: (message: string, variant?: Toast['variant']) => void
  dismissToast: (id: number) => void

  // auth
  user: User | null
  login: (email: string, password?: string) => boolean
  signup: (email: string, name: string, password?: string) => void
  socialLogin: (provider: 'google' | 'apple') => void
  logout: () => void

  // address management
  addAddress: (address: Address) => void
  removeAddress: (id: string) => void

  // settings
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
  recommendationsEnabled: boolean
  setRecommendationsEnabled: (v: boolean) => void
  remindersEnabled: boolean
  setRemindersEnabled: (v: boolean) => void
  clearCache: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

function linePrice(unitPrice: number, care: CareLevel) {
  return Math.round(unitPrice * (care === 'express' ? EXPRESS_MULTIPLIER : 1))
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<View[]>([{ name: 'login' }])
  const view = history[history.length - 1]

  const [cart, setCart] = useState<CartLine[]>([])
  const [care, setCareState] = useState<CareSelection>({})
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [address, setAddress] = useState<Address>(ADDRESSES[1])
  const [providerId, setProviderId] = useState('')
  const [pickupDate, setPickupDate] = useState('Today')
  const [pickupSlot, setPickupSlot] = useState('')
  const [payment, setPayment] = useState('')
  const [location, setLocation] = useState('Chennai')
  const [orders, setOrders] = useState<Order[]>([SEED_PAST_ORDER])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('carlaun_user')
    const savedOrders = localStorage.getItem('carlaun_orders')

    if (savedUser) {
      const u = JSON.parse(savedUser)
      setUser(u)
      setHistory([{ name: u.role === 'admin' ? 'admin' : 'home' }])
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }

    setIsInitialized(true)
  }, [])

  // Save persistence
  useEffect(() => {
    if (!isInitialized) return
    if (user) {
      localStorage.setItem('carlaun_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('carlaun_user')
    }
  }, [user, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem('carlaun_orders', JSON.stringify(orders))
  }, [orders, isInitialized])

  const toast = useCallback((message: string, variant: Toast['variant'] = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, variant }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 2600)
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  // settings state
  const [theme, setThemeState] = useState<'light' | 'dark'>('light')
  const [recommendationsEnabled, setRecommendationsEnabled] = useState(true)
  const [remindersEnabled, setRemindersEnabled] = useState(true)

  const setTheme = useCallback((t: 'light' | 'dark') => {
    setThemeState(t)
    if (typeof document !== 'undefined') {
      if (t === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [])

  const clearCache = useCallback(() => {
    setCart([])
    toast('Cache cleared successfully', 'success')
  }, [toast])

  const navigate = useCallback((next: View) => {
    setHistory((h) => [...h, next])
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const back = useCallback(() => {
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h))
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const login = useCallback(
    (email: string, password?: string) => {
      // Simulate login check
      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase())

      // In a real app, you'd check the password here.
      // For the prototype, we'll accept anything if it's the admin,
      // or if it's a "known" user (simulated by checking if it matches the SEED user).

      const newUser: User = {
        id: 'U' + Math.floor(Math.random() * 1000),
        name: isAdmin ? 'Admin User' : 'Aarav Sharma',
        email,
        role: isAdmin ? 'admin' : 'user',
        ecoPoints: 340,
        addresses: [...ADDRESSES],
      }
      setUser(newUser)
      navigate({ name: isAdmin ? 'admin' : 'home' })
      return true
    },
    [navigate],
  )

  const signup = useCallback(
    (email: string, name: string, password?: string) => {
      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase())
      const newUser: User = {
        id: 'U' + Math.floor(Math.random() * 1000),
        name,
        email,
        role: isAdmin ? 'admin' : 'user',
        ecoPoints: 0,
        addresses: [...ADDRESSES],
      }
      setUser(newUser)
      navigate({ name: isAdmin ? 'admin' : 'home' })
    },
    [navigate],
  )

  const socialLogin = useCallback(
    (provider: 'google' | 'apple') => {
      // Simulate social login redirect/success
      const newUser: User = {
        id: 'U' + Math.floor(Math.random() * 1000),
        name: `Social User (${provider})`,
        email: `social@${provider}.com`,
        role: 'user',
        ecoPoints: 0,
        addresses: [...ADDRESSES],
      }
      setUser(newUser)
      navigate({ name: 'home' })
    },
    [navigate],
  )

  const logout = useCallback(() => {
    setUser(null)
    setHistory([{ name: 'login' }])
  }, [])

  const addAddress = useCallback((a: Address) => {
    setUser((prev) => {
      if (!prev) return prev
      return { ...prev, addresses: [a, ...prev.addresses] }
    })
  }, [])

  const removeAddress = useCallback((id: string) => {
    setUser((prev) => {
      if (!prev) return prev
      return { ...prev, addresses: prev.addresses.filter((a) => a.id !== id) }
    })
  }, [])

  const setCare = useCallback((serviceId: string, level: CareLevel) => {
    setCareState((c) => ({ ...c, [serviceId]: level }))
  }, [])

  const getQty = useCallback(
    (serviceId: string, itemId: string) =>
      cart.find((l) => l.serviceId === serviceId && l.itemId === itemId)?.qty ?? 0,
    [cart],
  )

  const setQty = useCallback((serviceId: string, itemId: string, qty: number) => {
    setCart((c) => {
      const existing = c.find((l) => l.serviceId === serviceId && l.itemId === itemId)
      if (qty <= 0) {
        return c.filter((l) => !(l.serviceId === serviceId && l.itemId === itemId))
      }
      if (existing) {
        return c.map((l) =>
          l.serviceId === serviceId && l.itemId === itemId ? { ...l, qty } : l,
        )
      }
      return [...c, { serviceId, itemId, qty }]
    })
    setCareState((cs) => (cs[serviceId] ? cs : { ...cs, [serviceId]: 'standard' }))
  }, [])

  const addItem = useCallback(
    (serviceId: string, itemId: string) => {
      const current = cart.find((l) => l.serviceId === serviceId && l.itemId === itemId)?.qty ?? 0
      setQty(serviceId, itemId, current + 1)
    },
    [cart, setQty],
  )

  const removeItem = useCallback(
    (serviceId: string, itemId: string) => {
      const current = cart.find((l) => l.serviceId === serviceId && l.itemId === itemId)?.qty ?? 0
      setQty(serviceId, itemId, current - 1)
    },
    [cart, setQty],
  )

  const clearCart = useCallback(() => {
    setCart([])
    setCareState({})
    setCoupon(null)
    setCouponError(null)
  }, [])

  const groups = useMemo<ServiceGroup[]>(() => {
    const map = new Map<string, ServiceGroup>()
    for (const line of cart) {
      const service = getService(line.serviceId)
      const item = getItem(line.serviceId, line.itemId)
      if (!service || !item) continue
      const level = care[line.serviceId] ?? 'standard'
      const unitPrice = linePrice(item.price, level)
      if (!map.has(line.serviceId)) {
        map.set(line.serviceId, {
          serviceId: line.serviceId,
          serviceName: service.name,
          care: level,
          lines: [],
          itemCount: 0,
          amount: 0,
        })
      }
      const g = map.get(line.serviceId)!
      g.lines.push({
        itemId: line.itemId,
        name: item.name,
        unit: item.unit,
        qty: line.qty,
        unitPrice,
      })
      g.itemCount += line.qty
      g.amount += unitPrice * line.qty
    }
    return Array.from(map.values())
  }, [cart, care])

  const totalItems = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart])
  const subtotal = useMemo(() => groups.reduce((s, g) => s + g.amount, 0), [groups])

  const discount = useMemo(() => {
    if (!coupon || subtotal === 0) return 0
    if (coupon.type === 'freeDelivery') return 0
    if (coupon.type === 'percent') {
      const raw = Math.round((subtotal * coupon.value) / 100)
      return coupon.cap ? Math.min(raw, coupon.cap) : raw
    }
    if (coupon.type === 'flat') {
      if (coupon.serviceId) {
        const g = groups.find((x) => x.serviceId === coupon.serviceId)
        if (!g) return 0
        return Math.min(coupon.value, g.amount)
      }
      return Math.min(coupon.value, subtotal)
    }
    return 0
  }, [coupon, subtotal, groups])

  const delivery = useMemo(() => {
    if (subtotal === 0) return 0
    if (coupon?.type === 'freeDelivery') return 0
    return DELIVERY_FEE
  }, [subtotal, coupon])

  const total = Math.max(0, subtotal + delivery - discount)

  const applyCoupon = useCallback(
    (code: string) => {
      const clean = code.trim().toUpperCase()
      const found = COUPONS[clean]
      if (!found) {
        setCouponError('This coupon code is not valid.')
        setCoupon(null)
        return false
      }
      if (found.serviceId && !cart.some((l) => l.serviceId === found.serviceId)) {
        const svc = getService(found.serviceId)
        setCouponError(`Add a ${svc?.name} item to use ${clean}.`)
        setCoupon(null)
        return false
      }
      setCoupon(found)
      setCouponError(null)
      return true
    },
    [cart],
  )

  const removeCoupon = useCallback(() => {
    setCoupon(null)
    setCouponError(null)
  }, [])

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders])

  const placeOrder = useCallback((): Order => {
    const id = 'CLN' + Math.floor(10000 + Math.random() * 89999)
    const order: Order = {
      id,
      createdAt: Date.now(),
      status: 'scheduled',
      services: groups.map((g) => ({
        serviceId: g.serviceId,
        serviceName: g.serviceName,
        itemCount: g.itemCount,
        amount: g.amount,
      })),
      lines: [...cart],
      care: { ...care },
      address,
      providerId,
      pickupDate,
      pickupSlot: pickupSlot || '6–8 PM',
      payment: payment || 'UPI',
      subtotal,
      delivery,
      discount,
      total,
      couponCode: coupon?.code,
    }
    setOrders((o) => [order, ...o])
    setCart([])
    setCareState({})
    setCoupon(null)
    setCouponError(null)
    setProviderId('')
    setPickupSlot('')
    setPayment('')
    return order
  }, [groups, cart, care, address, providerId, pickupDate, pickupSlot, payment, subtotal, delivery, discount, total, coupon])

  const advanceStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((o) => o.map((x) => (x.id === orderId ? { ...x, status } : x)))
  }, [])

  const reorder = useCallback(
    (orderId: string) => {
      const order = orders.find((o) => o.id === orderId)
      if (!order) return
      setCart((c) => {
        const next = [...c]
        for (const line of order.lines) {
          const existing = next.find(
            (l) => l.serviceId === line.serviceId && l.itemId === line.itemId,
          )
          if (existing) existing.qty += line.qty
          else next.push({ ...line })
        }
        return next
      })
      setCareState((cs) => ({ ...order.care, ...cs }))
    },
    [orders],
  )

  const value: StoreValue = {
    view,
    navigate,
    back,
    cart,
    care,
    addItem,
    removeItem,
    setQty,
    getQty,
    setCare,
    clearCart,
    groups,
    totalItems,
    subtotal,
    delivery,
    discount,
    total,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    address,
    setAddress,
    providerId,
    setProviderId,
    pickupDate,
    setPickupDate,
    pickupSlot,
    setPickupSlot,
    payment,
    setPayment,
    location,
    setLocation,
    orders,
    placeOrder,
    advanceStatus,
    reorder,
    getOrder,
    toasts,
    toast,
    dismissToast,
    user,
    login,
    signup,
    socialLogin,
    logout,
    addAddress,
    removeAddress,
    theme,
    setTheme,
    recommendationsEnabled,
    setRecommendationsEnabled,
    remindersEnabled,
    setRemindersEnabled,
    clearCache,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export { ORDER_STATUS_STEPS }
