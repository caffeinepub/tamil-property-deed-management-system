import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import TamilPreview from '../components/TamilPreview';
import PartyFormFields from '../components/PartyFormFields';
import WitnessFormFields from '../components/WitnessFormFields';
import DocumentPreparerSelect from '../components/DocumentPreparerSelect';
import PartySearchSelect from '../components/PartySearchSelect';
import { useGetAllParties, useGetAllLocations, useSaveDraft, useGetAllDrafts } from '../hooks/useQueries';
import { generateSaleDeedText } from '../utils/tamilTextGenerator';
import { numberToTamilWords } from '../utils/tamilNumberConverter';
import type { PartyInfo, WitnessInfo, PreviousDocInfo, TransactionInfo } from '../utils/tamilTextGenerator';
import type { Party, DeedType } from '../backend';
import { toast } from 'sonner';

const TAMIL_MONTHS = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - 10 + i));
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const DOC_TYPES = ['கிரைய', 'தானசெட்டில்மெண்ட்', 'பாகசாசன', 'பரிவர்த்தனை', 'உயில்', 'விடுதலை', 'நீதிமன்ற தீர்ப்பாணை'];
const PAYMENT_METHODS = ['ரொக்கம்', 'வங்கி வரைவோலை', 'வங்கி காசோலை', 'RTGS', 'IMPS', 'NEFT', 'UPI'];
const BOOK_NOS = ['1', '3', '4'];

const emptyParty: PartyInfo = {
  name: '', aadhaar: '', mobile: '', panCard: '', age: '',
  doorNo: '', addressLine1: '', addressLine2: '', addressLine3: '',
  taluk: '', district: '', pincode: '', relationshipType: '', relationsName: '',
};

const emptyWitness: WitnessInfo = {
  name: '', aadhaar: '', age: '', doorNo: '',
  addressLine1: '', addressLine2: '', addressLine3: '',
  taluk: '', district: '', pincode: '', relationshipType: '', relationsName: '',
};

const emptyPrevDoc: PreviousDocInfo = {
  date: '01', month: 'ஜனவரி', year: String(new Date().getFullYear()),
  subRegisterOffice: '', bookNo: '1', docYear: String(new Date().getFullYear()),
  docNo: '', docType: 'கிரைய', originalOrXerox: 'அசல்',
};

const emptyTransaction: TransactionInfo = {
  paymentMethod: 'ரொக்கம்', amount: 0,
};

function partyToPartyInfo(p: Party): PartyInfo {
  return {
    name: p.name, aadhaar: p.aadhaar, mobile: p.mobile, panCard: '',
    age: '', doorNo: '', addressLine1: p.address, addressLine2: '', addressLine3: '',
    taluk: '', district: '', pincode: '', relationshipType: p.relationship, relationsName: '',
  };
}

const STEPS = [
  { label: 'விற்பவர் விவரம்', labelEn: 'Seller Details' },
  { label: 'வாங்குபவர் விவரம்', labelEn: 'Buyer Details' },
  { label: 'சொத்து விவரம்', labelEn: 'Property Details' },
  { label: 'பரிவர்த்தனை விவரம்', labelEn: 'Transaction Details' },
  { label: 'சாட்சிகள் விவரம்', labelEn: 'Witness Details' },
];

export default function SaleDeedForm() {
  const { data: allParties = [] } = useGetAllParties();
  const { data: locations = [] } = useGetAllLocations();
  const saveDraft = useSaveDraft();

  const [step, setStep] = useState(0);
  const [sellers, setSellers] = useState<PartyInfo[]>([{ ...emptyParty }]);
  const [buyers, setBuyers] = useState<PartyInfo[]>([{ ...emptyParty }]);
  const [propertyDetails, setPropertyDetails] = useState('');
  const [prevDoc, setPrevDoc] = useState<PreviousDocInfo>({ ...emptyPrevDoc });
  const [transaction, setTransaction] = useState<TransactionInfo>({ ...emptyTransaction });
  const [witnesses, setWitnesses] = useState<WitnessInfo[]>([{ ...emptyWitness }, { ...emptyWitness }]);
  const [preparer, setPreparer] = useState({ name: '', office: '', mobile: '' });
  const [deedDate, setDeedDate] = useState({ year: String(new Date().getFullYear()), month: TAMIL_MONTHS[new Date().getMonth()], date: String(new Date().getDate()).padStart(2, '0') });
  const [draftId] = useState(`draft_sale_${Date.now()}`);

  const previewText = useMemo(() => {
    if (sellers.every(s => !s.name) && buyers.every(b => !b.name)) return '';
    return generateSaleDeedText({
      deedDate, buyers, sellers, previousDoc: prevDoc,
      transaction, witnesses, preparer, propertyDetails,
    });
  }, [deedDate, buyers, sellers, prevDoc, transaction, witnesses, preparer, propertyDetails]);

  const handleSaveDraft = async () => {
    const formData = JSON.stringify({ deedDate, buyers, sellers, prevDoc, transaction, witnesses, preparer, propertyDetails, step });
    const now = BigInt(Date.now());
    try {
      await saveDraft.mutateAsync({
        id: draftId,
        deedType: 'SaleDeed' as unknown as DeedType,
        createdAt: now,
        updatedAt: now,
        formData,
      });
      toast.success('வரைவு சேமிக்கப்பட்டது / Draft saved');
    } catch {
      toast.error('சேமிக்க முடியவில்லை');
    }
  };

  const addSeller = () => setSellers(s => [...s, { ...emptyParty }]);
  const removeSeller = (i: number) => setSellers(s => s.filter((_, idx) => idx !== i));
  const updateSeller = (i: number, p: PartyInfo) => setSellers(s => s.map((x, idx) => idx === i ? p : x));

  const addBuyer = () => setBuyers(b => [...b, { ...emptyParty }]);
  const removeBuyer = (i: number) => setBuyers(b => b.filter((_, idx) => idx !== i));
  const updateBuyer = (i: number, p: PartyInfo) => setBuyers(b => b.map((x, idx) => idx === i ? p : x));

  const handleAddPartyAsSeller = (party: Party) => {
    setSellers(s => [...s.filter(x => x.name), partyToPartyInfo(party)]);
  };
  const handleRemovePartyFromSellers = (id: string) => {
    const party = allParties.find(p => p.id === id);
    if (party) setSellers(s => s.filter(x => x.name !== party.name));
  };
  const selectedSellersAsParties = sellers.filter(s => s.name).map(s => allParties.find(p => p.name === s.name)).filter(Boolean) as Party[];

  const handleAddPartyAsBuyer = (party: Party) => {
    setBuyers(b => [...b.filter(x => x.name), partyToPartyInfo(party)]);
  };
  const handleRemovePartyFromBuyers = (id: string) => {
    const party = allParties.find(p => p.id === id);
    if (party) setBuyers(b => b.filter(x => x.name !== party.name));
  };
  const selectedBuyersAsParties = buyers.filter(b => b.name).map(b => allParties.find(p => p.name === b.name)).filter(Boolean) as Party[];

  const amtWords = transaction.amount > 0 ? numberToTamilWords(transaction.amount) : '';

  const needsBankDetails = ['வங்கி வரைவோலை', 'வங்கி காசோலை', 'RTGS', 'IMPS', 'NEFT', 'UPI'].includes(transaction.paymentMethod);

  return (
    <div className="flex h-[calc(100vh-57px)] overflow-hidden">
      {/* Left: Form */}
      <div className="w-1/2 flex flex-col border-r border-border">
        {/* Step indicator */}
        <div className="flex items-center gap-1 px-4 py-3 bg-muted/30 border-b border-border overflow-x-auto no-print">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                i === step ? 'bg-primary text-primary-foreground' :
                i < step ? 'bg-accent text-accent-foreground' :
                'bg-muted text-muted-foreground'
              }`}
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold border border-current">{i + 1}</span>
              <span className="font-tamil hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Step 0: Seller Details */}
            {step === 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-tamil text-foreground">விற்பவர் விவரங்கள் / Seller Details</h3>
                </div>

                {/* Deed Date */}
                <div className="border border-border rounded-lg p-3 bg-card space-y-2">
                  <div className="text-xs font-semibold text-primary font-tamil">கிரைய தேதி / Deed Date</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs font-tamil">வருடம் / Year</Label>
                      <Select value={deedDate.year} onValueChange={v => setDeedDate(d => ({ ...d, year: v }))}>
                        <SelectTrigger className="h-8 text-sm font-english"><SelectValue /></SelectTrigger>
                        <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-tamil">மாதம் / Month</Label>
                      <Select value={deedDate.month} onValueChange={v => setDeedDate(d => ({ ...d, month: v }))}>
                        <SelectTrigger className="h-8 text-sm font-tamil"><SelectValue /></SelectTrigger>
                        <SelectContent>{TAMIL_MONTHS.map(m => <SelectItem key={m} value={m} className="font-tamil">{m}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-tamil">தேதி / Date</Label>
                      <Select value={deedDate.date} onValueChange={v => setDeedDate(d => ({ ...d, date: v }))}>
                        <SelectTrigger className="h-8 text-sm font-english"><SelectValue /></SelectTrigger>
                        <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Search & add from party management */}
                <div className="border border-border rounded-lg p-3 bg-card space-y-2">
                  <div className="text-xs font-semibold text-primary font-tamil">நபர்கள் மேலாண்மையிலிருந்து தேர்ந்தெடுக்கவும்</div>
                  <PartySearchSelect
                    parties={allParties}
                    selectedParties={selectedSellersAsParties}
                    onAdd={handleAddPartyAsSeller}
                    onRemove={handleRemovePartyFromSellers}
                    label="விற்பவர்"
                  />
                </div>

                {/* Manual seller entries */}
                {sellers.map((seller, i) => (
                  <div key={i} className="relative">
                    <PartyFormFields party={seller} onChange={p => updateSeller(i, p)} index={i} label="விற்பவர்" />
                    {sellers.length > 1 && (
                      <button onClick={() => removeSeller(i)} className="absolute top-2 right-2 text-destructive hover:text-destructive/80">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addSeller} className="gap-1 font-tamil text-xs w-full">
                  <Plus size={13} /> மேலும் விற்பவர் சேர்க்க
                </Button>
              </div>
            )}

            {/* Step 1: Buyer Details */}
            {step === 1 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-tamil text-foreground">வாங்குபவர் விவரங்கள் / Buyer Details</h3>

                <div className="border border-border rounded-lg p-3 bg-card space-y-2">
                  <div className="text-xs font-semibold text-primary font-tamil">நபர்கள் மேலாண்மையிலிருந்து தேர்ந்தெடுக்கவும்</div>
                  <PartySearchSelect
                    parties={allParties}
                    selectedParties={selectedBuyersAsParties}
                    onAdd={handleAddPartyAsBuyer}
                    onRemove={handleRemovePartyFromBuyers}
                    label="வாங்குபவர்"
                  />
                </div>

                {buyers.map((buyer, i) => (
                  <div key={i} className="relative">
                    <PartyFormFields party={buyer} onChange={p => updateBuyer(i, p)} index={i} label="வாங்குபவர்" />
                    {buyers.length > 1 && (
                      <button onClick={() => removeBuyer(i)} className="absolute top-2 right-2 text-destructive hover:text-destructive/80">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addBuyer} className="gap-1 font-tamil text-xs w-full">
                  <Plus size={13} /> மேலும் வாங்குபவர் சேர்க்க
                </Button>
              </div>
            )}

            {/* Step 2: Property Details */}
            {step === 2 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-tamil text-foreground">சொத்து விவரம் / Property Details</h3>
                <div>
                  <Label className="font-tamil text-sm">சொத்து விவரங்கள் (முழு விவரம்)</Label>
                  <Textarea
                    value={propertyDetails}
                    onChange={e => setPropertyDetails(e.target.value)}
                    className="font-tamil text-sm min-h-[200px]"
                    placeholder="சொத்தின் முழு விவரங்களை இங்கே உள்ளீடு செய்யவும்..."
                  />
                </div>

                {/* Previous Document */}
                <div className="border border-border rounded-lg p-3 bg-card space-y-2">
                  <div className="text-xs font-semibold text-primary font-tamil">முந்தைய ஆவண விவரங்கள் / Previous Document</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs font-tamil">தேதி / Date</Label>
                      <Select value={prevDoc.date} onValueChange={v => setPrevDoc(d => ({ ...d, date: v }))}>
                        <SelectTrigger className="h-8 text-sm font-english"><SelectValue /></SelectTrigger>
                        <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-tamil">மாதம் / Month</Label>
                      <Select value={prevDoc.month} onValueChange={v => setPrevDoc(d => ({ ...d, month: v }))}>
                        <SelectTrigger className="h-8 text-sm font-tamil"><SelectValue /></SelectTrigger>
                        <SelectContent>{TAMIL_MONTHS.map(m => <SelectItem key={m} value={m} className="font-tamil">{m}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-tamil">வருடம் / Year</Label>
                      <Select value={prevDoc.year} onValueChange={v => setPrevDoc(d => ({ ...d, year: v }))}>
                        <SelectTrigger className="h-8 text-sm font-english"><SelectValue /></SelectTrigger>
                        <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-tamil">சார்பதிவாளர் அலுவலகம்</Label>
                    <Select value={prevDoc.subRegisterOffice} onValueChange={v => setPrevDoc(d => ({ ...d, subRegisterOffice: v }))}>
                      <SelectTrigger className="h-8 text-sm font-tamil"><SelectValue placeholder="அலுவலகம் தேர்ந்தெடுக்கவும்" /></SelectTrigger>
                      <SelectContent>
                        {locations.map(l => (
                          <SelectItem key={l.id} value={l.officeName} className="font-tamil">{l.officeName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs font-tamil">புத்தக எண்</Label>
                      <Select value={prevDoc.bookNo} onValueChange={v => setPrevDoc(d => ({ ...d, bookNo: v }))}>
                        <SelectTrigger className="h-8 text-sm font-english"><SelectValue /></SelectTrigger>
                        <SelectContent>{BOOK_NOS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-tamil">ஆவண வருடம்</Label>
                      <Select value={prevDoc.docYear} onValueChange={v => setPrevDoc(d => ({ ...d, docYear: v }))}>
                        <SelectTrigger className="h-8 text-sm font-english"><SelectValue /></SelectTrigger>
                        <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-tamil">ஆவண எண்</Label>
                      <Input value={prevDoc.docNo} onChange={e => setPrevDoc(d => ({ ...d, docNo: e.target.value }))} className="h-8 text-sm font-english" placeholder="எண்" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-tamil">ஆவண வகை</Label>
                    <Select value={prevDoc.docType} onValueChange={v => setPrevDoc(d => ({ ...d, docType: v }))}>
                      <SelectTrigger className="h-8 text-sm font-tamil"><SelectValue /></SelectTrigger>
                      <SelectContent>{DOC_TYPES.map(t => <SelectItem key={t} value={t} className="font-tamil">{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-tamil">அசல் / ஜெராக்ஸ்</Label>
                    <div className="flex gap-4 mt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={prevDoc.originalOrXerox === 'அசல்'}
                          onCheckedChange={() => setPrevDoc(d => ({ ...d, originalOrXerox: 'அசல்' }))}
                        />
                        <span className="text-sm font-tamil">அசல்</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={prevDoc.originalOrXerox === 'ஜெராக்ஸ்'}
                          onCheckedChange={() => setPrevDoc(d => ({ ...d, originalOrXerox: 'ஜெராக்ஸ்' }))}
                        />
                        <span className="text-sm font-tamil">ஜெராக்ஸ்</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Transaction Details */}
            {step === 3 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-tamil text-foreground">பரிவர்த்தனை விவரம் / Transaction Details</h3>

                <div className="border border-border rounded-lg p-3 bg-card space-y-2">
                  <div className="text-xs font-semibold text-primary font-tamil">கிரையத் தொகை விவரம்</div>

                  <div>
                    <Label className="text-xs font-tamil">கட்டண முறை / Payment Method</Label>
                    <Select value={transaction.paymentMethod} onValueChange={v => setTransaction(t => ({ ...t, paymentMethod: v }))}>
                      <SelectTrigger className="h-8 text-sm font-tamil"><SelectValue /></SelectTrigger>
                      <SelectContent>{PAYMENT_METHODS.map(m => <SelectItem key={m} value={m} className="font-tamil">{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-tamil">கிரையத் தொகை / Amount (₹)</Label>
                    <Input
                      type="number"
                      value={transaction.amount || ''}
                      onChange={e => setTransaction(t => ({ ...t, amount: Number(e.target.value) }))}
                      className="h-8 text-sm font-english"
                      placeholder="0"
                    />
                    {amtWords && (
                      <p className="text-xs text-primary font-tamil mt-1 bg-primary/5 rounded px-2 py-1">{amtWords}</p>
                    )}
                  </div>

                  {needsBankDetails && (
                    <>
                      <div className="text-xs font-semibold text-muted-foreground font-tamil mt-2">வாங்குபவர் வங்கி விவரம்</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs font-tamil">வங்கி பெயர்</Label>
                          <Input value={transaction.buyerBankName || ''} onChange={e => setTransaction(t => ({ ...t, buyerBankName: e.target.value }))} className="h-8 text-sm font-tamil" />
                        </div>
                        <div>
                          <Label className="text-xs font-tamil">கிளை</Label>
                          <Input value={transaction.buyerBankBranch || ''} onChange={e => setTransaction(t => ({ ...t, buyerBankBranch: e.target.value }))} className="h-8 text-sm font-tamil" />
                        </div>
                        <div>
                          <Label className="text-xs font-tamil">கணக்கு வகை</Label>
                          <Input value={transaction.buyerAccountType || ''} onChange={e => setTransaction(t => ({ ...t, buyerAccountType: e.target.value }))} className="h-8 text-sm font-tamil" />
                        </div>
                        <div>
                          <Label className="text-xs font-tamil">கணக்கு எண்</Label>
                          <Input value={transaction.buyerAccountNo || ''} onChange={e => setTransaction(t => ({ ...t, buyerAccountNo: e.target.value }))} className="h-8 text-sm font-english" />
                        </div>
                      </div>

                      {(transaction.paymentMethod === 'வங்கி காசோலை') && (
                        <div>
                          <Label className="text-xs font-tamil">காசோலை எண் / Cheque No</Label>
                          <Input value={transaction.chequeNo || ''} onChange={e => setTransaction(t => ({ ...t, chequeNo: e.target.value }))} className="h-8 text-sm font-english" />
                        </div>
                      )}
                      {(transaction.paymentMethod === 'வங்கி வரைவோலை') && (
                        <div>
                          <Label className="text-xs font-tamil">DD எண் / DD No</Label>
                          <Input value={transaction.ddNo || ''} onChange={e => setTransaction(t => ({ ...t, ddNo: e.target.value }))} className="h-8 text-sm font-english" />
                        </div>
                      )}

                      {['RTGS', 'IMPS', 'NEFT', 'UPI'].includes(transaction.paymentMethod) && (
                        <>
                          <div className="text-xs font-semibold text-muted-foreground font-tamil mt-2">விற்பவர் வங்கி விவரம்</div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs font-tamil">வங்கி பெயர்</Label>
                              <Input value={transaction.sellerBankName || ''} onChange={e => setTransaction(t => ({ ...t, sellerBankName: e.target.value }))} className="h-8 text-sm font-tamil" />
                            </div>
                            <div>
                              <Label className="text-xs font-tamil">கிளை</Label>
                              <Input value={transaction.sellerBankBranch || ''} onChange={e => setTransaction(t => ({ ...t, sellerBankBranch: e.target.value }))} className="h-8 text-sm font-tamil" />
                            </div>
                            <div>
                              <Label className="text-xs font-tamil">கணக்கு வகை</Label>
                              <Input value={transaction.sellerAccountType || ''} onChange={e => setTransaction(t => ({ ...t, sellerAccountType: e.target.value }))} className="h-8 text-sm font-tamil" />
                            </div>
                            <div>
                              <Label className="text-xs font-tamil">கணக்கு எண்</Label>
                              <Input value={transaction.sellerAccountNo || ''} onChange={e => setTransaction(t => ({ ...t, sellerAccountNo: e.target.value }))} className="h-8 text-sm font-english" />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs font-tamil">பரிவர்த்தனை எண் / Transaction No</Label>
                            <Input value={transaction.transactionNo || ''} onChange={e => setTransaction(t => ({ ...t, transactionNo: e.target.value }))} className="h-8 text-sm font-english" />
                          </div>
                        </>
                      )}

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs font-tamil">பரிவர்த்தனை தேதி</Label>
                          <Select value={transaction.transactionDate || ''} onValueChange={v => setTransaction(t => ({ ...t, transactionDate: v }))}>
                            <SelectTrigger className="h-8 text-sm font-english"><SelectValue placeholder="தேதி" /></SelectTrigger>
                            <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs font-tamil">மாதம்</Label>
                          <Select value={transaction.transactionMonth || ''} onValueChange={v => setTransaction(t => ({ ...t, transactionMonth: v }))}>
                            <SelectTrigger className="h-8 text-sm font-tamil"><SelectValue placeholder="மாதம்" /></SelectTrigger>
                            <SelectContent>{TAMIL_MONTHS.map(m => <SelectItem key={m} value={m} className="font-tamil">{m}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs font-tamil">வருடம்</Label>
                          <Select value={transaction.transactionYear || ''} onValueChange={v => setTransaction(t => ({ ...t, transactionYear: v }))}>
                            <SelectTrigger className="h-8 text-sm font-english"><SelectValue placeholder="வருடம்" /></SelectTrigger>
                            <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Witness Details */}
            {step === 4 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-tamil text-foreground">சாட்சிகள் விவரம் / Witness Details</h3>
                {witnesses.map((w, i) => (
                  <WitnessFormFields key={i} witness={w} onChange={updated => setWitnesses(ws => ws.map((x, idx) => idx === i ? updated : x))} index={i} />
                ))}

                <div className="border border-border rounded-lg p-3 bg-card space-y-2">
                  <div className="text-xs font-semibold text-primary font-tamil">கணினியில் தட்டச்சு செய்தவர் / Document Preparer</div>
                  <DocumentPreparerSelect value={preparer} onChange={setPreparer} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Navigation */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card no-print">
          <Button variant="outline" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="gap-1 font-tamil text-sm">
            <ChevronLeft size={16} /> முந்தைய
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={saveDraft.isPending}
            className="gap-1 font-tamil text-sm"
          >
            {saveDraft.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            வரைவாக சேமி
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} className="gap-1 font-tamil text-sm">
              அடுத்து <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSaveDraft} disabled={saveDraft.isPending} className="gap-1 font-tamil text-sm bg-accent text-accent-foreground hover:bg-accent/90">
              {saveDraft.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              SAVE AS DRAFT
            </Button>
          )}
        </div>
      </div>

      {/* Right: Preview */}
      <div className="w-1/2 flex flex-col">
        <TamilPreview content={previewText} title="கிரைய பத்திரம்" />
      </div>
    </div>
  );
}
