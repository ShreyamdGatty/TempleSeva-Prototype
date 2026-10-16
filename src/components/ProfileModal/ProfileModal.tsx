import { useState } from 'react'
import type { User, Address } from '../../types'
import { getInitials, formatPrice } from '../../utils/helpers'
import { useLanguage } from '../../contexts/LanguageContext'

interface ProfileModalProps {
  user: User
  addresses: Address[]
  orderCount: number
  totalSpent: number
  onClose: () => void
  onLogout: () => void
  onUpdateUser: (updates: Partial<User>) => void
  onRemoveAddress: (id: string) => void
  onSetDefaultAddress: (id: string) => void
}

const ProfileModal = ({
  user, addresses, orderCount, totalSpent,
  onClose, onLogout, onUpdateUser, onRemoveAddress, onSetDefaultAddress,
}: ProfileModalProps) => {
  const { t } = useLanguage()
  const [tab, setTab] = useState<'profile' | 'addresses'>('profile')
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(user.name)
  const [editPhone, setEditPhone] = useState(user.phone || '')

  const handleSave = () => {
    onUpdateUser({ name: editName, phone: editPhone || undefined })
    setEditing(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#c1440e]">{t('profileSub')}</p>
            <h2 className="mt-2 font-serif text-3xl font-bold">{t('profileTitle')}</h2>
          </div>
          <button onClick={onClose} className="modal-close cursor-pointer" aria-label="Close">×</button>
        </div>

        {/* Avatar + Name */}
        <div className="mt-5 flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#c1440e] to-[#d4a64a] text-xl font-bold text-white shadow-md">
            {getInitials(user.name)}
          </div>
          <div>
            <p className="font-serif text-xl font-bold">{user.name}</p>
            <p className="text-sm text-[#8b7a6d]">{user.email}</p>
            {user.phone && <p className="text-xs text-[#8b7a6d]">{user.phone}</p>}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-[#f5ede2] p-3 text-center">
            <p className="font-serif text-xl font-bold text-[#c1440e]">{orderCount}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b7a6d]">{t('ordersStat')}</p>
          </div>
          <div className="rounded-xl bg-[#f5ede2] p-3 text-center">
            <p className="font-serif text-xl font-bold text-[#c1440e]">{formatPrice(totalSpent)}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b7a6d]">{t('spentStat')}</p>
          </div>
          <div className="rounded-xl bg-[#f5ede2] p-3 text-center">
            <p className="font-serif text-xl font-bold text-[#c1440e]">{addresses.length}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b7a6d]">{t('addressesStat')}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex border-b border-[#eadfd1]">
          <button
            onClick={() => setTab('profile')}
            className={`pb-3 pr-6 text-sm font-bold transition cursor-pointer ${tab === 'profile' ? 'border-b-2 border-[#c1440e] text-[#c1440e]' : 'text-[#8b7a6d]'}`}
          >
            {t('tabPersonalInfo')}
          </button>
          <button
            onClick={() => setTab('addresses')}
            className={`pb-3 pr-6 text-sm font-bold transition cursor-pointer ${tab === 'addresses' ? 'border-b-2 border-[#c1440e] text-[#c1440e]' : 'text-[#8b7a6d]'}`}
          >
            {t('tabAddresses')} ({addresses.length})
          </button>
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="mt-5">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#8b7a6d]">
                    {t('fullNamePlaceholder')}
                  </label>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#8b7a6d]">
                    {t('phonePlaceholder')}
                  </label>
                  <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="input-field" placeholder="Add phone number" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#8b7a6d]">
                    {t('emailPlaceholder')}
                  </label>
                  <input value={user.email} disabled className="input-field cursor-not-allowed opacity-60" />
                  <p className="mt-1 text-xs text-[#8b7a6d]">{t('emailCannotChange')}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setEditing(false)} className="flex-1 rounded-xl border border-[#d8c8b8] py-2.5 text-sm font-bold cursor-pointer hover:bg-[#f5ede2]">
                    {t('cancelBtn')}
                  </button>
                  <button onClick={handleSave} className="flex-1 rounded-xl bg-[#c1440e] py-2.5 text-sm font-bold text-white cursor-pointer hover:bg-[#a5370a]">
                    {t('saveBtn')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-[#f9f4ee] p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#8b7a6d]">{t('fullNamePlaceholder')}</p>
                      <p className="mt-1 font-semibold">{user.name}</p>
                    </div>
                    <button onClick={() => setEditing(true)} className="text-sm font-bold text-[#c1440e] cursor-pointer hover:underline">
                      {t('editBtn')}
                    </button>
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-wider text-[#8b7a6d]">{t('emailPlaceholder')}</p>
                  <p className="mt-1 font-semibold">{user.email}</p>
                  {user.phone && (
                    <>
                      <p className="mt-3 text-xs uppercase tracking-wider text-[#8b7a6d]">{t('phonePlaceholder')}</p>
                      <p className="mt-1 font-semibold">{user.phone}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {tab === 'addresses' && (
          <div className="mt-5">
            {addresses.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#8b7a6d]">No saved addresses.</p>
            ) : (
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <div key={addr.id} className="rounded-xl border border-[#eadfd1] bg-white p-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#f5ede2] px-2 py-0.5 text-[10px] font-bold uppercase">{addr.label}</span>
                      {addr.isDefault && <span className="text-[10px] font-bold text-[#c1440e]">{t('setDefaultBtn')}</span>}
                    </div>
                    <p className="mt-1 text-sm font-semibold">{addr.name} · {addr.phone}</p>
                    <p className="text-xs text-[#8b7a6d]">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    <div className="mt-2 flex gap-2">
                      {!addr.isDefault && (
                        <button onClick={() => onSetDefaultAddress(addr.id)} className="text-xs font-bold text-[#c1440e] cursor-pointer hover:underline">
                          {t('setDefaultBtn')}
                        </button>
                      )}
                      <button onClick={() => onRemoveAddress(addr.id)} className="text-xs font-bold text-[#d94444] cursor-pointer hover:underline">
                        {t('removeBtn')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <button onClick={onLogout} className="mt-6 w-full rounded-xl border border-[#d94444] py-3 text-sm font-bold text-[#d94444] cursor-pointer hover:bg-[#fde8e8]">
          {t('navLogout')}
        </button>
      </div>
    </div>
  )
}

export default ProfileModal
