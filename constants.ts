
import { Question, StateLogic } from './types';

export const SAVE_ACT_BILL_URL = "https://www.congress.gov/bill/118th-congress/house-bill/8281/text";

export const STATES: StateLogic[] = [
  { code: 'AL', name: 'Alabama', strictDPOC: true, residencyDays: 30, notes: 'Strict physical proof required.' },
  { code: 'AK', name: 'Alaska', strictDPOC: false, residencyDays: 30, notes: 'Affidavits allowed.' },
  { code: 'AZ', name: 'Arizona', strictDPOC: true, residencyDays: 29, notes: 'Pioneer of DPOC laws; strict enforcement.' },
  { code: 'AR', name: 'Arkansas', strictDPOC: true, residencyDays: 30, notes: 'Mandatory proof for new registrations.' },
  { code: 'CA', name: 'California', strictDPOC: false, residencyDays: 15, notes: 'Automatic verification via DMV.' },
  { code: 'CO', name: 'Colorado', strictDPOC: false, residencyDays: 22, notes: 'Streamlined mail-in system.' },
  { code: 'CT', name: 'Connecticut', strictDPOC: false, notes: 'Integrated DMV verification.', residencyDays: 0 },
  { code: 'DE', name: 'Delaware', strictDPOC: false, residencyDays: 0, notes: 'Streamlined process.' },
  { code: 'DC', name: 'District of Columbia', strictDPOC: false, residencyDays: 30, notes: 'Affidavit and residency focused.' },
  { code: 'FL', name: 'Florida', strictDPOC: true, residencyDays: 29, notes: 'High strictness for new residents.' },
  { code: 'GA', name: 'Georgia', strictDPOC: true, residencyDays: 30, notes: 'Strict verification mandatory.' },
  { code: 'HI', name: 'Hawaii', strictDPOC: false, residencyDays: 30, notes: 'Streamlined system.' },
  { code: 'ID', name: 'Idaho', strictDPOC: true, residencyDays: 30, notes: 'Recent strict ID legislation.' },
  { code: 'IL', name: 'Illinois', strictDPOC: false, residencyDays: 30, notes: 'Automatic voter registration.' },
  { code: 'IN', name: 'Indiana', strictDPOC: true, residencyDays: 30, notes: 'Strict voter ID state.' },
  { code: 'IA', name: 'Iowa', strictDPOC: true, residencyDays: 0, notes: 'Strict compliance measures.' },
  { code: 'KS', name: 'Kansas', strictDPOC: true, residencyDays: 30, notes: 'Historical strict DPOC state.' },
  { code: 'KY', name: 'Kentucky', strictDPOC: true, residencyDays: 28, notes: 'Strict ID and residency verification.' },
  { code: 'LA', name: 'Louisiana', strictDPOC: true, residencyDays: 30, notes: 'Mandatory documentation.' },
  { code: 'ME', name: 'Maine', strictDPOC: false, residencyDays: 0, notes: 'Residency-focused verification.' },
  { code: 'MD', name: 'Maryland', strictDPOC: false, residencyDays: 21, notes: 'Streamlined DMV process.' },
  { code: 'MA', name: 'Massachusetts', strictDPOC: false, residencyDays: 20, notes: 'Streamlined process.' },
  { code: 'MI', name: 'Michigan', strictDPOC: false, residencyDays: 30, notes: 'DMV integration.' },
  { code: 'MN', name: 'Minnesota', strictDPOC: false, residencyDays: 20, notes: 'Affidavit/Same-day verification.' },
  { code: 'MS', name: 'Mississippi', strictDPOC: true, residencyDays: 30, notes: 'Strict enforcement.' },
  { code: 'MO', name: 'Missouri', strictDPOC: true, residencyDays: 30, notes: 'Strict photo ID and DPOC rules.' },
  { code: 'MT', name: 'Montana', strictDPOC: true, residencyDays: 30, notes: 'Strict ID requirements.' },
  { code: 'NE', name: 'Nebraska', strictDPOC: true, residencyDays: 30, notes: 'New strict ID laws.' },
  { code: 'NV', name: 'Nevada', strictDPOC: false, residencyDays: 30, notes: 'Streamlined mail-in verification.' },
  { code: 'NH', name: 'New Hampshire', strictDPOC: true, residencyDays: 0, notes: 'Strict residency and proof laws.' },
  { code: 'NJ', name: 'New Jersey', strictDPOC: false, residencyDays: 30, notes: 'Automatic registration.' },
  { code: 'NM', name: 'New Mexico', strictDPOC: false, residencyDays: 30, notes: 'Affidavit friendly.' },
  { code: 'NY', name: 'New York', strictDPOC: false, residencyDays: 30, notes: 'Streamlined DMV system.' },
  { code: 'NC', name: 'North Carolina', strictDPOC: true, residencyDays: 30, notes: 'Strict ID enforcement.' },
  { code: 'ND', name: 'North Dakota', strictDPOC: true, residencyDays: 30, notes: 'Strict ID/residency rules.' },
  { code: 'OH', name: 'Ohio', strictDPOC: true, residencyDays: 30, notes: 'Strict compliance.' },
  { code: 'OK', name: 'Oklahoma', strictDPOC: true, residencyDays: 25, notes: 'High strictness.' },
  { code: 'OR', name: 'Oregon', strictDPOC: false, residencyDays: 20, notes: 'Automatic DMV registration.' },
  { code: 'PA', name: 'Pennsylvania', strictDPOC: false, residencyDays: 30, notes: 'Hybrid verification system.' },
  { code: 'RI', name: 'Rhode Island', strictDPOC: false, residencyDays: 30, notes: 'Streamlined system.' },
  { code: 'SC', name: 'South Carolina', strictDPOC: true, residencyDays: 30, notes: 'Strict ID enforcement.' },
  { code: 'SD', name: 'South Dakota', strictDPOC: true, residencyDays: 30, notes: 'Strict compliance.' },
  { code: 'TN', name: 'Tennessee', strictDPOC: true, residencyDays: 30, notes: 'Mandatory proof requirements.' },
  { code: 'TX', name: 'Texas', strictDPOC: true, residencyDays: 30, notes: 'Very strict enforcement.' },
  { code: 'UT', name: 'Utah', strictDPOC: true, residencyDays: 30, notes: 'Strict verification state.' },
  { code: 'VT', name: 'Vermont', strictDPOC: false, residencyDays: 0, notes: 'Streamlined registration.' },
  { code: 'VA', name: 'Virginia', strictDPOC: false, residencyDays: 0, notes: 'Hybrid system.' },
  { code: 'WA', name: 'Washington', strictDPOC: false, residencyDays: 30, notes: 'Automatic registration.' },
  { code: 'WV', name: 'West Virginia', strictDPOC: true, residencyDays: 30, notes: 'Strict ID laws.' },
  { code: 'WI', name: 'Wisconsin', strictDPOC: true, residencyDays: 28, notes: 'Strict residency verification.' },
  { code: 'WY', name: 'Wyoming', strictDPOC: true, residencyDays: 30, notes: 'Strict ID and proof laws.' },
  { code: 'OTHER', name: 'Other Territory', strictDPOC: true, residencyDays: 30, notes: 'General SAVE Act baseline.' }
];

export const ACCEPTABLE_DPOC = [
  "U.S. Passport (valid or expired)",
  "Certified U.S. Birth Certificate",
  "Consular Report of Birth Abroad",
  "Naturalization Certificate",
  "Certificate of Citizenship",
  "Bureau of Indian Affairs Card / Tribal Treaty Card"
];

export const BRIDGING_DOCUMENTS = [
  "Certified Marriage Certificate(s)",
  "Final Divorce Decree(s) (showing name restoration)",
  "Certified Court Order for Legal Name Change",
  "Adoption Decree"
];

export const RESIDENCY_EXAMPLES = [
  "Current Utility Bill (Electric, Water, Gas, etc.)",
  "Bank or Credit Union Statement",
  "Residential Lease or Mortgage Statement",
  "Pay Stubs issued by employer (dated within 60 days)",
  "Property Tax Bill or Official Receipt",
  "Voter Registration Card from your previous jurisdiction",
  "Homeowner’s or Renter’s Insurance Policy/Statement",
  "Government Check or Official Correspondence",
  "W-2 or 1099 Tax Form (Current Tax Year)",
  "Valid Motor Vehicle Registration or Title",
  "Transcript or Enrollment Verification from a School/University",
  "Valid State-issued ID with your current address"
];

export const QUESTIONS: Question[] = [
  {
    id: 'citizenship',
    category: 'citizenship',
    text: 'Are you a citizen of the United States?',
    plainEnglish: 'The 2026 SAVE Act strictly prohibits non-citizens from registering or voting in federal elections. Only those born in the U.S. or naturalized are eligible.',
    options: [
      { id: 'c1', label: 'Yes', value: true },
      { id: 'c2', label: 'No', value: false }
    ]
  },
  {
    id: 'age',
    category: 'age',
    text: 'Will you be 18 or older by Election Day 2026?',
    plainEnglish: 'You must reach adulthood (18 years old) by the date of the election to be eligible to vote. You can often pre-register at 16 or 17 depending on the state.',
    options: [
      { id: 'a1', label: 'Yes', value: true },
      { id: 'a2', label: 'No', value: false }
    ]
  },
  {
    id: 'residency',
    category: 'residency',
    text: 'Do you live at your current address as your permanent home?',
    plainEnglish: 'You must have a "fixed habitation" in the state where you intend to vote. Most states require at least 30 days of residency prior to the election.',
    options: [
      { id: 'r1', label: 'Yes', value: true },
      { id: 'r2', label: 'No', value: false }
    ]
  },
  {
    id: 'residencyProof',
    category: 'residency',
    text: 'Do you have a physical document proving your address?',
    plainEnglish: 'To register, you usually need a paper or digital document that shows both your name and your current residency address.',
    options: [
      { id: 'rp1', label: 'Yes, I have proof', value: true },
      { id: 'rp2', label: 'No, I need to get this', value: false }
    ]
  },
  {
    id: 'dpoc',
    category: 'dpoc',
    text: 'Do you have Documentary Proof of Citizenship (DPOC)?',
    plainEnglish: 'This is the core of the SAVE Act. You must show an official document (like a birth certificate) that proves you were a citizen at birth or naturalized.',
    options: [
      { id: 'd1', label: 'Yes, I have it ready', value: 'ready' },
      { id: 'd2', label: 'I have it, but not with me', value: 'available' },
      { id: 'd3', label: 'No, I don\'t have these documents', value: 'none' }
    ]
  },
  {
    id: 'nameMatch',
    category: 'name_match',
    text: 'Does your ID match your citizenship document exactly?',
    plainEnglish: 'If your current ID says a different name than your birth certificate (due to marriage, divorce, etc.), you need legal "bridging" documents to link them.',
    options: [
      { id: 'n1', label: 'Yes, they match', value: true },
      { id: 'n2', label: 'No, they are different', value: false }
    ]
  },
  {
    id: 'residencyDuration',
    category: 'residency',
    text: 'Have you lived in {STATE_NAME} for at least {DAYS} days?',
    plainEnglish: 'Most states require you to establish residency for a specific period (usually 30 days) before you can vote in their elections.',
    options: [
      { id: 'rd1', label: 'Yes', value: true },
      { id: 'rd2', label: 'No', value: false }
    ]
  }
];
