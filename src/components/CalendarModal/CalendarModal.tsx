import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

interface CalendarModalProps {
  selectedDate: string
  onSelectDate: (dateStr: string, dateObj: Date) => void
  onClose: () => void
}

export const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate()

export const isBeforeToday = (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return target.getTime() < today.getTime()
}

const CalendarModal = ({ selectedDate: _selectedDate, onSelectDate, onClose }: CalendarModalProps) => {
  const { language, t, formatDateLocalized } = useLanguage()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [tempSelectedDate, setTempSelectedDate] = useState<Date>(() => {
    // If selectedDate matches something like "16 Oct", parse it for current year
    return new Date()
  })

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  const monthNamesKn = [
    'ಜನವರಿ', 'ಫೆಬ್ರವರಿ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿಲ್', 'ಮೇ', 'ಜೂನ್',
    'ಜುಲೈ', 'ಆಗಸ್ಟ್', 'ಸೆಪ್ಟೆಂಬರ್', 'ಅಕ್ಟೋಬರ್', 'ನವೆಂಬರ್', 'ಡಿಸೆಂಬರ್',
  ]

  const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weekDaysKn = ['ಭಾನು', 'ಸೋಮ', 'ಮಂಗಳ', 'ಬುಧ', 'ಗುರು', 'ಶುಕ್ರ', 'ಶನಿ']

  const monthNames = language === 'KN' ? monthNamesKn : monthNamesEn
  const weekDays = language === 'KN' ? weekDaysKn : weekDaysEn

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  // First day of current view month
  const firstDayIndex = new Date(year, month, 1).getDay()
  // Number of days in current view month
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const handlePrevMonth = () => {
    // Prevent navigating into past months before current month
    const prev = new Date(year, month - 1, 1)
    if (prev.getFullYear() < today.getFullYear() || (prev.getFullYear() === today.getFullYear() && prev.getMonth() < today.getMonth())) {
      return
    }
    setCurrentMonth(prev)
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const isPrevDisabled =
    year === today.getFullYear() && month <= today.getMonth()

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(year, month, day)
    if (isBeforeToday(clickedDate)) return
    setTempSelectedDate(clickedDate)
  }

  const handleConfirm = () => {
    const formatted = formatDateLocalized(tempSelectedDate)
    onSelectDate(formatted, tempSelectedDate)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container w-full max-w-[340px] sm:max-w-[360px] max-h-[92vh] overflow-y-auto bg-[#fffdf9] p-3.5 sm:p-4.5 shadow-2xl rounded-2xl mx-auto"
        style={{ maxWidth: '360px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#eadfd1] pb-2.5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#c1440e]">
              {t('step1DateTitle')}
            </p>
            <h2 className="mt-0.5 font-serif text-lg sm:text-xl font-bold">{t('calendarTitle')}</h2>
            <p className="mt-0.5 text-[11px] text-[#8b7a6d]">{t('calendarSub')}</p>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            ×
          </button>
        </div>

        {/* Month Navigation */}
        <div className="mt-3 flex items-center justify-between rounded-lg bg-[#f5ede2] p-1.5">
          <button
            onClick={handlePrevMonth}
            disabled={isPrevDisabled}
            className="grid h-7 w-7 place-items-center rounded-md bg-white text-xs font-bold shadow-xs transition hover:bg-[#ebdcc9] disabled:opacity-30 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
            title="Previous Month"
          >
            ‹
          </button>
          <span className="font-serif text-sm sm:text-base font-bold text-[#34251e]">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="grid h-7 w-7 place-items-center rounded-md bg-white text-xs font-bold shadow-xs transition hover:bg-[#ebdcc9] cursor-pointer"
            title="Next Month"
          >
            ›
          </button>
        </div>

        {/* Legend */}
        <div className="mt-2 flex items-center justify-center gap-3 text-[10px] font-medium text-[#75685d]">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-[#d4a64a] bg-[#fdf5e6]" />
            {t('todayBadge')}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c1440e]" />
            {t('selectedBadge')}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e3d7ca] opacity-50" />
            {language === 'KN' ? 'ನಿಷ್ಕ್ರಿಯ' : 'Disabled'}
          </span>
        </div>

        {/* Weekday Names */}
        <div className="mt-2.5 grid grid-cols-7 gap-1 text-center text-[10.5px] font-bold uppercase tracking-wider text-[#8b7a6d]">
          {weekDays.map((day) => (
            <div key={day} className="py-0.5">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="mt-1 grid grid-cols-7 gap-1">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8 sm:h-8.5" />
          ))}

          {/* Days of Month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNumber = i + 1
            const cellDate = new Date(year, month, dayNumber)
            cellDate.setHours(0, 0, 0, 0)

            const isPast = isBeforeToday(cellDate)
            const isToday = isSameDay(cellDate, today)
            const isChosen = isSameDay(cellDate, tempSelectedDate)

            return (
              <button
                key={dayNumber}
                type="button"
                disabled={isPast}
                onClick={() => handleDayClick(dayNumber)}
                className={`group relative flex h-8 sm:h-8.5 flex-col items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                  isPast
                    ? 'cursor-not-allowed bg-transparent text-[#b5a496] opacity-35 line-through'
                    : isChosen
                    ? 'scale-105 bg-[#c1440e] text-white shadow-xs font-bold'
                    : isToday
                    ? 'border-2 border-[#d4a64a] bg-[#fef9f0] text-[#7a4800] hover:bg-[#fdebc8]'
                    : 'bg-white text-[#34251e] border border-[#eadfd1] hover:border-[#c1440e] hover:bg-[#faf4ec]'
                }`}
              >
                <span>{dayNumber}</span>

                {/* TODAY indicator badge */}
                {isToday && (
                  <span
                    className={`absolute -top-1 rounded-full px-1 py-0 text-[7px] font-black uppercase tracking-tight shadow-xs ${
                      isChosen ? 'bg-[#d4a64a] text-[#34251e]' : 'bg-[#d4a64a] text-white'
                    }`}
                  >
                    {t('todayBadge')}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Selected date preview and confirm button */}
        <div className="mt-3 border-t border-[#eadfd1] pt-2.5">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold">
            <span className="text-[#8b7a6d]">{t('selectedBadge')}:</span>
            <span className="font-serif text-sm sm:text-base font-bold text-[#c1440e]">
              {formatDateLocalized(tempSelectedDate)}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#d8c8b8] py-2 text-xs sm:text-sm font-bold text-[#674f40] transition hover:bg-[#f5ede2]"
            >
              {t('calendarClose')}
            </button>
            <button
              onClick={handleConfirm}
              className="btn-primary flex-1 py-2 text-xs sm:text-sm rounded-lg"
            >
              {t('calendarConfirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarModal
