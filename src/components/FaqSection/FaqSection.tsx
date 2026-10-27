import { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { IonIcon } from '../IonIcon'

interface FaqItem {
  id: string
  questionEn: string
  questionKn: string
  answerEn: string
  answerKn: string
}

interface FaqCategory {
  id: string
  labelEn: string
  labelKn: string
  icon: string
  items: FaqItem[]
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'general',
    labelEn: 'General',
    labelKn: 'ಸಾಮಾನ್ಯ ಮಾಹಿತಿ',
    icon: 'sparkles-outline',
    items: [
      {
        id: 'gen-1',
        questionEn: 'How does the online Temple Seva platform work?',
        questionKn: 'ಆನ್‌ಲೈನ್ ದೇವಾಲಯ ಸೇವಾ ವೇದಿಕೆ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?',
        answerEn:
          'TempleSeva is a verified spiritual bridge connecting devotees with authenticated ancient temples. You choose your temple, select the auspicious Seva or Pooja, provide Gotra and family Sankalpa details, and book securely. Sanctum priests perform the rituals on your behalf at the scheduled time, followed by blessed Prasadam dispatched to your doorstep.',
        answerKn:
          'ಟೆಂಪಲ್‌ಸೇವಾ ಭಕ್ತರನ್ನು ಅಧಿಕೃತ ಪುರಾತನ ದೇವಾಲಯಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವ ಪವಿತ್ರ ವೇದಿಕೆಯಾಗಿದೆ. ದೇವಾಲಯ ಮತ್ತು ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ, ನಿಮ್ಮ ಗೋತ್ರ-ಸಂಕಲ್ಪ ವಿವರಗಳನ್ನು ನೀಡಿ ಕಾಯ್ದಿರಿಸಿ. ನಿಗದಿತ ಸಮಯದಲ್ಲಿ ಅರ್ಚಕರು ನಿಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ಪೂಜೆ ನೆರವೇರಿಸಿ, ಪ್ರಸಾದವನ್ನು ನಿಮ್ಮ ಮನೆಬಾಗಿಲಿಗೆ ತಲುಪಿಸುತ್ತಾರೆ.',
      },
      {
        id: 'gen-2',
        questionEn: 'Is TempleSeva officially partnered with participating temples?',
        questionKn: 'ಟೆಂಪಲ್‌ಸೇವಾ ದೇವಾಲಯಗಳೊಂದಿಗೆ ಅಧಿಕೃತ ಪಾಲುದಾರಿಕೆ ಹೊಂದಿದೆಯೇ?',
        answerEn:
          'Yes. All Sevas, Darshans, and Poojas listed on our platform are coordinated directly through verified temple trusts, Devasthanam administrative boards, and consecrated chief priests.',
        answerKn:
          'ಹೌದು. ನಮ್ಮ ವೇದಿಕೆಯಲ್ಲಿರುವ ಎಲ್ಲಾ ಸೇವೆಗಳು, ದರ್ಶನಗಳು ಮತ್ತು ಪೂಜೆಗಳು ಸಂಬಂಧಪಟ್ಟ ದೇವಾಲಯ ಟ್ರಸ್ಟ್‌ಗಳು ಮತ್ತು ಮುಖ್ಯ ಅರ್ಚಕರ ನೇರ ಸಹಯೋಗದೊಂದಿಗೆ ಅಧಿಕೃತವಾಗಿ ನಡೆಯುತ್ತವೆ.',
      },
      {
        id: 'gen-3',
        questionEn: 'Can I perform a Seva if I do not know my Gotra or Nakshatra?',
        questionKn: 'ನನ್ನ ಗೋತ್ರ ಅಥವಾ ನಕ್ಷತ್ರ ತಿಳಿಯದಿದ್ದರೆ ಸೇವೆ ಸಲ್ಲಿಸಬಹುದೇ?',
        answerEn:
          'Yes, absolutely. If you do not know your Gotra, the traditional "Kashyapa" or universal "Vishwamitra / Shiva Gotra" is invoked for universal well-being. If you are unsure of your birth star (Nakshatra), priests conduct the Sankalpa using your sacred birth name and Rashi.',
        answerKn:
          'ಖಂಡಿತವಾಗಿಯೂ ಸಲ್ಲಿಸಬಹುದು. ಗೋತ್ರ ತಿಳಿಯದಿದ್ದಲ್ಲಿ ಲೋಕಕಲ್ಯಾಣಕರ "ಕಾಶ್ಯಪ" ಅಥವಾ "ಶಿವ ಗೋತ್ರ" ಸಂಕಲ್ಪ ಮಾಡಲಾಗುತ್ತದೆ. ನಕ್ಷತ್ರ ತಿಳಿಯದಿದ್ದಲ್ಲಿ ನಿಮ್ಮ ಜನ್ಮನಾಮ ಹಾಗೂ ರಾಶಿಯನ್ನು ಅರ್ಚಕರು ಸಂಕಲ್ಪದಲ್ಲಿ ಉಲ್ಲೇಖಿಸುತ್ತಾರೆ.',
      },
      {
        id: 'gen-4',
        questionEn: 'Are payments and personal devotee details secure?',
        questionKn: 'ನನ್ನ ಪಾವತಿ ಮತ್ತು ಭಕ್ತರ ವೈಯಕ್ತಿಕ ವಿವರಗಳು ಸುರಕ್ಷಿತವೇ?',
        answerEn:
          'Yes. We use enterprise-grade 256-bit SSL encryption and PCI-DSS compliant payment gateways (UPI, Netbanking, Credit/Debit cards). We strictly protect your spiritual and personal data.',
        answerKn:
          'ಹೌದು. 256-ಬಿಟ್ ಎಸ್‌ಎಸ್‌ಎಲ್ ಎನ್‌ಕ್ರಿಪ್ಶನ್ ಮತ್ತು ಆರ್‌ಬಿಐ ಅನುಮೋದಿತ ಸುರಕ್ಷಿತ ಪಾವತಿ ಗೇಟ್‌ವೇಗಳನ್ನು (UPI, ಕಾರ್ಡ್‌ಗಳು) ಬಳಸಲಾಗಿದ್ದು, ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ವಿವರಗಳು ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ.',
      },
    ],
  },
  {
    id: 'temple-sevas',
    labelEn: 'Temple Sevas',
    labelKn: 'ದೇವಾಲಯ ಸೇವೆಗಳು',
    icon: 'flame-outline',
    items: [
      {
        id: 'seva-1',
        questionEn: 'How do I book a special Seva or Pooja?',
        questionKn: 'ವಿಶೇಷ ಸೇವೆ ಅಥವಾ ಪೂಜೆಯನ್ನು ಹೇಗೆ ಕಾಯ್ದಿರಿಸುವುದು?',
        answerEn:
          'To book a special Seva or Pooja, select your temple from the platform and browse the Seva catalog. Choose an auspicious date on the temple calendar, enter your devotee Sankalpa details (Name, Gotra, Nakshatra, Rashi), and complete the payment. You will receive an instant digital Seva booking pass with an authenticated QR code, and consecrated sanctum prasadam will be dispatched to your address.',
        answerKn:
          'ವಿಶೇಷ ಸೇವೆ ಅಥವಾ ಪೂಜೆ ಕಾಯ್ದಿರಿಸಲು, ದೇವಾಲಯ ಮತ್ತು ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಪಂಚಾಂಗ ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ಶುಭ ದಿನಾಂಕವನ್ನು ಆರಿಸಿ, ಸಂಕಲ್ಪ ವಿವರಗಳನ್ನು (ಹೆಸರು, ಗೋತ್ರ, ನಕ್ಷತ್ರ) ನಮೂದಿಸಿ ಪಾವತಿ ಪೂರ್ಣಗೊಳಿಸಿ. ಅಧಿಕೃತ ಕ್ಯೂಆರ್ ಕೋಡ್ ಹೊಂದಿರುವ ಡಿಜಿಟಲ್ ಸೇವಾ ಪಾಸ್ ತಕ್ಷಣವೇ ಲಭ್ಯವಾಗುತ್ತದೆ ಮತ್ತು ಪ್ರಸಾದವನ್ನು ನಿಮ್ಮ ವಿಳಾಸಕ್ಕೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.',
      },
      {
        id: 'seva-2',
        questionEn: 'Are there any dress code requirements for attending the Sevas?',
        questionKn: 'ಸೇವೆಗಳಲ್ಲಿ ಖುದ್ದಾಗಿ ಭಾಗವಹಿಸಲು ಯಾವುದೇ ವಸ್ತ್ರಸಂಹಿತೆ (Dress Code) ಇದೆಯೇ?',
        answerEn:
          'For devotees attending physically at the temple sanctum, traditional dress is mandatory: Dhoti with Angavastram or Kurta-Pyjama for men, and Traditional Saree or Salwar Kameez for women. For devotees participating remotely via online Sankalpa, no dress code applies as the temple priests perform the sacred rites on your behalf in the inner sanctum.',
        answerKn:
          'ದೇವಾಲಯದಲ್ಲಿ ಖುದ್ದಾಗಿ ಉಪಸ್ಥಿತರಿರುವ ಭಕ್ತರಿಗೆ ಸಾಂಪ್ರದಾಯಿಕ ವಸ್ತ್ರ ಕಡ್ಡಾಯ: ಪುರುಷರಿಗೆ ಧೋತಿ-ಶಾಲು ಅಥವಾ ಕುರ್ತಾ, ಮಹಿಳೆಯರಿಗೆ ಸೀರೆ ಅಥವಾ ಚೂಡಿದಾರ್. ಆನ್‌ಲೈನ್ ಸಂಕಲ್ಪದ ಮೂಲಕ ಭಾಗವಹಿಸುವ ದೂರದ ಊರಿನ ಭಕ್ತರಿಗೆ ಯಾವುದೇ ವಸ್ತ್ರ ನಿಯಮವಿರುವುದಿಲ್ಲ, ಅರ್ಚಕರೇ ಪವಿತ್ರ ಗರ್ಭಗುಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ವಿಧಿವಿಧಾನ ನೆರವೇರಿಸುತ್ತಾರೆ.',
      },
      {
        id: 'seva-3',
        questionEn: 'Can I book a Seva on behalf of family members who cannot attend?',
        questionKn: 'ಹಾಜರಾಗಲು ಸಾಧ್ಯವಾಗದ ಕುಟುಂಬದ ಸದಸ್ಯರ ಪರವಾಗಿ ನಾನು ಸೇವೆ ಕಾಯ್ದಿರಿಸಬಹುದೇ?',
        answerEn:
          'Yes, certainly! During the booking process, you can include the names, Gotras, and Nakshatras of multiple family members. The priests will recite individual Sankalpas for each family member to invoke divine health, prosperity, and spiritual blessings.',
        answerKn:
          'ಹೌದು, ಖಂಡಿತವಾಗಿ! ಸೇವೆ ಕಾಯ್ದಿರಿಸುವಾಗ ನಿಮ್ಮ ಕುಟುಂಬದ ಎಲ್ಲ ಸದಸ್ಯರ ಹೆಸರು, ಗೋತ್ರ ಮತ್ತು ನಕ್ಷತ್ರಗಳನ್ನು ಸೇರಿಸಬಹುದು. ಅರ್ಚಕರು ಪ್ರತಿಯೊಬ್ಬರ ಹೆಸರಿನಲ್ಲೂ ಪ್ರತ್ಯೇಕ ಸಂಕಲ್ಪ ಮಾಡಿ ದೈವಿಕ ಆಶೀರ್ವಾದ ಕೋರುತ್ತಾರೆ.',
      },
      {
        id: 'seva-4',
        questionEn: 'Can I reschedule or modify the date of my booked Seva?',
        questionKn: 'ಕಾಯ್ದಿರಿಸಿದ ಸೇವೆಯ ದಿನಾಂಕವನ್ನು ಮುಂದೂಡಲು ಅಥವಾ ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವೇ?',
        answerEn:
          'Yes. You can request a date change up to 48 hours prior to the scheduled puja date through your "My Sevas" dashboard or by reaching out directly to our Devasthanam support helpline.',
        answerKn:
          'ಹೌದು. ನಿಗದಿತ ಪೂಜಾ ದಿನಾಂಕಕ್ಕಿಂತ 48 ಗಂಟೆಗಳ ಮೊದಲು ನಿಮ್ಮ "ನನ್ನ ಸೇವೆಗಳು" ವಿಭಾಗದಲ್ಲಿ ಅಥವಾ ನಮ್ಮ ದೇವಾಲಯ ಸಹಾಯವಾಣಿಯ ಮೂಲಕ ದಿನಾಂಕ ಬದಲಾವಣೆಗೆ ವಿನಂತಿಸಬಹುದು.',
      },
    ],
  },
  {
    id: 'e-darshan',
    labelEn: 'E-Darshan',
    labelKn: 'ಇ-ದರ್ಶನ',
    icon: 'videocam-outline',
    items: [
      {
        id: 'darshan-1',
        questionEn: 'How can I access live E-Darshan streams?',
        questionKn: 'ನೇರ ಪ್ರಸಾರದ ಇ-ದರ್ಶನವನ್ನು ನಾನು ಹೇಗೆ ವೀಕ್ಷಿಸಬಹುದು?',
        answerEn:
          'Upon booking an E-Darshan slot or registered festival seva, you receive a direct consecrated livestream link on your registered WhatsApp and email 30 minutes before the sacred Aarti commences.',
        answerKn:
          'ಇ-ದರ್ಶನ ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಿದ ನಂತರ, ಮಹಾಮಂಗಳಾರತಿ ಆರಂಭವಾಗುವ 30 ನಿಮಿಷಗಳ ಮೊದಲು ನಿಮ್ಮ ವಾಟ್ಸಾಪ್ ಮತ್ತು ಇಮೇಲ್‌ಗೆ ನೇರ ಪ್ರಸಾರದ ಲಿಂಕ್ ತಲುಪುತ್ತದೆ.',
      },
      {
        id: 'darshan-2',
        questionEn: 'Is live Darshan available on major festive occasions?',
        questionKn: 'ಪ್ರಮುಖ ಹಬ್ಬ-ಹರಿದಿನಗಳಲ್ಲಿ ನೇರ ದರ್ಶನ ಲಭ್ಯವಿರುತ್ತದೆಯೇ?',
        answerEn:
          'Yes, special high-definition broadcasts are organized during auspicious Mahotsavas such as Maha Shivaratri, Vaikuntha Ekadashi, Navaratri, and Brahmotsavam celebrations.',
        answerKn:
          'ಹೌದು. ಶಿವರಾತ್ರಿ, ವೈಕುಂಠ ಏಕಾದಶಿ, ನವರಾತ್ರಿ ಮತ್ತು ಬ್ರಹ್ಮೋತ್ಸವದಂತಹ ವಿಶೇಷ ಪರ್ವದಿನಗಳಲ್ಲಿ ಅತ್ಯುನ್ನತ ಗುಣಮಟ್ಟದ ನೇರ ಪ್ರಸಾರ ವ್ಯವಸ್ಥೆ ಮಾಡಲಾಗುತ್ತದೆ.',
      },
      {
        id: 'darshan-3',
        questionEn: 'Can family members from different locations watch the same stream?',
        questionKn: 'ಬೇರೆ ಬೇರೆ ಊರುಗಳಲ್ಲಿರುವ ಕುಟುಂಬದವರು ಒಂದೇ ಲಿಂಕ್ ಮೂಲಕ ವೀಕ್ಷಿಸಬಹುದೇ?',
        answerEn:
          'Yes, the livestream link can be accessed across multiple family devices so elders and relatives worldwide can receive sanctum blessings together.',
        answerKn:
          'ಹೌದು. ನೀಡಲಾದ ಲಿಂಕ್ ಮೂಲಕ ದೇಶ-ವಿದೇಶಗಳಲ್ಲಿರುವ ನಿಮ್ಮ ಕುಟುಂಬದ ಸದಸ್ಯರೆಲ್ಲರೂ ಏಕಕಾಲದಲ್ಲಿ ದರ್ಶನ ಪಡೆದು ಪುನೀತರಾಗಬಹುದು.',
      },
    ],
  },
  {
    id: 'donations',
    labelEn: 'Donations',
    labelKn: 'ದೇಣಿಗೆಗಳು (ಕಾಣಿಕೆ)',
    icon: 'heart-outline',
    items: [
      {
        id: 'don-1',
        questionEn: 'What sacred causes and Nitya Annadana funds can I donate to?',
        questionKn: 'ಯಾವ ಧಾರ್ಮಿಕ ಮತ್ತು ನಿತ್ಯ ಅನ್ನದಾನ ಸೇವೆಗಳಿಗೆ ದೇಣಿಗೆ ನೀಡಬಹುದು?',
        answerEn:
          'You can contribute directly to Sanctum Renovation (Jeernodhara), Nitya Annadana Seva (feeding devotees), Goshala Gau-Seva, Veda Pathashala education, and Temple Flower decorations.',
        answerKn:
          'ದೇವಾಲಯ ಜೀರ್ಣೋದ್ಧಾರ, ನಿತ್ಯ ಅನ್ನದಾನ ಸೇವೆ, ಗೋಶಾಲೆ ಗೋ-ಸಂರಕ್ಷಣೆ, ವೇದ ಪಾಠಶಾಲೆ ಹಾಗೂ ಹೂವಿನ ಅಲಂಕಾರ ಮುಂತಾದ ಸತ್ಕಾರ್ಯಗಳಿಗೆ ನೇರವಾಗಿ ಕಾಣಿಕೆ ಸಮರ್ಪಿಸಬಹುದು.',
      },
      {
        id: 'don-2',
        questionEn: 'Will I receive an official receipt and 80G tax exemption?',
        questionKn: 'ನನಗೆ ಅಧಿಕೃತ ರಶೀದಿ ಮತ್ತು 80G ತೆರಿಗೆ ವಿನಾಯಿತಿ ಸಿಗುವುದೇ?',
        answerEn:
          'Yes! An authentic digital receipt with the temple trust’s registration number and 80G tax exemption certificate (for eligible trusts) is instantly generated and emailed upon transaction confirmation.',
        answerKn:
          'ಹೌದು! ದೇವಾಲಯ ಟ್ರಸ್ಟ್‌ನ ಅಧಿಕೃತ ನೋಂದಣಿ ಸಂಖ್ಯೆ ಮತ್ತು 80G ತೆರಿಗೆ ವಿನಾಯಿತಿ ರಶೀದಿ ಪಾವತಿಯಾದ ತಕ್ಷಣ ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ರವಾನೆಯಾಗುತ್ತದೆ.',
      },
      {
        id: 'don-3',
        questionEn: 'Can I sponsor Annadana on a specific birthday or anniversary?',
        questionKn: 'ಹುಟ್ಟುಹಬ್ಬ ಅಥವಾ ವಿವಾಹ ವಾರ್ಷಿಕೋತ್ಸವದಂದು ಅನ್ನದಾನ ಪ್ರಾಯೋಜಿಸಬಹುದೇ?',
        answerEn:
          'Yes. You can select your special family anniversary or memorial tithi, and the Devasthanam Annadana trust will conduct holy feeding on that exact chosen day in your honor.',
        answerKn:
          'ಹೌದು. ನಿಮ್ಮ ಜನ್ಮದಿನ ಅಥವಾ ವಿವಾಹ ವಾರ್ಷಿಕೋತ್ಸವದ ಶುಭದಿನವನ್ನು ಆಯ್ಕೆಮಾಡಿಕೊಂಡು ನಿಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ಆ ದಿನದ ಮಹಾ ಅನ್ನದಾನವನ್ನು ಪ್ರಾಯೋಜಿಸಬಹುದು.',
      },
    ],
  },
  {
    id: 'prasadam',
    labelEn: 'Prasadam',
    labelKn: 'ಪವಿತ್ರ ಪ್ರಸಾದ',
    icon: 'cube-outline',
    items: [
      {
        id: 'pras-1',
        questionEn: 'How is the blessed temple Prasadam packaged and dispatched?',
        questionKn: 'ಪವಿತ್ರ ಪ್ರಸಾದವನ್ನು ಹೇಗೆ ಪ್ಯಾಕ್ ಮಾಡಿ ಕಳುಹಿಸಲಾಗುತ್ತದೆ?',
        answerEn:
          'Prasadam is consecrated directly in the sanctum sanctorum and immediately sealed in tamper-evident, food-grade airtight containers alongside sanctified Kumkuma, Vibhuti, Raksha Sutra, and dry Prasad.',
        answerKn:
          'ಗರ್ಭಗುಡಿಯಲ್ಲಿ ಪೂಜಿಸಲ್ಪಟ್ಟ ಪ್ರಸಾದವನ್ನು ಸ್ವಚ್ಛವಾದ, ಗಾಳಿಯಾಡದ ಸುರಕ್ಷಿತ ಡಬ್ಬಿಗಳಲ್ಲಿ ಕುಂಕುಮ, ವಿಭೂತಿ, ರಕ್ಷಾಸೂತ್ರ ಮತ್ತು ಒಣ ಪ್ರಸಾದದೊಂದಿಗೆ ಸಿದ್ಧಪಡಿಸಿ ರವಾನಿಸಲಾಗುತ್ತದೆ.',
      },
      {
        id: 'pras-2',
        questionEn: 'How many days does it take for Prasadam to arrive at my home?',
        questionKn: 'ಪ್ರಸಾದ ಮನೆ ತಲುಪಲು ಎಷ್ಟು ದಿನಗಳು ಬೇಕಾಗುತ್ತವೆ?',
        answerEn:
          'Prasadam parcels are dispatched via express postal courier the day after the ritual is performed. Deliveries across major Indian cities typically take 3 to 5 business days, with live tracking provided via SMS and WhatsApp.',
        answerKn:
          'ಸೇವೆ ಸಂಪೂರ್ಣಗೊಂಡ ಮರುದಿನವೇ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಕೊರಿಯರ್ ಮೂಲಕ ಕಳುಹಿಸಲಾಗುತ್ತದೆ. ಭಾರತದ ಪ್ರಮುಖ ನಗರಗಳಿಗೆ 3 ರಿಂದ 5 ದಿನಗಳಲ್ಲಿ ತಲುಪಲಿದ್ದು, ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಟ್ರ್ಯಾಕಿಂಗ್ ಲಿಂಕ್ ಒದಗಿಸಲಾಗುತ್ತದೆ.',
      },
      {
        id: 'pras-3',
        questionEn: 'What happens if the Prasadam parcel is delayed or damaged?',
        questionKn: 'ಪ್ರಸಾದ ತಲುಪುವುದು ವಿಳಂಬವಾದರೆ ಅಥವಾ ಹಾನಿಯಾದರೆ ಏನು ಮಾಡುವುದು?',
        answerEn:
          'In the rare event of transit damage or courier delay, please contact our Devasthanam desk. We will arrange a fresh sanctum re-blessing and dispatch a complimentary replacement parcel immediately.',
        answerKn:
          'ದಾರಿಯಲ್ಲಿ ಯಾವುದೇ ವಿಳಂಬ ಅಥವಾ ಹಾನಿ ಉಂಟಾದಲ್ಲಿ, ನಮ್ಮ ಸಹಾಯವಾಣಿಗೆ ತಿಳಿಸಿ. ನಾವು ದೇವಾಲಯದಿಂದ ಮತ್ತೊಮ್ಮೆ ವಿಶೇಷ ಪೂಜೆ ನೆರವೇರಿಸಿ ಹೊಸ ಪ್ರಸಾದ ಪ್ಯಾಕೆಟ್ ಕಳುಹಿಸುತ್ತೇವೆ.',
      },
    ],
  },
]

export const FaqSection = () => {
  const { language } = useLanguage()
  const isKn = language === 'KN'

  // Default to 'temple-sevas' to show the main ritual questions
  const [activeCategoryId, setActiveCategoryId] = useState('temple-sevas')
  const [openFaqId, setOpenFaqId] = useState<string | null>('seva-1') // Open first item by default

  const activeCategory =
    FAQ_CATEGORIES.find((c) => c.id === activeCategoryId) || FAQ_CATEGORIES[1]

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id))
  }

  return (
    <section id="faq" className="relative bg-[#fffdf9] px-4 py-16 sm:px-6 lg:px-8 border-t border-[#ebdccd] scroll-mt-20">
      {/* Subtle auspicious background radial glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#f9f0e3] to-transparent opacity-60" />

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fbebd9] border border-[#f3d2b3] text-[#c1440e] text-xs font-bold uppercase tracking-wider mb-3">
            <span>🪔</span>
            <span>{isKn ? 'ಪ್ರಶ್ನೋತ್ತರ ವಿಭಾಗ' : 'Devotee Help Desk'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#2d1b14] leading-tight">
            {isKn ? 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು' : 'Frequently Asked Questions'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#7c695b] leading-relaxed">
            {isKn
              ? 'ದೇವಾಲಯದ ಸೇವಾ ಬುಕಿಂಗ್, ಸಂಕಲ್ಪ ವಿಧಿ, ಇ-ದರ್ಶನ ಮತ್ತು ಪ್ರಸಾದ ವಿತರಣೆಯ ಬಗ್ಗೆ ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ.'
              : 'Everything you need to know about booking rituals, personal Sankalpa, darshans, and consecrated prasadam delivery.'}
          </p>
        </div>

        {/* 2-Column Clean, Creative Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Category Navigation Tabs & Contact Support Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Category Navigation Box */}
            <div className="bg-white border border-[#ebdccd] rounded-2xl p-3 sm:p-4 shadow-sm">
              <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                {FAQ_CATEGORIES.map((cat) => {
                  const isActive = activeCategoryId === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategoryId(cat.id)
                        if (cat.items.length > 0) {
                          setOpenFaqId(cat.items[0].id)
                        }
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#f7e8d3] text-[#6b1820] shadow-2xs font-bold border-l-4 border-[#c1440e]'
                          : 'text-[#6b584b] hover:bg-[#faf4ec] hover:text-[#2d1b14]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`text-base ${isActive ? 'text-[#c1440e]' : 'text-[#a39082]'}`}>
                          <IonIcon name={cat.icon} />
                        </span>
                        <span>{isKn ? cat.labelKn : cat.labelEn}</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-[#c1440e]/15 text-[#8b1e2a] font-bold'
                            : 'bg-[#f4ebd9] text-[#8b796d]'
                        }`}
                      >
                        {cat.items.length}
                      </span>
                    </button>
                  )
                })}
              </nav>

              {/* Clean separator */}
              <div className="my-4 border-t border-[#f0e3d3]" />

              {/* "Need More Help?" Card matching user image with modern polish */}
              <div className="p-3.5 bg-[#fbf6ef] rounded-xl border border-[#ede0ce] text-left">
                <div className="flex items-center gap-2 text-[#9a2c16]">
                  <span className="text-base">📞</span>
                  <h3 className="font-serif text-sm font-bold text-[#2e1d15]">
                    {isKn ? 'ಹೆಚ್ಚಿನ ಸಹಾಯ ಬೇಕೇ?' : 'Need more help?'}
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#68584c]">
                  {isKn
                    ? 'ನಮ್ಮ ದೇವಸ್ಥಾನಂ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ:'
                    : 'Contact our Devasthanam Office at'}{' '}
                  <a
                    href="tel:+911234567890"
                    className="font-bold text-[#9a2c16] hover:underline whitespace-nowrap"
                  >
                    +91 1234567890
                  </a>{' '}
                  {isKn ? 'ಅಥವಾ' : 'or'}{' '}
                  <a
                    href="mailto:support@temple.org"
                    className="font-bold text-[#9a2c16] hover:underline"
                  >
                    support@temple.org
                  </a>
                </p>

                {/* Direct Action Chips */}
                <div className="mt-3.5 flex items-center gap-2 pt-1">
                  <a
                    href="tel:+911234567890"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#c1440e] text-white text-xs font-bold hover:bg-[#a83808] transition shadow-2xs"
                  >
                    <IonIcon name="call-outline" />
                    <span>{isKn ? 'ಕರೆ ಮಾಡಿ' : 'Call Desk'}</span>
                  </a>
                  <a
                    href="mailto:support@temple.org"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[#d8c2ad] bg-white text-[#523d32] text-xs font-semibold hover:bg-[#faf4ec] transition text-center"
                  >
                    <IonIcon name="mail-outline" />
                    <span>{isKn ? 'ಇಮೇಲ್' : 'Email Us'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Refined, Elegant Accordion Cards */}
          <div className="lg:col-span-8 space-y-3.5">
            {activeCategory.items.map((item) => {
              const isOpen = openFaqId === item.id
              const questionText = isKn ? item.questionKn : item.questionEn
              const answerText = isKn ? item.answerKn : item.answerEn

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl transition-all duration-300 overflow-hidden border ${
                    isOpen
                      ? 'border-[#c1440e] bg-white shadow-md ring-2 ring-[#c1440e]/10'
                      : 'border-[#ebdccd] bg-white hover:border-[#c1440e]/50 hover:shadow-xs'
                  }`}
                >
                  {/* Question Header Button */}
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left transition-colors cursor-pointer gap-4"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`shrink-0 flex items-center justify-center h-6 w-6 rounded-full text-xs transition-colors mt-0.5 ${
                          isOpen
                            ? 'bg-[#c1440e] text-white font-bold'
                            : 'bg-[#f7efe4] text-[#8e4526] font-semibold'
                        }`}
                      >
                        Q
                      </span>
                      <span
                        className={`font-serif text-base sm:text-lg leading-snug transition-colors ${
                          isOpen ? 'text-[#8b1e2a] font-bold' : 'text-[#34251e] font-semibold'
                        }`}
                      >
                        {questionText}
                      </span>
                    </div>

                    {/* Smooth Toggle Icon */}
                    <span
                      className={`shrink-0 flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#c1440e] text-white rotate-180 shadow-xs'
                          : 'bg-[#faf3ea] text-[#786657] hover:bg-[#f3e5d4]'
                      }`}
                    >
                      <IonIcon
                        name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                        className="text-base"
                      />
                    </span>
                  </button>

                  {/* Expanded Answer with Warm Devotional Bar */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[#5a483e] leading-relaxed animate-fade-in border-t border-[#f5ebdf]">
                      <div className="mt-3 pl-4 border-l-2 border-[#d49e4d] bg-[#fdfaf5] p-3.5 rounded-r-xl">
                        <p className="whitespace-pre-line">{answerText}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
