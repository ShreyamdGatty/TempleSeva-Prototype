import React from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

export const HowTempleSevaWorks: React.FC = () => {
  const { language } = useLanguage()
  const isKn = language === 'KN'

  const steps = [
    {
      stepNum: 1,
      title: isKn ? 'ನೋಂದಣಿ ಮತ್ತು ಲಾಗಿನ್' : 'Register & Login',
      desc: isKn
        ? 'ಸೇವೆಗಳನ್ನು ವೀಕ್ಷಿಸಲು/ಬುಕ್ ಮಾಡಲು ಖಾತೆಯನ್ನು ರಚಿಸಿ ಅಥವಾ ಸೈನ್ ಇನ್ ಮಾಡಿ.'
        : 'Create an account or sign in to view/Book sevas.',
      badgeIcon: isKn ? '೧' : '1',
    },
    {
      stepNum: 2,
      title: isKn ? 'ನಿಮ್ಮ ದೇವಾಲಯ ಹುಡುಕಿ' : 'Find Your Temple',
      desc: isKn
        ? 'ನಿಮಗೆ ಇಷ್ಟವಾದ ಪವಿತ್ರ ಕ್ಷೇತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.'
        : 'Select your desired temple.',
      badgeIcon: isKn ? '೨' : '2',
    },
    {
      stepNum: 3,
      title: isKn ? 'ಸೇವೆಯನ್ನು ಆರಿಸಿ' : 'Select Seva',
      desc: isKn
        ? 'ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ನೀವು ಬಯಸಿದ ಸೇವೆಗಳನ್ನು ಆರಿಸಿ.'
        : 'Select the date and choose the Sevas you prefer.',
      badgeIcon: isKn ? '೩' : '3',
    },
    {
      stepNum: 4,
      title: isKn ? 'ಸುರಕ್ಷಿತ ಪಾವತಿ ಮಾಡಿ' : 'Make Payment',
      desc: isKn
        ? 'ಆಯ್ಕೆಮಾಡಿದ ಸೇವೆಗಳಿಗೆ ಡಿಜಿಟಲ್ ರೂಪದಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಪಾವತಿಸಿ.'
        : 'Securely complete payment for selected Sevas.',
      badgeIcon: isKn ? '೪' : '4',
    },
    {
      stepNum: 5,
      title: isKn ? 'ಕ್ಯೂಆರ್ ಕೋಡ್ ಪಡೆಯಿರಿ' : 'Generating QR Code',
      desc: isKn
        ? 'ದೃಢೀಕರಣದೊಂದಿಗೆ ಅನನ್ಯ ಡಿಜಿಟಲ್ ಬುಕಿಂಗ್ ಕ್ಯೂಆರ್ ಕೋಡ್ ಪಡೆಯಿರಿ.'
        : 'Receive a digital booking confirmation with a unique QR code.',
      badgeIcon: isKn ? '೫' : '5',
    },
    {
      stepNum: 6,
      title: isKn ? 'ದೇವಾಲಯಕ್ಕೆ ಭೇಟಿ ನೀಡಿ' : 'Visit the Temple',
      desc: isKn
        ? 'ಸೇವೆಗಳನ್ನು ಸ್ವೀಕರಿಸಲು ನಿಮ್ಮ ಕ್ಯೂಆರ್ ಕೋಡ್ ಅನ್ನು ತೋರಿಸಿ.'
        : 'Present your QR code to receive the Sevas.',
      badgeIcon: isKn ? '೬' : '6',
    },
  ]

  const renderStepIllustration = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return (
          /* Website Structure: Browser Window with Devotee Login / Register */
          <div className="w-[104px] xl:w-[112px] h-[78px] xl:h-[84px] rounded-lg bg-white shadow-md border border-[#cbd5e1] overflow-hidden flex flex-col text-left">
            {/* Browser Chrome Header */}
            <div className="bg-[#f1f5f9] border-b border-[#e2e8f0] px-1.5 py-0.5 flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              </div>
              <div className="flex-1 bg-white rounded px-1 py-[0.5px] border border-[#e2e8f0] flex items-center">
                <span className="text-[4.5px] text-[#64748b] truncate font-mono">templeseva.com/login</span>
              </div>
            </div>

            {/* Website Login Page UI */}
            <div className="p-1.5 bg-[#fdfaf5] flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#f1e5d5] pb-0.5">
                <div className="flex items-center gap-0.5">
                  <span className="text-[6.5px] text-[#c1440e]">ॐ</span>
                  <span className="text-[5.5px] font-bold text-[#34251e]">TempleSeva</span>
                </div>
                <span className="text-[4.5px] text-[#c1440e] font-semibold">Devotee Login</span>
              </div>

              <div className="flex flex-col gap-1 my-0.5">
                <div className="h-3 rounded bg-white border border-[#e2d5c5] px-1 flex items-center">
                  <span className="text-[4.5px] text-[#9c8978]">📱 Phone or Email</span>
                </div>
                <div className="h-3 rounded bg-white border border-[#e2d5c5] px-1 flex items-center">
                  <span className="text-[4.5px] text-[#9c8978]">🔒 Password</span>
                </div>
              </div>

              <div className="relative">
                <div className="w-full bg-[#c1440e] hover:bg-[#a73507] rounded py-0.5 text-center shadow-3xs cursor-pointer">
                  <span className="text-[6px] font-bold text-white leading-none block">Sign In →</span>
                </div>
                <div className="absolute -bottom-1 -right-0.5 text-[8px] pointer-events-none">
                  👆
                </div>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          /* Website Structure: Browser Window with Two Available Temples */
          <div className="w-[106px] xl:w-[114px] h-[78px] xl:h-[84px] rounded-lg bg-white shadow-md border border-[#cbd5e1] overflow-hidden flex flex-col text-left">
            {/* Browser Chrome Header */}
            <div className="bg-[#f1f5f9] border-b border-[#e2e8f0] px-1.5 py-0.5 flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              </div>
              <div className="flex-1 bg-white rounded px-1 py-[0.5px] border border-[#e2e8f0] flex items-center">
                <span className="text-[4.5px] text-[#64748b] truncate font-mono">templeseva.com/temples</span>
              </div>
            </div>

            {/* Website Temple Directory UI with 2 Temples */}
            <div className="p-1 bg-[#fdfaf5] flex-1 flex flex-col justify-between">
              {/* Search Bar */}
              <div className="h-2.5 rounded bg-white border border-[#e2d5c5] px-1 flex items-center gap-0.5 mb-0.5">
                <span className="text-[4px]">🔍</span>
                <span className="text-[4px] text-[#9c8978]">Search sacred temples...</span>
              </div>

              {/* 2 Temples Side by Side */}
              <div className="grid grid-cols-2 gap-1 flex-1">
                {/* Temple 1: Meenakshi */}
                <div className="rounded border border-[#c1440e]/40 bg-white overflow-hidden shadow-3xs flex flex-col justify-between">
                  <div className="relative h-6 bg-black/40 overflow-hidden">
                    <img
                      src="/temple-hero.webp"
                      alt="Meenakshi Temple"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-0.5 left-0.5 bg-emerald-600 text-white text-[2.5px] font-bold px-0.5 rounded-full leading-none">
                      Active
                    </span>
                    <span className="absolute top-0.5 right-0.5 bg-black/70 text-[#f8d07e] text-[2.5px] px-0.5 rounded-full leading-none">
                      ★
                    </span>
                  </div>
                  <div className="p-0.5 flex flex-col">
                    <p className="text-[4px] font-bold text-[#34251e] leading-tight truncate">Meenakshi</p>
                    <div className="mt-0.5 bg-[#c1440e] py-0.5 rounded text-[3.5px] font-bold text-white text-center leading-none shadow-3xs cursor-pointer">
                      View Sevas
                    </div>
                  </div>
                </div>

                {/* Temple 2: Tirupati Balaji */}
                <div className="rounded border border-[#ebd8c6] bg-white overflow-hidden shadow-3xs flex flex-col justify-between">
                  <div className="relative h-6 bg-black/40 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80"
                      alt="Tirupati Balaji"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-0.5 left-0.5 bg-emerald-600 text-white text-[2.5px] font-bold px-0.5 rounded-full leading-none">
                      Active
                    </span>
                    <span className="absolute top-0.5 right-0.5 bg-black/70 text-[#f8d07e] text-[2.5px] px-0.5 rounded-full leading-none">
                      ★
                    </span>
                  </div>
                  <div className="p-0.5 flex flex-col">
                    <p className="text-[4px] font-bold text-[#34251e] leading-tight truncate">Tirupati</p>
                    <div className="mt-0.5 bg-[#c1440e] py-0.5 rounded text-[3.5px] font-bold text-white text-center leading-none shadow-3xs cursor-pointer">
                      View Sevas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          /* Website Structure: Browser Window with Two Available Sevas (with Image and Add Button) */
          <div className="w-[106px] xl:w-[114px] h-[78px] xl:h-[84px] rounded-lg bg-white shadow-md border border-[#cbd5e1] overflow-hidden flex flex-col text-left">
            {/* Browser Chrome Header */}
            <div className="bg-[#f1f5f9] border-b border-[#e2e8f0] px-1.5 py-0.5 flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              </div>
              <div className="flex-1 bg-white rounded px-1 py-[0.5px] border border-[#e2e8f0] flex items-center">
                <span className="text-[4.5px] text-[#64748b] truncate font-mono">templeseva.com/sevas</span>
              </div>
            </div>

            {/* Website Seva Selection List with 2 Sevas & Images */}
            <div className="p-1 bg-[#fdfaf5] flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#f1e5d5] pb-0.5">
                <span className="text-[5px] font-bold text-[#34251e]">Available Sevas</span>
                <span className="text-[4px] text-[#c1440e] font-semibold">Select Sevas</span>
              </div>

              {/* 2 Available Sevas with image and Add button */}
              <div className="flex flex-col gap-0.5 my-0.5">
                {/* Seva 1: Daily Aarti */}
                <div className="bg-white border border-[#ebd8c6] rounded p-0.5 flex items-center justify-between shadow-3xs">
                  <div className="flex items-center gap-1">
                    <img
                      src="https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?auto=format&fit=crop&w=120&q=80"
                      alt="Aarti"
                      className="w-4 h-4 rounded object-cover border border-[#ebd8c6]"
                    />
                    <div>
                      <p className="text-[4.5px] font-bold text-[#34251e] leading-tight">Daily Aarti</p>
                      <p className="text-[4px] text-[#c1440e] font-semibold">₹101</p>
                    </div>
                  </div>
                  <div className="bg-[#c1440e] hover:bg-[#a73507] text-white px-1 py-0.5 rounded text-[4px] font-bold cursor-pointer leading-none shadow-3xs">
                    + Add
                  </div>
                </div>

                {/* Seva 2: Rudra Homam */}
                <div className="bg-[#fffbf7] border border-[#c1440e]/60 rounded p-0.5 flex items-center justify-between shadow-3xs">
                  <div className="flex items-center gap-1">
                    <img
                      src="https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=120&q=80"
                      alt="Homam"
                      className="w-4 h-4 rounded object-cover border border-[#ebd8c6]"
                    />
                    <div>
                      <p className="text-[4.5px] font-bold text-[#34251e] leading-tight">Rudra Homam</p>
                      <p className="text-[4px] text-[#c1440e] font-semibold">₹501</p>
                    </div>
                  </div>
                  <div className="bg-emerald-600 text-white px-1 py-0.5 rounded text-[4px] font-bold leading-none shadow-3xs">
                    ✓ Added
                  </div>
                </div>
              </div>

              <div className="w-full bg-[#c1440e] rounded py-0.5 text-center shadow-3xs">
                <span className="text-[5px] font-bold text-white leading-none block">Proceed to Booking →</span>
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          /* Website Structure: Browser Window with GPay, UPI, Credit Card, Debit Card */
          <div className="w-[106px] xl:w-[114px] h-[78px] xl:h-[84px] rounded-lg bg-white shadow-md border border-[#cbd5e1] overflow-hidden flex flex-col text-left">
            {/* Browser Chrome Header */}
            <div className="bg-[#f1f5f9] border-b border-[#e2e8f0] px-1.5 py-0.5 flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              </div>
              <div className="flex-1 bg-white rounded px-1 py-[0.5px] border border-[#e2e8f0] flex items-center">
                <span className="text-[4.5px] text-[#64748b] truncate font-mono">templeseva.com/pay</span>
              </div>
            </div>

            {/* Payment Options: GPay, UPI, Credit Card, Debit Card */}
            <div className="p-1 bg-[#fdfaf5] flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#f1e5d5] pb-0.5">
                <span className="text-[5px] font-bold text-[#34251e]">Payment Options</span>
                <span className="text-[5px] font-bold text-[#c1440e]">₹501</span>
              </div>

              <div className="grid grid-cols-2 gap-0.5 my-0.5">
                {/* GPay */}
                <div className="bg-white border border-[#c1440e] rounded p-0.5 flex items-center gap-0.5 shadow-3xs">
                  <span className="w-3 h-3 rounded bg-blue-50 text-[5px] flex items-center justify-center font-bold text-blue-600">G</span>
                  <span className="text-[3.5px] font-bold text-[#34251e]">GPay</span>
                  <span className="ml-auto text-[3px] text-[#c1440e]">●</span>
                </div>

                {/* UPI */}
                <div className="bg-white border border-[#e2d5c5] rounded p-0.5 flex items-center gap-0.5 shadow-3xs">
                  <span className="w-3 h-3 rounded bg-orange-50 text-[3.5px] flex items-center justify-center font-bold text-orange-600">UPI</span>
                  <span className="text-[3.5px] font-semibold text-[#34251e]">UPI</span>
                </div>

                {/* Credit Card */}
                <div className="bg-white border border-[#e2d5c5] rounded p-0.5 flex items-center gap-0.5 shadow-3xs">
                  <span className="text-[4.5px]">💳</span>
                  <span className="text-[3.2px] font-semibold text-[#34251e] leading-tight">Credit Card</span>
                </div>

                {/* Debit Card */}
                <div className="bg-white border border-[#e2d5c5] rounded p-0.5 flex items-center gap-0.5 shadow-3xs">
                  <span className="text-[4.5px]">🏧</span>
                  <span className="text-[3.2px] font-semibold text-[#34251e] leading-tight">Debit Card</span>
                </div>
              </div>

              <div className="w-full bg-emerald-600 hover:bg-emerald-700 rounded py-0.5 text-center shadow-3xs cursor-pointer">
                <span className="text-[5.5px] font-bold text-white leading-none block">Pay ₹501 Now →</span>
              </div>
            </div>
          </div>
        )
      case 5:
        return (
          /* Website Structure: Browser Window with Properly Fitted QR Code Pass */
          <div className="w-[106px] xl:w-[114px] h-[78px] xl:h-[84px] rounded-lg bg-white shadow-md border border-[#cbd5e1] overflow-hidden flex flex-col text-left">
            {/* Browser Chrome Header */}
            <div className="bg-[#f1f5f9] border-b border-[#e2e8f0] px-1.5 py-0.5 flex items-center gap-1 shrink-0">
              <div className="flex items-center gap-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              </div>
              <div className="flex-1 bg-white rounded px-1 py-[0.5px] border border-[#e2e8f0] flex items-center">
                <span className="text-[4.5px] text-[#64748b] truncate font-mono">templeseva.com/pass</span>
              </div>
            </div>

            {/* Clearly Displayed QR Code Seva Pass */}
            <div className="p-1 bg-[#fdfaf5] flex-1 flex flex-col items-center justify-between text-center overflow-hidden">
              <div className="w-full flex items-center justify-between border-b border-[#f1e5d5] pb-0.5 shrink-0">
                <span className="text-[4.5px] font-bold text-emerald-700">✓ Pass Confirmed</span>
                <span className="text-[4px] text-[#c1440e] font-mono font-bold">TS-89421</span>
              </div>

              {/* Perfectly Proportioned QR Code Matrix */}
              <div className="my-auto bg-white p-0.5 rounded border border-[#26201b]/80 shadow-3xs flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 xl:w-9 xl:h-9" viewBox="0 0 29 29" fill="none">
                  <rect width="29" height="29" fill="white" />
                  {/* Top-Left Finder Pattern (7x7 outer, 5x5 white, 3x3 inner) */}
                  <rect x="2" y="2" width="7" height="7" fill="#1e293b" />
                  <rect x="3" y="3" width="5" height="5" fill="white" />
                  <rect x="4" y="4" width="3" height="3" fill="#1e293b" />

                  {/* Top-Right Finder Pattern */}
                  <rect x="20" y="2" width="7" height="7" fill="#1e293b" />
                  <rect x="21" y="3" width="5" height="5" fill="white" />
                  <rect x="22" y="4" width="3" height="3" fill="#1e293b" />

                  {/* Bottom-Left Finder Pattern */}
                  <rect x="2" y="20" width="7" height="7" fill="#1e293b" />
                  <rect x="3" y="21" width="5" height="5" fill="white" />
                  <rect x="4" y="22" width="3" height="3" fill="#1e293b" />

                  {/* Timing Patterns */}
                  <rect x="10" y="5" width="1" height="1" fill="#1e293b" />
                  <rect x="12" y="5" width="1" height="1" fill="#1e293b" />
                  <rect x="14" y="5" width="1" height="1" fill="#1e293b" />
                  <rect x="16" y="5" width="1" height="1" fill="#1e293b" />
                  <rect x="18" y="5" width="1" height="1" fill="#1e293b" />
                  <rect x="5" y="10" width="1" height="1" fill="#1e293b" />
                  <rect x="5" y="12" width="1" height="1" fill="#1e293b" />
                  <rect x="5" y="14" width="1" height="1" fill="#1e293b" />
                  <rect x="5" y="16" width="1" height="1" fill="#1e293b" />
                  <rect x="5" y="18" width="1" height="1" fill="#1e293b" />

                  {/* Alignment Pattern at (18, 18) */}
                  <rect x="18" y="18" width="5" height="5" fill="#1e293b" />
                  <rect x="19" y="19" width="3" height="3" fill="white" />
                  <rect x="20" y="20" width="1" height="1" fill="#1e293b" />

                  {/* Authentic Data Matrix modules */}
                  <rect x="10" y="2" width="2" height="1" fill="#1e293b" />
                  <rect x="14" y="2" width="1" height="2" fill="#1e293b" />
                  <rect x="17" y="3" width="1" height="1" fill="#1e293b" />
                  <rect x="11" y="7" width="2" height="2" fill="#1e293b" />
                  <rect x="15" y="7" width="3" height="1" fill="#1e293b" />
                  <rect x="2" y="10" width="2" height="2" fill="#1e293b" />
                  <rect x="7" y="11" width="2" height="1" fill="#1e293b" />
                  <rect x="10" y="10" width="1" height="3" fill="#1e293b" />
                  <rect x="12" y="12" width="2" height="1" fill="#1e293b" />
                  <rect x="15" y="11" width="2" height="2" fill="#1e293b" />
                  <rect x="20" y="10" width="1" height="2" fill="#1e293b" />
                  <rect x="23" y="11" width="2" height="2" fill="#1e293b" />
                  <rect x="26" y="10" width="1" height="3" fill="#1e293b" />
                  <rect x="10" y="15" width="2" height="1" fill="#1e293b" />
                  <rect x="13" y="14" width="1" height="2" fill="#1e293b" />
                  <rect x="16" y="15" width="2" height="2" fill="#1e293b" />
                  <rect x="25" y="15" width="2" height="1" fill="#1e293b" />
                  <rect x="2" y="14" width="1" height="3" fill="#1e293b" />
                  <rect x="7" y="15" width="2" height="2" fill="#1e293b" />
                  <rect x="10" y="18" width="1" height="2" fill="#1e293b" />
                  <rect x="13" y="19" width="3" height="1" fill="#1e293b" />
                  <rect x="10" y="22" width="2" height="2" fill="#1e293b" />
                  <rect x="14" y="23" width="2" height="1" fill="#1e293b" />
                  <rect x="10" y="26" width="3" height="1" fill="#1e293b" />
                  <rect x="15" y="25" width="1" height="2" fill="#1e293b" />
                  <rect x="25" y="20" width="2" height="2" fill="#1e293b" />
                  <rect x="24" y="24" width="3" height="1" fill="#1e293b" />
                  <rect x="25" y="26" width="2" height="2" fill="#1e293b" />

                  {/* Center Sacred Emblem (Om ॐ in saffron) */}
                  <rect x="11.5" y="11.5" width="6" height="6" fill="#fff" rx="1" />
                  <rect x="12" y="12" width="5" height="5" fill="#c1440e" rx="0.5" />
                  <text x="14.5" y="15.8" textAnchor="middle" fontSize="4.5" fill="white" fontWeight="bold">ॐ</text>
                </svg>
              </div>

              <span className="text-[3.8px] text-[#786657] font-medium leading-none shrink-0">Scan at Temple Gate</span>
            </div>
          </div>
        )
      case 6:
        return (
          /* Website Structure: Browser Window with QR Code & Booked Sevas Verification */
          <div className="w-[106px] xl:w-[114px] h-[78px] xl:h-[84px] rounded-lg bg-white shadow-md border border-[#cbd5e1] overflow-hidden flex flex-col text-left">
            {/* Browser Chrome Header */}
            <div className="bg-[#f1f5f9] border-b border-[#e2e8f0] px-1.5 py-0.5 flex items-center gap-1 shrink-0">
              <div className="flex items-center gap-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              </div>
              <div className="flex-1 bg-white rounded px-1 py-[0.5px] border border-[#e2e8f0] flex items-center">
                <span className="text-[4.5px] text-[#64748b] truncate font-mono">templeseva.com/darshan</span>
              </div>
            </div>

            {/* Content: QR Code + Seva Details for Temple Gate Entry */}
            <div className="p-1 bg-[#fdfaf5] flex-1 flex flex-col justify-between overflow-hidden">
              {/* Header Status Bar */}
              <div className="flex items-center justify-between border-b border-[#f1e5d5] pb-0.5 shrink-0">
                <div className="flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[4.5px] font-bold text-emerald-700">QR Code Verified</span>
                </div>
                <span className="text-[3.8px] bg-emerald-50 text-emerald-700 font-bold px-1 py-[0.5px] rounded border border-emerald-200">Gate 1</span>
              </div>

              {/* Main Split: QR Code on Left, Seva Details on Right */}
              <div className="flex items-center gap-1 my-auto">
                {/* Left: QR Code with green verified border */}
                <div className="bg-white p-0.5 rounded border border-emerald-600 shadow-3xs flex flex-col items-center justify-center shrink-0">
                  <svg className="w-6 h-6 xl:w-7 xl:h-7" viewBox="0 0 21 21" fill="none">
                    <rect width="21" height="21" fill="white" />
                    {/* Top-Left Finder */}
                    <rect x="1" y="1" width="5" height="5" fill="#1e293b" />
                    <rect x="2" y="2" width="3" height="3" fill="white" />
                    <rect x="2.5" y="2.5" width="2" height="2" fill="#1e293b" />

                    {/* Top-Right Finder */}
                    <rect x="15" y="1" width="5" height="5" fill="#1e293b" />
                    <rect x="16" y="2" width="3" height="3" fill="white" />
                    <rect x="16.5" y="2.5" width="2" height="2" fill="#1e293b" />

                    {/* Bottom-Left Finder */}
                    <rect x="1" y="15" width="5" height="5" fill="#1e293b" />
                    <rect x="2" y="16" width="3" height="3" fill="white" />
                    <rect x="2.5" y="16.5" width="2" height="2" fill="#1e293b" />

                    {/* Data modules */}
                    <rect x="7" y="2" width="1" height="1" fill="#1e293b" />
                    <rect x="9" y="2" width="2" height="1" fill="#1e293b" />
                    <rect x="12" y="2" width="1" height="2" fill="#1e293b" />
                    <rect x="7" y="5" width="2" height="1" fill="#1e293b" />
                    <rect x="10" y="5" width="1" height="1" fill="#1e293b" />
                    <rect x="13" y="4" width="1" height="2" fill="#1e293b" />
                    <rect x="2" y="7" width="1" height="2" fill="#1e293b" />
                    <rect x="5" y="8" width="2" height="1" fill="#1e293b" />
                    <rect x="8" y="7" width="2" height="2" fill="#1e293b" />
                    <rect x="11" y="8" width="1" height="1" fill="#1e293b" />
                    <rect x="14" y="7" width="2" height="1" fill="#1e293b" />
                    <rect x="17" y="8" width="1" height="2" fill="#1e293b" />
                    <rect x="19" y="7" width="1" height="2" fill="#1e293b" />
                    <rect x="2" y="11" width="2" height="1" fill="#1e293b" />
                    <rect x="7" y="11" width="1" height="2" fill="#1e293b" />
                    <rect x="10" y="11" width="2" height="1" fill="#1e293b" />
                    <rect x="15" y="11" width="2" height="2" fill="#1e293b" />
                    <rect x="18" y="12" width="2" height="1" fill="#1e293b" />
                    <rect x="7" y="15" width="2" height="1" fill="#1e293b" />
                    <rect x="11" y="14" width="1" height="2" fill="#1e293b" />
                    <rect x="13" y="16" width="2" height="1" fill="#1e293b" />
                    <rect x="17" y="15" width="1" height="2" fill="#1e293b" />
                    <rect x="7" y="18" width="1" height="2" fill="#1e293b" />
                    <rect x="10" y="18" width="3" height="1" fill="#1e293b" />
                    <rect x="15" y="18" width="2" height="2" fill="#1e293b" />
                    <rect x="18" y="18" width="2" height="1" fill="#1e293b" />

                    {/* Center Sacred Om Symbol */}
                    <rect x="8.5" y="8.5" width="4" height="4" fill="#fff" rx="0.5" />
                    <rect x="9" y="9" width="3" height="3" fill="#c1440e" rx="0.3" />
                    <text x="10.5" y="11.4" textAnchor="middle" fontSize="2.8" fill="white" fontWeight="bold">ॐ</text>
                  </svg>
                  <span className="text-[3.2px] font-bold text-emerald-700 leading-none mt-0.5">✓ Ready</span>
                </div>

                {/* Right: Sevas Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-0.5">
                    <span className="text-[4px] text-[#c1440e]">🪔</span>
                    <span className="text-[4.5px] font-bold text-[#34251e] truncate leading-tight">Abhishekam Seva</span>
                  </div>
                  <span className="text-[3.6px] text-[#786657] truncate mt-0.5">Shree Meenakshi Temple</span>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-[3.4px] bg-amber-100/70 text-[#92400e] font-semibold px-0.8 py-[0.3px] rounded">
                      Pass #89421
                    </span>
                    <span className="text-[3.4px] bg-emerald-100/70 text-emerald-800 font-semibold px-0.8 py-[0.3px] rounded">
                      1 Devotee
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action / Confirmation Button */}
              <div className="w-full bg-emerald-600 rounded py-0.5 text-center shadow-3xs shrink-0">
                <span className="text-[4.5px] font-bold text-white leading-none block">✓ Present Pass & Receive Seva</span>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <section id="how" className="relative overflow-hidden bg-gradient-to-b from-[#fcf7ef] via-[#faf1e4] to-[#fbf5eb] pt-7 sm:pt-8 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 border-y border-[#eadfd1]">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ── Header Title & Subtitle ── */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-9">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#34251e]">
            {isKn ? 'ಟೆಂಪಲ್ ಸೇವಾ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ' : 'How Temple Seva Works'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#6b584c] font-medium leading-relaxed">
            {isKn ? 'ನಿಮ್ಮ ಆಧ್ಯಾತ್ಮಿಕ ಯಾತ್ರೆಯ ಸರಳ ಮಾರ್ಗದರ್ಶಿ' : 'A Simple Guide to Planning Your Spiritual Journey'}
          </p>
        </div>

        {/* ── DESKTOP HORIZONTAL FLOW (Visible on lg and above) ── */}
        <div className="hidden lg:block relative pb-4">
          {/* Continuous Golden Wavy Ribbon in the Background */}
          <div className="absolute top-[82px] left-0 right-0 h-28 pointer-events-none z-0">
            <svg viewBox="0 0 1200 120" className="w-full h-full overflow-visible" fill="none">
              <path
                d="M 80,60 C 140,15 200,105 280,60 C 360,15 420,105 500,60 C 580,15 640,105 720,60 C 800,15 860,105 940,60 C 1020,15 1080,105 1140,60"
                stroke="#dfaa5d"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 80,60 C 140,15 200,105 280,60 C 360,15 420,105 500,60 C 580,15 640,105 720,60 C 800,15 860,105 940,60 C 1020,15 1080,105 1140,60"
                stroke="#fff7eb"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />

            </svg>
          </div>

          {/* 6 Step Columns Grid */}
          <div className="relative z-10 grid grid-cols-6 gap-4 xl:gap-6 items-start">
            {steps.map((st) => (
              <div key={st.stepNum} className="flex flex-col items-center text-center group">
                <div className="relative">
                  {/* Golden Border Outer Ring */}
                  <div className="w-36 h-36 xl:w-40 xl:h-40 rounded-full border-4 border-[#e5b875] bg-gradient-to-b from-[#fffefc] via-[#fffaf2] to-[#faedd9] p-2 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:border-[#c1440e]">
                    {renderStepIllustration(st.stepNum)}
                  </div>

                  {/* Bottom Circular Badge */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full border-2 border-[#d49e4d] bg-[#fffaf2] flex items-center justify-center shadow-md text-sm font-serif font-extrabold text-[#c1440e]">
                    {st.badgeIcon}
                  </div>
                </div>

                {/* Text Copy */}
                <h3 className="mt-6 font-serif text-sm xl:text-base font-bold text-[#34251e] leading-snug group-hover:text-[#c1440e] transition-colors">
                  {st.title}
                </h3>
                <p className="mt-1 text-[11px] xl:text-xs text-[#786657] leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── MOBILE / TABLET RESPONSIVE GRID (Visible on sm & md) ── */}
        <div className="block lg:hidden mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {steps.map((st) => (
              <div
                key={st.stepNum}
                className="relative rounded-3xl border border-[#eadfd1] bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col items-center text-center group"
              >
                {/* Golden Border Outer Ring with Illustration */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full border-3 border-[#e5b875] bg-gradient-to-b from-[#fffefc] via-[#fffaf2] to-[#faedd9] p-2 shadow-md flex items-center justify-center">
                    {renderStepIllustration(st.stepNum)}
                  </div>
                  {/* Badge Number Circle */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full border-2 border-[#d49e4d] bg-[#fffaf2] flex items-center justify-center text-xs font-serif font-extrabold text-[#c1440e] shadow-sm">
                    <span>{st.badgeIcon}</span>
                  </div>
                </div>

                <h3 className="mt-2 font-serif text-base font-bold text-[#34251e] group-hover:text-[#c1440e] transition-colors">
                  {st.title}
                </h3>
                <p className="mt-1.5 text-xs text-[#786657] leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowTempleSevaWorks
