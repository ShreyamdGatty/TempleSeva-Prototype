import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Devotee } from '../../types'

interface DevoteeDetailsModalProps {
  devotee?: Devotee
  defaultUserName?: string
  onSave?: (devotee: Devotee) => void
  onClose?: () => void
  onToast?: (msg: string, variant: 'success' | 'error' | 'info' | 'warning') => void
}

/**
 * DevoteeDetailsModal is superseded by the full in-page devotee management tab
 * on the Profile Page (/profile?tab=devotees). If ever mounted, it silently redirects.
 */
const DevoteeDetailsModal = ({ onClose }: DevoteeDetailsModalProps) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (onClose) onClose()
    navigate('/profile?tab=devotees', { state: { tab: 'devotees' } })
  }, [navigate, onClose])

  return null
}

export default DevoteeDetailsModal
