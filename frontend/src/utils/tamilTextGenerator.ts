import { numberToTamilWords } from './tamilNumberConverter';

export interface PartyInfo {
  name: string;
  aadhaar: string;
  mobile: string;
  panCard?: string;
  age: string;
  doorNo: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  taluk: string;
  district: string;
  pincode: string;
  relationshipType: string;
  relationsName: string;
  bankName?: string;
  bankBranch?: string;
  accountType?: string;
  accountNo?: string;
}

export interface WitnessInfo {
  name: string;
  aadhaar: string;
  age: string;
  doorNo: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  taluk: string;
  district: string;
  pincode: string;
  relationshipType: string;
  relationsName: string;
}

export interface PreviousDocInfo {
  date: string;
  month: string;
  year: string;
  subRegisterOffice: string;
  bookNo: string;
  docYear: string;
  docNo: string;
  docType: string;
  originalOrXerox: 'அசல்' | 'ஜெராக்ஸ்';
}

export interface TransactionInfo {
  paymentMethod: string;
  amount: number;
  transactionNo?: string;
  transactionDate?: string;
  transactionMonth?: string;
  transactionYear?: string;
  buyerBankName?: string;
  buyerBankBranch?: string;
  buyerAccountType?: string;
  buyerAccountNo?: string;
  sellerBankName?: string;
  sellerBankBranch?: string;
  sellerAccountType?: string;
  sellerAccountNo?: string;
  chequeNo?: string;
  ddNo?: string;
}

export interface SaleDeedData {
  deedDate: { year: string; month: string; date: string };
  buyers: PartyInfo[];
  sellers: PartyInfo[];
  previousDoc: PreviousDocInfo;
  transaction: TransactionInfo;
  witnesses: WitnessInfo[];
  preparer: { name: string; office: string; mobile: string };
  propertyDetails: string;
}

export interface AgreementDeedData {
  deedDate: { year: string; month: string; date: string };
  buyer: PartyInfo;
  seller: PartyInfo;
  previousDoc: PreviousDocInfo;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
  deadline: string;
  deadlineUnit: string;
  witnesses: WitnessInfo[];
  preparer: { name: string; office: string; mobile: string };
  propertyDetails: string;
}

// Relationship type mapping for buyers/sellers
export function mapRelationship(relType: string): string {
  const map: Record<string, string> = {
    'தந்தை': 'மகனுமான',
    'மகன்': 'தந்தையுமான',
    'மகள்': 'மகளுமான',
    'மனைவி': 'மனைவியுமான',
    'கணவன்': 'கணவனுமான',
    'தாய்': 'மகனுமான',
    'சகோதரன்': 'சகோதரனுமான',
    'சகோதரி': 'சகோதரியுமான',
  };
  return map[relType] || relType;
}

// Relationship type mapping for witnesses
export function mapWitnessRelationship(relType: string): string {
  const map: Record<string, string> = {
    'மகன்': 'த/பெ',
    'மகள்': 'த/பெ',
    'மனைவி': 'க/பெ',
    'கணவன்': 'க/பெ',
    'தந்தை': 'த/பெ',
    'தாய்': 'த/பெ',
  };
  return map[relType] || relType;
}

function formatPartyAddress(p: PartyInfo): string {
  const parts = [
    p.district && p.pincode ? `${p.district} மாவட்டம்-${p.pincode}` : p.district || '',
    p.taluk ? `${p.taluk} வட்டம்` : '',
    p.addressLine3 || '',
    p.addressLine2 || '',
    p.addressLine1 || '',
    p.doorNo ? `கதவு எண்:-${p.doorNo}` : '',
  ].filter(Boolean);
  return parts.join(', ');
}

function formatPartyBlock(p: PartyInfo, index: number, total: number, isBuyer: boolean): string {
  const address = formatPartyAddress(p);
  const relMapped = mapRelationship(p.relationshipType);
  const suffix = isBuyer
    ? (index === total - 1 ? `-(${index + 1}) ஆகிய தங்களுக்கு` : `-(${index + 1})`)
    : (index === total - 1
      ? `-(${index + 1}) ஆகிய ${total > 1 ? 'நாங்கள்' : 'நான்'} எழுதிக் கொடுத்த சுத்தக்கிரைய சாசனப்பத்திரத்திற்கு விவரம் என்னவென்றால்,`
      : `-(${index + 1})`);

  const details = [
    p.aadhaar ? `ஆதார் அடையாள அட்டை எண்:-${p.aadhaar}` : '',
    p.panCard ? `நிரந்தர வருமான வரி கணக்கு எண்:-${p.panCard}` : '',
    p.mobile ? `கைப்பேசி எண்:-${p.mobile}` : '',
  ].filter(Boolean).join(', ');

  return `${address} என்ற முகவரியில் வசித்து வருபவரும், ${p.relationsName} அவர்களின் ${relMapped} ${p.age} வயதுடைய **${p.name}** (${details})${suffix}`;
}

function applyPluralForms(text: string, isBuyerPlural: boolean, isSellerPlural: boolean): string {
  if (isBuyerPlural || isSellerPlural) {
    const replacements: [string, string][] = [
      ['எழுதிக்கொடுப்பவருக்கு', 'எழுதிக்கொடுப்பவர்களுக்கு'],
      ['எழுதிவாங்குபவருக்கு', 'எழுதிவாங்குபவர்களுக்கு'],
      ['எழுதிக்கொடுப்பவர்', 'எழுதிக்கொடுப்பவர்கள்'],
      ['எழுதிவாங்குபவர்', 'எழுதிவாங்குபவர்கள்'],
      ['வாங்குபவர்', 'வாங்குபவர்கள்'],
      ['கொடுப்பவர்', 'கொடுப்பவர்கள்'],
      ['பெறுபவர்', 'பெறுபவர்கள்'],
      ['உறுதியளிக்கிறார்', 'உறுதியளிக்கிறார்கள்'],
    ];
    for (const [from, to] of replacements) {
      text = text.split(from).join(to);
    }
  }
  if (isSellerPlural) {
    const sellerReplacements: [string, string][] = [
      ['நானே', 'நாங்களே'],
      ['என்னுடைய', 'எங்களுடைய'],
      ['கொடுத்திருக்கின்றேன்', 'கொடுத்திருக்கின்றோம்'],
      ['சொல்கின்றேன்', 'சொல்கின்றோம்'],
      ['கூறுகிறேன்', 'கூறுகின்றோம்'],
      ['செய்கின்றேன்', 'செய்கின்றோம்'],
      ['ஆவேன்', 'ஆவோம்'],
      ['எனது', 'எங்களது'],
      ['எனக்கு', 'எங்களுக்கு'],
      ['நான்', 'நாங்கள்'],
    ];
    for (const [from, to] of sellerReplacements) {
      text = text.split(from).join(to);
    }
  }
  return text;
}

function getPaymentText(t: TransactionInfo, buyers: PartyInfo[], sellers: PartyInfo[], isPlural: boolean): string {
  const amtWords = numberToTamilWords(t.amount);
  const amtFormatted = t.amount.toLocaleString('en-IN');
  const buyerName = buyers[0]?.name || '';
  const sellerName = sellers[0]?.name || '';
  const naan = isPlural ? 'நாங்கள்' : 'நான்';
  const enakku = isPlural ? 'எங்களுக்கு' : 'எனக்கு';

  const baseEnd = `கீழ்க்கண்ட சொத்துக்களை இன்று தங்களுக்கு சுத்தக் கிரையமும் சுவாதீனமும் செய்து கொடுத்திருக்கின்${isPlural ? 'றோம்' : 'றேன்'}.`;

  switch (t.paymentMethod) {
    case 'ரொக்கம':
    case 'ரொக்கம்':
      return `மேற்படி வகையில் பாத்தியப்பட்டு என்னுடைய அனுபோக சுவாதீனத்தில் இருந்து வருகின்ற இதனடியிற்க்காணும் சொத்தை ${naan} தங்களுக்கு ரூ.${amtFormatted}/-(ரூபாய் ${amtWords} மட்டும்) விலைக்கு பேசி கொடுப்பதாக ஒப்புக்கொண்டு மேற்படி கிரையத் தொகையை கீழ்க்கண்ட சாட்சிகள் முன்பாக ${naan} ரொக்கமாகப் பெற்றுக்கொண்டு ${baseEnd}`;

    case 'வங்கி காசோலை':
      return `கிரையம் எழுதி பெறும் ${buyerName} அவர்களின் ${t.buyerBankName || ''}, ${t.buyerBankBranch || ''}, ${t.buyerAccountType || ''} ACCOUNT NO. ${t.buyerAccountNo || ''}-இதன் வங்கிக் காசோலை எண்:-${t.chequeNo || ''}-மூலம், கிரையம் எழுதி கொடுக்கும் ${sellerName} அவர்களின் பெயரில் வழங்கிய தொகை ரூ.${amtFormatted}/-(ரூபாய் ${amtWords}) மட்டும் ${t.transactionDate || ''}/${t.transactionMonth || ''}/${t.transactionYear || ''}-ம் தேதியில் வரவாகி விட்டபடியால், ${baseEnd}`;

    case 'வங்கி வரைவோலை':
      return `கிரையம் எழுதி பெறும் ${buyerName} அவர்களின் ${t.buyerBankName || ''}, ${t.buyerBankBranch || ''}, ${t.buyerAccountType || ''} ACCOUNT NO. ${t.buyerAccountNo || ''}-இதன் வங்கி வரைவோலை எண்:-${t.ddNo || ''}-மூலம், கிரையம் எழுதி கொடுக்கும் ${sellerName} அவர்களின் பெயரில் வழங்கிய தொகை ரூ.${amtFormatted}/-(ரூபாய் ${amtWords}) மட்டும் ${t.transactionDate || ''}/${t.transactionMonth || ''}/${t.transactionYear || ''}-ம் தேதியில் வரவாகி விட்டபடியால், ${baseEnd}`;

    case 'UPI':
      return `கிரையம் பெறும் ${buyerName} அவர்களின் ${t.buyerBankName || ''}, ${t.buyerBankBranch || ''}, ${t.buyerAccountType || ''} ACCOUNT NO.${t.buyerAccountNo || ''}-இதிலிருந்து, எனது ${t.sellerBankName || ''}, ${t.sellerBankBranch || ''}, ${t.sellerAccountType || ''} ACCOUNT NO.${t.sellerAccountNo || ''}-க்கு வங்கி மின்னணு பரிவர்த்தனை எண்.(G-PAY-UPI):-${t.transactionNo || ''}-மூலம் ரூ.${amtFormatted}/-(ரூபாய் ${amtWords}) மட்டும் ${t.transactionDate || ''}/${t.transactionMonth || ''}/${t.transactionYear || ''}-ம் தேதியில் ${enakku} வரவாகி விட்டபடியால், ${baseEnd}`;

    case 'NEFT':
      return `கிரையம் பெறும் ${buyerName} அவர்களின் ${t.buyerBankName || ''}, ${t.buyerBankBranch || ''}, ${t.buyerAccountType || ''} ACCOUNT NO.${t.buyerAccountNo || ''}-இதிலிருந்து, எனது ${t.sellerBankName || ''}, ${t.sellerBankBranch || ''}, ${t.sellerAccountType || ''} ACCOUNT NO.${t.sellerAccountNo || ''}-க்கு வங்கி மின்னணு பரிவர்த்தனை எண்.(NEFT):-${t.transactionNo || ''}-மூலம் ரூ.${amtFormatted}/-(ரூபாய் ${amtWords}) மட்டும் ${t.transactionDate || ''}/${t.transactionMonth || ''}/${t.transactionYear || ''}-ம் தேதியில் ${enakku} வரவாகி விட்டபடியால், ${baseEnd}`;

    case 'RTGS':
      return `கிரையம் பெறும் ${buyerName} அவர்களின் ${t.buyerBankName || ''}, ${t.buyerBankBranch || ''}, ${t.buyerAccountType || ''} ACCOUNT NO.${t.buyerAccountNo || ''}-இதிலிருந்து, எனது ${t.sellerBankName || ''}, ${t.sellerBankBranch || ''}, ${t.sellerAccountType || ''} ACCOUNT NO.${t.sellerAccountNo || ''}-க்கு வங்கி மின்னணு பரிவர்த்தனை எண்.(RTGS):-${t.transactionNo || ''}-மூலம் ரூ.${amtFormatted}/-(ரூபாய் ${amtWords}) மட்டும் ${t.transactionDate || ''}/${t.transactionMonth || ''}/${t.transactionYear || ''}-ம் தேதியில் ${enakku} வரவாகி விட்டபடியால், ${baseEnd}`;

    case 'IMPS':
      return `கிரையம் பெறும் ${buyerName} அவர்களின் ${t.buyerBankName || ''}, ${t.buyerBankBranch || ''}, ${t.buyerAccountType || ''} ACCOUNT NO.${t.buyerAccountNo || ''}-இதிலிருந்து, எனது ${t.sellerBankName || ''}, ${t.sellerBankBranch || ''}, ${t.sellerAccountType || ''} ACCOUNT NO.${t.sellerAccountNo || ''}-க்கு வங்கி மின்னணு பரிவர்த்தனை எண்.(IMPS):-${t.transactionNo || ''}-மூலம் ரூ.${amtFormatted}/-(ரூபாய் ${amtWords}) மட்டும் ${t.transactionDate || ''}/${t.transactionMonth || ''}/${t.transactionYear || ''}-ம் தேதியில் ${enakku} வரவாகி விட்டபடியால், ${baseEnd}`;

    default:
      return `மேற்படி கிரையத் தொகை ரூ.${amtFormatted}/-(ரூபாய் ${amtWords} மட்டும்) பெற்றுக்கொண்டு ${baseEnd}`;
  }
}

export function generateSaleDeedText(data: SaleDeedData): string {
  const { deedDate, buyers, sellers, previousDoc, transaction, witnesses, preparer, propertyDetails } = data;
  const isMultiBuyer = buyers.length > 1;
  const isMultiSeller = sellers.length > 1;
  const amtFormatted = transaction.amount.toLocaleString('en-IN');
  const amtWords = numberToTamilWords(transaction.amount);

  const buyerBlocks = buyers.map((b, i) => formatPartyBlock(b, i, buyers.length, true)).join('\n');
  const sellerBlocks = sellers.map((s, i) => formatPartyBlock(s, i, sellers.length, false)).join('\n');

  const naan = isMultiSeller ? 'நாங்கள்' : 'நான்';
  const enakku = isMultiSeller ? 'எங்களுக்கு' : 'எனக்கு';
  const ennudaiya = isMultiSeller ? 'எங்களுடைய' : 'என்னுடைய';

  const paymentText = getPaymentText(transaction, buyers, sellers, isMultiSeller);

  const witnessBlocks = witnesses.map((w, i) => {
    const relAbbr = mapWitnessRelationship(w.relationshipType);
    const addr = [
      w.doorNo ? `கதவு எண்:-${w.doorNo}` : '',
      w.addressLine1 || '',
      w.addressLine2 || '',
      w.addressLine3 || '',
      w.taluk ? `${w.taluk} வட்டம்` : '',
      w.district && w.pincode ? `${w.district} மாவட்டம்-${w.pincode}` : w.district || '',
    ].filter(Boolean).join(', ');
    return `${i + 1}. (${w.name}) ${relAbbr}.${w.relationsName}, ${addr}, (வயது-${w.age}) (ஆதார் அடையாள அட்டை எண்:-${w.aadhaar}).`;
  }).join('\n');

  let text = `கிரையம் ரூ.${amtFormatted}/-
${deedDate.year}-ம் வருடம் ${deedDate.month} மாதம் ${deedDate.date}-ம் தேதியில்

${buyerBlocks}

${sellerBlocks}

${enakku} கடந்த ${previousDoc.date}/${previousDoc.month}/${previousDoc.year}-ம் தேதியில், ${previousDoc.subRegisterOffice} சார்பதிவாளர் அலுவலகத்தில் ${previousDoc.bookNo} புத்தகம் ${previousDoc.docYear}-ம் ஆண்டின் ${previousDoc.docNo}-ம் எண்ணாக பதிவு செய்யப்பட்ட ${previousDoc.docType} ஆவணத்தின் படி பாத்தியப்பட்டதாகும்.

மேற்படி வகையில் பாத்தியப்பட்டு ${ennudaiya} அனுபோக சுவாதீனத்தில் இருந்து வருகின்ற இதனடியிற்க்காணும் சொத்தை ${naan} தங்களுக்கு ரூ.${amtFormatted}/-(ரூபாய் ${amtWords} மட்டும்) விலைக்கு பேசி கொடுப்பதாக ஒப்புக்கொண்டு மேற்படி கிரையத் தொகையை கீழ்க்கண்ட சாட்சிகள் முன்பாக ${naan} ரொக்கமாகப் பெற்றுக்கொண்டு கீழ்க்கண்ட சொத்துக்களை இன்று தங்களுக்கு சுத்தக்கிரையமும் சுவாதீனமும் செய்து கொடுத்திருக்கின்${isMultiSeller ? 'றோம்' : 'றேன்'}.

${paymentText}

கிரைய சொத்தை இது முதல் தாங்களே சர்வ சுதந்திர பாத்தியத்துடனும் தானாதி வினியோகங்களுக்கு யோக்கியமாகவும் அடைந்து ஆண்டனுபவித்துக் கொள்ள வேண்டியது.

கிரையச் சொத்தை குறித்து இனிமேல் எனக்கும், எனக்கு பின்னிட்ட எனது இதர ஆண், பெண் வாரிசுகளுக்கும் இனி எவ்வித பாத்தியமும் சம்மந்தமும் பின் தொடர்ச்சியும் உரிமையும் இல்லை.

கிரைய சொத்துக்களின் பேரில் யாதொரு முன் வில்லங்க விவகாரம், கடன், கோர்ட் நடவடிக்கைகள் முதலியவை ஏதுமில்லையென்றும் உண்மையாகவும் உறுதியாகவும் ${isMultiSeller ? 'சொல்கின்றோம்' : 'சொல்கின்றேன்'}.

பின்னிட்டு அப்படி ஒருகால் ஏதேனும் முன் வில்லங்க விவகாரம், அடமானம், கிரைய உடன்படிக்கை, கோர்ட் நடவடிக்கைகள், போக்கியம், ஈக்விட்டபுள் மார்ட்கேஜ் முதலியவை ஏதுமிருப்பதாகத் தெரியவரும் பட்சத்தில் அவற்றை ${naan}ஏ முன்னின்று எனது சொந்த செலவிலும், சொந்த பொறுப்பிலும் எனது இதர சொத்துக்களைக் கொண்டு ${naan}ஏ ஜவாப்தாரியாய் இருந்து கிரைய சொத்துக்கு நஷ்டம் ஏற்படாதவாறு ${naan}ஏ முன்னின்று தீர்த்துக் கொடுக்க இதன் மூலம் உறுதி ${isMultiSeller ? 'கூறுகின்றோம்' : 'கூறுகிறேன்'}.

கிரைய பத்திரத்தில் எழுதிக்கொடுப்பவருக்கு முழு உரிமையும் சுவாதீனமும் உள்ளது என எழுதிவாங்குபவருக்கு, எழுதிக்கொடுப்பவர் உறுதியளித்ததின் பேரிலும், எழுதிக்கொடுப்பவர் அளித்த பதிவுருக்களை எழுதிவாங்குபவர் ஆய்வு செய்து, அதன் பேரில் இந்த கிரைய ஆவணம் தயார் செய்யப்பட்டு எழுதிவாங்குபவர், எழுதிக்கொடுப்பவர் என இரு தரப்பினரும் படித்துப்பார்த்தும் படிக்கச்சொல்லி கேட்டும் மன நிறைவு அடைந்ததன் பேரிலும் இக்கிரைய ஆவணம் பதிவு செய்யப்படுகிறது.

பிற்காலத்தில் கிரைய ஆவணத்தில் ஏதேனும் பிழைகள் ஏற்பட்டதாக வாங்குபவர் கருதினால், சம்பந்தப்பட்ட சார்பதிவாளர் அலுவலகம் வந்து பிழை திருத்தல் ஆவணத்தில் எந்தவொரு பிரதி பிரயோஜனமும் பெற்றுக் கொள்ளாமல் பிழையைத் திருத்திக் கொடுக்க ${naan} கடமைப்பட்டவர் ${isMultiSeller ? 'ஆவோம்' : 'ஆவேன்'}.

மேற்படி ${naan} பிழைத்திருத்தல் பத்திரம் எழுதிக்கொடுக்க தவறினால், மேற்படி கிரையம் பெறும் தாங்களே உறுதிமொழி ஆவணம் எழுதி, அதன் மூலம் பிழையை திருத்திக் கொள்ள வேண்டியது.

கீழ்க்கண்ட கிரைய சொத்தின் பட்டா தங்கள் பெயருக்கு மாறும் பொருட்டு பட்டா மாறுதல் மனுவும் இத்துடன் தாக்கல் ${isMultiSeller ? 'செய்கின்றோம்' : 'செய்கின்றேன்'}.

மேலே சொன்ன ${previousDoc.bookNo} புத்தகம் ${previousDoc.docNo}/${previousDoc.docYear} கந ${previousDoc.docType} ஆவணத்தின் ${previousDoc.originalOrXerox === 'அசல்' ? 'அசலை' : 'ஜெராக்ஸ் காப்பியை'} இக்கிரைய ஆவணத்திற்கு ஆதரவாக தங்களுக்கு கொடுத்திருக்கின்${isMultiSeller ? 'றோம்' : 'றேன்'}.

மேலும் தணிக்கையின் போது இந்த ஆவணம் தொடர்பாக அரசுக்கு இழப்பு ஏற்படின் அத்தொகையை கிரையம் பெறுபவர் செலுத்தவும் உறுதியளிக்கிறார்.

சொத்து விவரம்
${propertyDetails || '[சொத்து விவரங்கள் இங்கே]'}

எழுதிக்கொடுப்பவர்                    எழுதிவாங்குபவர்

சாட்சிகள் :-*******************************************************************************************
${witnessBlocks}

கணினியில் தட்டச்சு செய்து ஆவணம் தயார் செய்தவர்:-${preparer.name}
(${preparer.office}, போன்:-${preparer.mobile})`;

  text = applyPluralForms(text, isMultiBuyer, isMultiSeller);
  return text;
}

export function generateAgreementDeedText(data: AgreementDeedData): string {
  const { deedDate, buyer, seller, previousDoc, totalAmount, advanceAmount, balanceAmount, deadline, deadlineUnit, witnesses, preparer, propertyDetails } = data;

  const totalAmtWords = numberToTamilWords(totalAmount);
  const advanceAmtWords = numberToTamilWords(advanceAmount);
  const balanceAmtWords = numberToTamilWords(balanceAmount);
  const totalFmt = totalAmount.toLocaleString('en-IN');
  const advanceFmt = advanceAmount.toLocaleString('en-IN');
  const balanceFmt = balanceAmount.toLocaleString('en-IN');

  const buyerAddr = formatPartyAddress(buyer);
  const sellerAddr = formatPartyAddress(seller);
  const buyerRelMapped = mapRelationship(buyer.relationshipType);
  const sellerRelMapped = mapRelationship(seller.relationshipType);

  const witnessBlocks = witnesses.map((w, i) => {
    const relAbbr = mapWitnessRelationship(w.relationshipType);
    const addr = [
      w.doorNo ? `கதவு எண்:-${w.doorNo}` : '',
      w.addressLine1 || '',
      w.addressLine2 || '',
      w.addressLine3 || '',
      w.taluk ? `${w.taluk} வட்டம்` : '',
      w.district && w.pincode ? `${w.district} மாவட்டம்-${w.pincode}` : w.district || '',
    ].filter(Boolean).join(', ');
    return `${i + 1}. (${w.name}) ${relAbbr}.${w.relationsName}, ${addr}, (வயது-${w.age}) (ஆதார் அடையாள அட்டை எண்:-${w.aadhaar}).`;
  }).join('\n');

  return `கிரைய உடன்படிக்கை பத்திரம்
${deedDate.year}-ம் வருடம் ${deedDate.month} மாதம் ${deedDate.date}-ம் தேதியில்

${buyerAddr} என்ற முகவரியில் வசித்து வருபவரும், ${buyer.relationsName} அவர்களின் ${buyerRelMapped} ${buyer.age} வயதுடைய **${buyer.name}** (ஆதார் அடையாள அட்டை எண்:- ${buyer.aadhaar}, கைப்பேசி எண்:- ${buyer.mobile})-(1),

${sellerAddr} என்ற முகவரியில் வசித்து வருபவரும், ${seller.relationsName} அவர்களின் ${sellerRelMapped} ${seller.age} வயதுடைய **${seller.name}** (ஆதார் அடையாள அட்டை எண்:-${seller.aadhaar}, கைப்பேசி எண்:- ${seller.mobile})-(2)

ஆகிய நாம் இருவரும் சம்மதித்து எழுதி வைத்துக் கொண்ட கிரைய உடன்படிக்கை பத்திரம் என்னவென்றால்,

நம்மில் 2-லக்கமிட்ட ${seller.name} என்பவருக்கு, கடந்த ${previousDoc.date}/${previousDoc.month}/${previousDoc.year}-ம் தேதியில், ${previousDoc.subRegisterOffice} சார்பதிவாளர் அலுவலகத்தில் ${previousDoc.bookNo} புத்தகம் ${previousDoc.docYear}-ம் ஆண்டின் ${previousDoc.docNo}-ம் எண்ணாக பதிவு செய்யப்பட்ட ${previousDoc.docType} ஆவணத்தின் படி பாத்தியப்பட்ட கீழ்க்கண்ட சொத்துக்களை, நம்மில் 2-லக்கமிட்டவர், நம்மில் 1-லக்கமிட்டவருக்கு ரூ.${totalFmt}/-(ரூபாய் ${totalAmtWords} மட்டும்) கிரையத்துக்கு பேசி கொடுப்பதாக ஒப்புக்கொண்டு, நம்மில் 1-லக்கமிட்டவரிடமிருந்து (ADVANCE AMOUNT) ரூ.${advanceFmt}/-(ரூபாய் ${advanceAmtWords} மட்டும்) முன்பணமாக நம்மில் 2-லக்கமிட்டவர் கீழ்கண்ட சாட்சிகள் முன்னிலையில் ரொக்கமாக பெற்றுக் கொண்டுள்ளார்.

நம்மில் 1-லக்கமிட்டவர், நம்மில் 2-லக்கமிட்டவருக்கு நாளது தேதியில் இருந்து எதிர்வரும் ${deadline} ${deadlineUnit}களுக்குள், மீதி பாக்கி தொகை (BALANCE AMOUNT) ரூ.${balanceFmt}/-(ரூபாய் ${balanceAmtWords} மட்டும்)-செலுத்தி தன் சொந்த செலவில் கிரையம் செய்து கொள்ள வேண்டியது.

நாளது தேதியில் இருந்து மேற்படி கெடுவிற்குள் நம்மில் 1-லக்கமிட்டவர் மேற்படி பாக்கி தொகையை நம்மில் 2-லக்கமிட்டவருக்கு செலுத்தி, நம்மில் 1-லக்கமிட்டவர் தன் சொந்த செலவில் கிரையம் செய்து கொள்ள தயாராக இருந்து, நம்மில் 1-லக்கமிட்டவர் கிரையம் செய்து கொடுக்கும் படி கூப்பிடும் போது, நம்மில் 2-லக்கமிட்டவர் சர்வ வில்லங்க சுத்தியாய் சகல வாரிசுகள் சகிதமாய், நம்மில் 1-லக்கமிட்டவருக்கோ அல்லது அவர் கோரும் நபருக்கோ கிரையமும் சுவாதீனம் செய்து கொடுத்து விட வேண்டியது.

அப்படி நம்மில் 2-லக்கமிட்டவர் கிரையமும் சுவாதீனமும் செய்து கொடுக்க மறுத்தாலும் அல்லது வீண் காலதாமதம் செய்தாலும் நம்மில் 1-லக்கமிட்டவர் மேற்படி பாக்கி தொகையை தகுந்த நீதிமன்றத்தில் டெபாசிட் செய்து, நம்மில் 2-லக்கமிட்டவரின் அனுமதி இல்லாமலேயே நம்மில் 1-லக்கமிட்டவரால் கட்டாய கிரையம் செய்து கொள்ள வேண்டியதாகும்.

இதற்கு ஆகும் நீதிமன்ற செலவினங்களுக்கும், இதர செலவினங்களுக்கும் மேற்படி டெபாசிட் தொகையில் பிடித்தம் செய்து கொள்ள வேண்டியதாகும்.

மேற்படி கெடுவிற்குள் நம்மில் 1-லக்கமிட்டவர் கிரையம் செய்ய தவறினால் இன்று நம்மில் 2-லக்கமிட்டவருக்கு செலுத்திய முன்பணத்தை இழந்து விட வேண்டியதாகும்.

இந்த படிக்கு நாம் இருவரும் சேர்ந்து சம்மதித்து எழுதி வைத்துக் கொண்ட சுவாதீனம் இல்லாத கிரைய உடன்படிக்கை பத்திரம்.

சொத்து விவரம்
${propertyDetails || '[சொத்து விவரங்கள் இங்கே]'}

சாட்சிகள் :-*******************************************************************************************
${witnessBlocks}

கணினியில் தட்டச்சு செய்து ஆவணம் தயார் செய்தவர்:-${preparer.name}
(${preparer.office}, போன்:-${preparer.mobile})`;
}
