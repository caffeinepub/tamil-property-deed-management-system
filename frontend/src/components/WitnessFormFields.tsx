import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { WitnessInfo } from '../utils/tamilTextGenerator';

const RELATIONSHIP_TYPES = ['தந்தை', 'தாய்', 'மகன்', 'மகள்', 'மனைவி', 'கணவன்', 'சகோதரன்', 'சகோதரி'];

interface WitnessFormFieldsProps {
  witness: WitnessInfo;
  onChange: (updated: WitnessInfo) => void;
  index: number;
}

export default function WitnessFormFields({ witness, onChange, index }: WitnessFormFieldsProps) {
  const update = (field: keyof WitnessInfo, val: string) => onChange({ ...witness, [field]: val });

  return (
    <div className="border border-border rounded-lg p-3 space-y-2 bg-card">
      <div className="text-xs font-semibold text-primary font-tamil">சாட்சி {index + 1} / Witness {index + 1}</div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs font-tamil">பெயர் / Name</Label>
          <Input value={witness.name} onChange={e => update('name', e.target.value)} className="h-8 text-sm font-tamil" />
        </div>
        <div>
          <Label className="text-xs font-tamil">வயது / Age</Label>
          <Input value={witness.age} onChange={e => update('age', e.target.value)} className="h-8 text-sm font-english" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs font-tamil">உறவுமுறை / Relationship</Label>
          <Select value={witness.relationshipType} onValueChange={v => update('relationshipType', v)}>
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
          <Input value={witness.relationsName} onChange={e => update('relationsName', e.target.value)} className="h-8 text-sm font-tamil" />
        </div>
      </div>

      <div>
        <Label className="text-xs font-tamil">ஆதார் எண் / Aadhaar</Label>
        <Input value={witness.aadhaar} onChange={e => update('aadhaar', e.target.value)} className="h-8 text-sm font-english" maxLength={14} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs font-tamil">கதவு எண் / Door No</Label>
          <Input value={witness.doorNo} onChange={e => update('doorNo', e.target.value)} className="h-8 text-sm font-english" />
        </div>
        <div>
          <Label className="text-xs font-tamil">முகவரி வரி 1</Label>
          <Input value={witness.addressLine1} onChange={e => update('addressLine1', e.target.value)} className="h-8 text-sm font-tamil" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs font-tamil">முகவரி வரி 2</Label>
          <Input value={witness.addressLine2} onChange={e => update('addressLine2', e.target.value)} className="h-8 text-sm font-tamil" />
        </div>
        <div>
          <Label className="text-xs font-tamil">முகவரி வரி 3</Label>
          <Input value={witness.addressLine3} onChange={e => update('addressLine3', e.target.value)} className="h-8 text-sm font-tamil" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs font-tamil">வட்டம் / Taluk</Label>
          <Input value={witness.taluk} onChange={e => update('taluk', e.target.value)} className="h-8 text-sm font-tamil" />
        </div>
        <div>
          <Label className="text-xs font-tamil">மாவட்டம் / District</Label>
          <Input value={witness.district} onChange={e => update('district', e.target.value)} className="h-8 text-sm font-tamil" />
        </div>
        <div>
          <Label className="text-xs font-tamil">பின்கோடு / Pincode</Label>
          <Input value={witness.pincode} onChange={e => update('pincode', e.target.value)} className="h-8 text-sm font-english" maxLength={6} />
        </div>
      </div>
    </div>
  );
}
