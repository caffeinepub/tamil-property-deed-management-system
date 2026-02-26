import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PartyInfo } from '../utils/tamilTextGenerator';

const RELATIONSHIP_TYPES = ['தந்தை', 'தாய்', 'மகன்', 'மகள்', 'மனைவி', 'கணவன்', 'சகோதரன்', 'சகோதரி', 'பாட்டனார்', 'பாட்டி', 'மாமனார்', 'மாமியார்'];

interface PartyFormFieldsProps {
  party: PartyInfo;
  onChange: (updated: PartyInfo) => void;
  index: number;
  label: string;
}

export default function PartyFormFields({ party, onChange, index, label }: PartyFormFieldsProps) {
  const update = (field: keyof PartyInfo, val: string) => onChange({ ...party, [field]: val });

  return (
    <div className="border border-border rounded-lg p-3 space-y-2 bg-card">
      <div className="text-xs font-semibold text-primary font-tamil">{label} ({index + 1})</div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs font-tamil">பெயர் / Name *</Label>
          <Input value={party.name} onChange={e => update('name', e.target.value)} className="h-8 text-sm font-tamil" placeholder="பெயர்" />
        </div>
        <div>
          <Label className="text-xs font-tamil">வயது / Age</Label>
          <Input value={party.age} onChange={e => update('age', e.target.value)} className="h-8 text-sm font-english" placeholder="வயது" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs font-tamil">உறவுமுறை வகை / Relationship</Label>
          <Select value={party.relationshipType} onValueChange={v => update('relationshipType', v)}>
            <SelectTrigger className="h-8 text-sm font-tamil">
              <SelectValue placeholder="தேர்ந்தெடுக்கவும்" />
            </SelectTrigger>
            <SelectContent>
              {RELATIONSHIP_TYPES.map(r => (
                <SelectItem key={r} value={r} className="font-tamil">{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-tamil">உறவினர் பெயர் / Relation Name</Label>
          <Input value={party.relationsName} onChange={e => update('relationsName', e.target.value)} className="h-8 text-sm font-tamil" placeholder="உறவினர் பெயர்" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs font-tamil">ஆதார் எண் / Aadhaar</Label>
          <Input value={party.aadhaar} onChange={e => update('aadhaar', e.target.value)} className="h-8 text-sm font-english" placeholder="XXXX XXXX XXXX" maxLength={14} />
        </div>
        <div>
          <Label className="text-xs font-tamil">PAN கார்டு / PAN Card</Label>
          <Input value={party.panCard || ''} onChange={e => update('panCard', e.target.value)} className="h-8 text-sm font-english" placeholder="ABCDE1234F" maxLength={10} />
        </div>
      </div>

      <div>
        <Label className="text-xs font-tamil">மொபைல் எண் / Mobile</Label>
        <Input value={party.mobile} onChange={e => update('mobile', e.target.value)} className="h-8 text-sm font-english" placeholder="9XXXXXXXXX" maxLength={10} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs font-tamil">கதவு எண் / Door No</Label>
          <Input value={party.doorNo} onChange={e => update('doorNo', e.target.value)} className="h-8 text-sm font-english" />
        </div>
        <div>
          <Label className="text-xs font-tamil">முகவரி வரி 1 / Address Line 1</Label>
          <Input value={party.addressLine1} onChange={e => update('addressLine1', e.target.value)} className="h-8 text-sm font-tamil" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs font-tamil">முகவரி வரி 2 / Address Line 2</Label>
          <Input value={party.addressLine2} onChange={e => update('addressLine2', e.target.value)} className="h-8 text-sm font-tamil" />
        </div>
        <div>
          <Label className="text-xs font-tamil">முகவரி வரி 3 / Address Line 3</Label>
          <Input value={party.addressLine3} onChange={e => update('addressLine3', e.target.value)} className="h-8 text-sm font-tamil" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs font-tamil">வட்டம் / Taluk</Label>
          <Input value={party.taluk} onChange={e => update('taluk', e.target.value)} className="h-8 text-sm font-tamil" />
        </div>
        <div>
          <Label className="text-xs font-tamil">மாவட்டம் / District</Label>
          <Input value={party.district} onChange={e => update('district', e.target.value)} className="h-8 text-sm font-tamil" />
        </div>
        <div>
          <Label className="text-xs font-tamil">பின்கோடு / Pincode</Label>
          <Input value={party.pincode} onChange={e => update('pincode', e.target.value)} className="h-8 text-sm font-english" maxLength={6} />
        </div>
      </div>
    </div>
  );
}
