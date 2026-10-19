import { useState, useCallback, useEffect, useMemo } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'

// Types
import type { Temple, Seva, Order, User, Address, Devotee } from './types'

// Data
import { dates, STORAGE_TEMPLE, temples, sevas } from './data'
import { readJson } from './utils/storage'

// Contexts
import { ToastProvider, useToast } from './contexts/ToastContext'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'

// Hooks
import { useAuth } from './hooks/useAuth'
import { useCart } from './hooks/useCart'
import { useOrders } from './hooks/useOrders'
import { useWishlist } from './hooks/useWishlist'
import { useAddresses } from './hooks/useAddresses'
import { useDevotees } from './hooks/useDevotees'

// Layouts
import MainLayout from './layouts/MainLayout/MainLayout'

// Pages
import HomePage from './pages/HomePage/HomePage'
import SevasPage from './pages/SevasPage/SevasPage'
import MySevasPage from './pages/MySevasPage/MySevasPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'

// Components
import ToastContainer from './components/Toast/Toast'
import AuthModal from './components/AuthModal/AuthModal'
import TemplePicker from './components/TemplePicker/TemplePicker'
import DevoteeModal from './components/DevoteeModal/DevoteeModal'
import CheckoutModal from './components/CheckoutModal/CheckoutModal'
import ReceiptModal from './components/ReceiptModal/ReceiptModal'
import OrdersModal from './components/OrdersModal/OrdersModal'
import ProfileModal from './components/ProfileModal/ProfileModal'
import SevaDetailModal from './components/SevaDetailModal/SevaDetailModal'
import PaymentQrModal from './components/PaymentQrModal/PaymentQrModal'
import SideMenuDrawer from './components/SideMenuDrawer/SideMenuDrawer'

const AppContent = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { language, t, translateTemple } = useLanguage()

  // ── Auth ──────────────────────────────────────────────
  const { user, registeredUser, authMode, setAuthMode, login, logout, register, updateUser } = useAuth()

  // ── Temple & Booking State (persisted across page navigation) ────
  const [selectedTemple, setSelectedTemple] = useState<Temple>(() =>
    readJson<Temple | null>(STORAGE_TEMPLE, null) || temples[0]
  )
  const [pickerOpen, setPickerOpen] = useState(false)
  const [isNewUserJustRegistered, setIsNewUserJustRegistered] = useState(false)
  const [isNewUserSelection, setIsNewUserSelection] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)

  // ── Cart ──────────────────────────────────────────────
  const {
    cart,
    subtotal,
    discount,
    total,
    appliedCoupon,
    couponError,
    devoteeSeva,
    setDevoteeSeva,
    devotee,
    setDevotee,
    addSeva,
    addDevoteeSeva,
    changeQty,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart,
    updateCartDate,
  } = useCart()

  // ── Orders ────────────────────────────────────────────
  const { orders, ordersOpen, setOrdersOpen, createOrder, cancelOrder } = useOrders()

  // ── Temple-Scoped Orders ──────────────────────────────
  const templeOrders = useMemo(() => {
    return orders.filter((o) => o.temple?.id === selectedTemple.id)
  }, [orders, selectedTemple.id])

  // ── Wishlist ──────────────────────────────────────────
  const { wishlist, toggle: toggleWish, isWished } = useWishlist()

  // ── Temple-Scoped Wishlist ────────────────────────────
  const templeWishlist = useMemo(() => {
    return wishlist.filter((sevaId) => {
      const seva = sevas.find((s) => s.id === sevaId)
      return seva && seva.templeId === selectedTemple.id
    })
  }, [wishlist, selectedTemple.id])

  // ── Addresses ─────────────────────────────────────────
  const { addresses, defaultAddress, addAddress, removeAddress, setDefault: setDefaultAddress } = useAddresses()

  // ── Devotees (Scoped specifically for the active temple) ──
  const { devotees, addDevotee, updateDevotee, removeDevotee } = useDevotees(user?.name, selectedTemple.id)

  // Automatically synchronize dates of items in cart whenever selectedDate changes
  useEffect(() => {
    if (selectedDate && cart.length > 0) {
      updateCartDate(selectedDate)
    }
  }, [selectedDate, cart.length, updateCartDate])

  // ── Seva Detail Modal State ───────────────────────────
  const [activeSevaDetail, setActiveSevaDetail] = useState<Seva | null>(null)

  // ── Checkout & Receipt State ──────────────────────────
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState<Order | null>(null)
  const [qrPassOpen, setQrPassOpen] = useState(false)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)

  const handleNavigateToMySevas = useCallback(() => {
    navigate('/my-sevas')
  }, [navigate])

  const handleNavigateToProfile = useCallback(() => {
    navigate('/profile')
  }, [navigate])

  const handleNavigateToDevotees = useCallback(() => {
    navigate('/profile?tab=devotee-list', { state: { tab: 'devotee-list' } })
  }, [navigate])

  const handleNavigateToWishlist = useCallback(() => {
    navigate('/profile?tab=wishlist', { state: { tab: 'wishlist' } })
  }, [navigate])

  const handleAddToCartFromWishlist = useCallback(
    (seva: Seva) => {
      // 1. Choose auspicious date
      const now = new Date()
      const defaultDate = `${now.getDate()} ${now.toLocaleString('en-US', { month: 'short' })}`
      const dateToUse = selectedDate || defaultDate
      if (!selectedDate) {
        setSelectedDate(dateToUse)
      }

      // 2. Switch temple if seva belongs to another sanctuary
      if (seva.templeId && (!selectedTemple || selectedTemple.id !== seva.templeId)) {
        const matching = temples.find((t) => t.id === seva.templeId)
        if (matching) {
          setSelectedTemple(matching)
          window.localStorage.setItem(STORAGE_TEMPLE, JSON.stringify(matching))
        }
      }

      // 3. Add to cart silently without showing any warning or toast message
      addSeva(seva, dateToUse)

      // 4. Navigate directly to /sevas and instruct it to immediately open the cart!
      navigate('/sevas', { state: { openCart: true } })
    },
    [selectedDate, setSelectedDate, selectedTemple, setSelectedTemple, addSeva, navigate]
  )

  // ── Handlers ──────────────────────────────────────────
  const handleRegister = useCallback(
    (account: User) => {
      register(account)
      setIsNewUserJustRegistered(true)
      window.sessionStorage.setItem('temple-seva.isNewUserRegistered', 'true')
      window.localStorage.setItem('temple-seva.mustSelectTemple', 'true')
    },
    [register]
  )

  const handleLogin = useCallback(
    (account: User) => {
      login(account)
      setAuthMode(null)

      const isNewUser =
        isNewUserJustRegistered ||
        window.sessionStorage.getItem('temple-seva.isNewUserRegistered') === 'true' ||
        window.localStorage.getItem('temple-seva.mustSelectTemple') === 'true'

      setIsNewUserJustRegistered(false)
      window.sessionStorage.removeItem('temple-seva.isNewUserRegistered')
      window.localStorage.removeItem('temple-seva.mustSelectTemple')

      if (isNewUser) {
        // Clear previous selected temple from local storage so the newly registered user chooses fresh
        window.localStorage.removeItem(STORAGE_TEMPLE)
        setIsNewUserSelection(true)
        setPickerOpen(true)
        addToast(
          language === 'KN'
            ? `ಸ್ವಾಗತ, ${account.name}! ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪವಿತ್ರ ದೇವಾಲಯವನ್ನು ಆರಿಸಿ.`
            : `Welcome, ${account.name}! Please select your sacred sanctuary to begin.`,
          'success'
        )
        navigate('/sevas')
      } else {
        setIsNewUserSelection(false)
        const savedTemple = readJson<Temple | null>(STORAGE_TEMPLE, null) || selectedTemple || temples[0]
        setSelectedTemple(savedTemple)
        window.localStorage.setItem(STORAGE_TEMPLE, JSON.stringify(savedTemple))
        setPickerOpen(false)
        addToast(
          language === 'KN'
            ? `ಮರಳಿ ಸ್ವಾಗತ, ${account.name}!`
            : `Welcome back, ${account.name}!`,
          'success'
        )
        navigate('/sevas')
      }
    },
    [login, isNewUserJustRegistered, selectedTemple, navigate, addToast, language, setAuthMode]
  )

  const handleLogout = useCallback(() => {
    logout()
    setSelectedTemple(temples[0])
    window.localStorage.removeItem(STORAGE_TEMPLE)
    clearCart()
    addToast(language === 'KN' ? 'ನೀವು ಯಶಸ್ವಿಯಾಗಿ ನಿರ್ಗಮಿಸಿದ್ದೀರಿ.' : 'You have been logged out.', 'info')
    navigate('/')
  }, [logout, clearCart, navigate, addToast, language])

  const selectTemple = useCallback(
    (temple: Temple) => {
      const isDifferent = !selectedTemple || selectedTemple.id !== temple.id
      setSelectedTemple(temple)
      window.localStorage.setItem(STORAGE_TEMPLE, JSON.stringify(temple))
      if (isDifferent) {
        setSelectedDate('')
        clearCart()
      }
      setPickerOpen(false)
      setIsNewUserSelection(false)
      const loc = translateTemple(temple)
      addToast(
        language === 'KN'
          ? `${loc.name} ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಶುಭ ದಿನಾಂಕವನ್ನು ಆರಿಸಿ.`
          : `${loc.name} selected. Please pick an auspicious date.`,
        'success'
      )
      navigate('/sevas')
    },
    [selectedTemple, clearCart, addToast, language, translateTemple, navigate]
  )

  const switchTemple = useCallback(() => {
    // Open picker without resetting current temple or cart so cancel restores everything
    setPickerOpen(true)
  }, [])

  const handleCompleteOrder = useCallback(
    (paymentMethod: string, addressOrAllocations?: Address | Record<string, Devotee[]>) => {
      if (!selectedTemple || !selectedDate || cart.length === 0) return null
      let address: Address | undefined
      let allocations: Record<string, Devotee[]> | undefined

      if (addressOrAllocations && 'line1' in addressOrAllocations) {
        address = addressOrAllocations as Address
      } else if (addressOrAllocations) {
        allocations = addressOrAllocations as Record<string, Devotee[]>
      }

      const finalItems = cart.map((it) => {
        const assigned = allocations?.[it.id]
        return {
          ...it,
          ticketDevotees: assigned || it.ticketDevotees,
          devotee: (assigned && assigned[0]) || it.devotee,
        }
      })

      const order = createOrder(
        selectedTemple,
        selectedDate,
        finalItems,
        subtotal,
        discount,
        total,
        paymentMethod,
        address,
        appliedCoupon?.code
      )
      clearCart()
      setCheckoutOpen(false)
      setPaymentSuccess(order)
      addToast(
        language === 'KN'
          ? `ಸೇವೆ ಯಶಸ್ವಿಯಾಗಿ ಕಾಯ್ದಿರಿಸಲ್ಪಟ್ಟಿದೆ! ಆರ್ಡರ್ ಸಂಖ್ಯೆ: ${order.id}`
          : `Offering booked successfully! Order ID: ${order.id}`,
        'success'
      )
      return order
    },
    [selectedTemple, selectedDate, cart, subtotal, discount, total, appliedCoupon, createOrder, clearCart, addToast, language]
  )

  const handleReorder = useCallback(
    (order: Order) => {
      setSelectedTemple(order.temple)
      setSelectedDate(order.date)
      clearCart()
      order.items.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          addSeva(item.seva, order.date, addToast)
        }
      })
      setOrdersOpen(false)
      addToast(
        language === 'KN'
          ? `${order.id} ನ ಸೇವೆಗಳನ್ನು ನಿಮ್ಮ ಬುಟ್ಟಿಗೆ ಮರು-ಸೇರಿಸಲಾಗಿದೆ.`
          : `Re-added items from ${order.id} to your basket.`,
        'success'
      )
      navigate('/sevas')
    },
    [clearCart, addSeva, addToast, navigate, setOrdersOpen, language]
  )

  const navigateToSevas = useCallback(
    (temple?: Temple) => {
      if (temple) {
        setSelectedTemple(temple)
        window.localStorage.setItem(STORAGE_TEMPLE, JSON.stringify(temple))
        setPickerOpen(false)
        if (user) {
          navigate('/sevas')
        } else {
          setAuthMode('login')
        }
        return
      }

      if (user) {
        const saved = selectedTemple || readJson<Temple | null>(STORAGE_TEMPLE, null) || temples[0]
        setSelectedTemple(saved)
        setPickerOpen(false)
        navigate('/sevas')
      } else {
        setAuthMode('login')
      }
    },
    [user, selectedTemple, navigate, setAuthMode]
  )

  const totalSpent = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <>
      <ToastContainer />

      <Routes>
        {/* ── Home Route ── */}
        <Route
          path="/"
          element={
            <MainLayout
              user={user}
              cartCount={cart.length}
              wishlistCount={templeWishlist.length}
              ordersCount={templeOrders.length}
              onLogin={() => setAuthMode('login')}
              onRegister={() => setAuthMode('register')}
              onOrders={handleNavigateToMySevas}
              onProfile={handleNavigateToProfile}
              onWishlist={handleNavigateToWishlist}
              onDevoteeDetails={handleNavigateToDevotees}
              onOpenQrPass={() => setQrPassOpen(true)}
              onSwitchTemple={() => setPickerOpen(true)}
              onLogout={handleLogout}
            >
              <HomePage
                navigateToSevas={navigateToSevas}
                onRegister={() => setAuthMode('register')}
                user={user}
              />
            </MainLayout>
          }
        />

        {/* ── Sevas Route ── */}
        <Route
          path="/sevas"
          element={
            <div className="sevas-route min-h-screen bg-[#fffcf6] text-[#34251e]">
              <SevasPage
                selectedTemple={selectedTemple}
                pickerOpen={pickerOpen}
                switchTemple={switchTemple}
                onSelectTemple={selectTemple}
                dates={dates}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                addSeva={addSeva}
                cart={cart}
                subtotal={subtotal}
                discount={discount}
                total={total}
                appliedCoupon={appliedCoupon}
                changeQty={changeQty}
                removeItem={removeItem}
                onPay={() => {
                  if (!user) {
                    setAuthMode('login')
                  } else {
                    setCheckoutOpen(true)
                  }
                }}
                user={user}
                logout={handleLogout}
                onOrders={handleNavigateToMySevas}
                onProfile={handleNavigateToProfile}
                onWishlist={handleNavigateToWishlist}
                wishlistCount={templeWishlist.length}
                ordersCount={templeOrders.length}
                onDevoteeDetails={handleNavigateToDevotees}
                onOpenQrPass={() => setQrPassOpen(true)}
                onLogin={() => setAuthMode('login')}
                onRegister={() => setAuthMode('register')}
                isWished={isWished}
                onToggleWish={toggleWish}
                onViewSevaDetails={(seva) => setActiveSevaDetail(seva)}
                showToast={addToast}
                devotees={devotees}
                onAddDevotee={addDevotee}
                onCompleteOrder={handleCompleteOrder}
                updateCartDate={updateCartDate}
              />
            </div>
          }
        />

        {/* ── My Sevas Full Page Route ── */}
        <Route
          path="/my-sevas"
          element={
            <MySevasPage
              user={user}
              orders={templeOrders}
              selectedTemple={selectedTemple}
              switchTemple={switchTemple}
              devotees={devotees}
              onAddDevotee={addDevotee}
              onUpdateDevotee={updateDevotee}
              onRemoveDevotee={removeDevotee}
              onCancelOrder={(id) => {
                cancelOrder(id)
                addToast(language === 'KN' ? 'ಸೇವೆ ರದ್ದುಗೊಂಡಿದೆ.' : 'Order cancelled.', 'info')
              }}
              onReorder={handleReorder}
              onOpenQrPass={() => setQrPassOpen(true)}
              onOpenSideMenu={() => setSideMenuOpen(true)}
              onLogin={() => setAuthMode('login')}
              onRegister={() => setAuthMode('register')}
              onProfile={handleNavigateToProfile}
              onWishlist={handleNavigateToWishlist}
              wishlistCount={templeWishlist.length}
              showToast={addToast}
            />
          }
        />

        {/* ── BookMyShow Style Profile / My Account Page Route ── */}
        <Route
          path="/profile"
          element={
            <ProfilePage
              user={user}
              addresses={addresses}
              onUpdateUser={updateUser}
              onWishlist={handleNavigateToWishlist}
              onOrders={handleNavigateToMySevas}
              onOpenQrPass={() => setQrPassOpen(true)}
              onOpenSideMenu={() => setSideMenuOpen(true)}
              onLogout={handleLogout}
              showToast={addToast}
              onDevoteeDetails={handleNavigateToDevotees}
              onSwitchTemple={() => setPickerOpen(true)}
              selectedTemple={selectedTemple}
              orders={templeOrders}
              wishlist={templeWishlist}
              onToggleWishlist={toggleWish}
              onAddToCart={handleAddToCartFromWishlist}
              devotees={devotees}
              onAddDevotee={addDevotee}
              onUpdateDevotee={updateDevotee}
              onRemoveDevotee={removeDevotee}
            />
          }
        />
      </Routes>

      {/* ── Modals & Drawers ── */}

      {/* Auth Modal */}
      {authMode && (
        <AuthModal
          mode={authMode}
          registeredUser={registeredUser}
          onRegister={handleRegister}
          onLogin={handleLogin}
          onClose={() => setAuthMode(null)}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}

      {/* Devotee Details Modal */}
      {devoteeSeva && (
        <DevoteeModal
          seva={devoteeSeva}
          devotee={devotee}
          setDevotee={setDevotee}
          onAdd={() => addDevoteeSeva(addToast)}
          onClose={() => setDevoteeSeva(null)}
        />
      )}

      {/* Seva Detail & Reviews Modal */}
      {activeSevaDetail && (
        <SevaDetailModal
          seva={activeSevaDetail}
          isWished={isWished(activeSevaDetail.id)}
          onToggleWish={() => toggleWish(activeSevaDetail.id)}
          onAdd={() => {
            addSeva(activeSevaDetail, selectedDate, addToast)
            setActiveSevaDetail(null)
          }}
          onClose={() => setActiveSevaDetail(null)}
        />
      )}

      {/* Multi-Step Checkout Modal */}
      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          subtotal={subtotal}
          discount={discount}
          total={total}
          appliedCoupon={appliedCoupon}
          couponError={couponError}
          onApplyCoupon={applyCoupon}
          onRemoveCoupon={removeCoupon}
          addresses={addresses}
          defaultAddress={defaultAddress}
          onAddAddress={addAddress}
          onPay={handleCompleteOrder}
          onClose={() => setCheckoutOpen(false)}
        />
      )}

      {/* Receipt Modal */}
      {paymentSuccess && (
        <ReceiptModal
          order={paymentSuccess}
          onClose={() => setPaymentSuccess(null)}
          onTrack={() => {
            setPaymentSuccess(null)
            navigate('/my-sevas')
          }}
        />
      )}

      {/* Orders & Tracking Timeline Modal */}
      {ordersOpen && (
        <OrdersModal
          orders={templeOrders}
          onClose={() => setOrdersOpen(false)}
          onTrack={() => {}}
          onCancel={(id) => {
            cancelOrder(id)
            addToast(language === 'KN' ? 'ಸೇವೆ ರದ್ದುಗೊಂಡಿದೆ.' : 'Order cancelled.', 'info')
          }}
          onReorder={handleReorder}
        />
      )}

      {/* User Profile & Address Manager Modal */}
      {profileOpen && user && (
        <ProfileModal
          user={user}
          addresses={addresses}
          orderCount={templeOrders.length}
          totalSpent={templeOrders.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0)}
          onClose={() => setProfileOpen(false)}
          onLogout={handleLogout}
          onUpdateUser={(updates) => {
            updateUser(updates)
            addToast(language === 'KN' ? 'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲ್ಪಟ್ಟಿದೆ!' : 'Profile updated successfully!', 'success')
          }}
          onRemoveAddress={removeAddress}
          onSetDefaultAddress={setDefaultAddress}
        />
      )}

      {/* Payment QR Pass Modal for Successful Bookings */}
      {qrPassOpen && (
        <PaymentQrModal
          orders={templeOrders}
          selectedTemple={selectedTemple}
          onClose={() => setQrPassOpen(false)}
          onNavigateToSevas={() => navigateToSevas()}
          onToast={addToast}
        />
      )}

      {/* Global Sanctuary Picker Modal */}
      {pickerOpen && (
        <TemplePicker
          selectedTemple={selectedTemple}
          onSelect={selectTemple}
          onClose={() => {
            setPickerOpen(false)
            setIsNewUserSelection(false)
          }}
          isNewUserSelection={isNewUserSelection}
        />
      )}

      {/* Global Slide Menu Drawer */}
      <SideMenuDrawer
        isOpen={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        user={user}
        wishlistCount={templeWishlist.length}
        ordersCount={templeOrders.length}
        selectedTemple={selectedTemple}
        onWishlist={handleNavigateToWishlist}
        onDevoteeDetails={handleNavigateToDevotees}
        onProfile={handleNavigateToProfile}
        onLogout={handleLogout}
        onOrders={handleNavigateToMySevas}
        onOpenQrPass={() => setQrPassOpen(true)}
        onSwitchTemple={() => setPickerOpen(true)}
        onLogin={() => setAuthMode('login')}
        onRegister={() => setAuthMode('register')}
      />
    </>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
