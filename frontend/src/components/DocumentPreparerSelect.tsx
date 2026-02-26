import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useGetAllPreparers, useAddPreparer } from '../hooks/useQueries';
import type { DocumentPreparer } from '../backend';
import { toast } from 'sonner';

interface DocumentPreparerSelectProps {
  value: { name: string; office: string; mobile: string };
  onChange: (val: { name: string; office: string; mobile: string }) => void;
}

export default function DocumentPreparerSelect({ value, onChange }: DocumentPreparerSelectProps) {
  const { data: preparers = [] } = useGetAllPreparers();
  const addPreparer = useAddPreparer();
  const [showAdd, setShowAdd] = useState(false);
  const [newPreparer, setNewPreparer] = useState({ name: '', office: '', mobile: '' });

  const handleSelect = (id: string) => {
    const p = preparers.find(x => x.id === id);
    if (p) onChange({ name: p.name, office: p.office, mobile: p.mobile });
  };

  const handleAdd = async () => {
    if (!newPreparer.name.trim()) return;
    const id = `prep_${Date.now()}`;
    await addPreparer.mutateAsync({ id, ...newPreparer });
    onChange({ name: newPreparer.name, office: newPreparer.office, mobile: newPreparer.mobile });
    setNewPreparer({ name: '', office: '', mobile: '' });
    setShowAdd(false);
    toast.success('ஆவணம் தயாரிப்பவர் சேர்க்கப்பட்டது');
  };

  const selectedId = preparers.find(p => p.name === value.name)?.id;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select value={selectedId || ''} onValueChange={handleSelect}>
          <SelectTrigger className="flex-1 font-tamil text-sm">
            <SelectValue placeholder="ஆவணம் தயாரிப்பவரை தேர்ந்தெடுக்கவும்" />
          </SelectTrigger>
          <SelectContent>
            {preparers.map(p => (
              <SelectItem key={p.id} value={p.id} className="font-tamil">
                {p.name} — {p.office}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={() => setShowAdd(true)} title="புதியது சேர்க்க">
          <Plus size={16} />
        </Button>
      </div>

      {value.name && (
        <div className="text-xs text-muted-foreground font-tamil bg-muted/50 rounded px-2 py-1">
          {value.name} | {value.office} | {value.mobile}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-tamil">புதிய ஆவணம் தயாரிப்பவர் சேர்க்க</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="font-tamil text-sm">பெயர் / Name</Label>
              <Input value={newPreparer.name} onChange={e => setNewPreparer(p => ({ ...p, name: e.target.value }))} className="font-tamil" />
            </div>
            <div>
              <Label className="font-tamil text-sm">அலுவலகம் / Office</Label>
              <Input value={newPreparer.office} onChange={e => setNewPreparer(p => ({ ...p, office: e.target.value }))} className="font-tamil" />
            </div>
            <div>
              <Label className="font-tamil text-sm">மொபைல் எண் / Mobile</Label>
              <Input value={newPreparer.mobile} onChange={e => setNewPreparer(p => ({ ...p, mobile: e.target.value }))} className="font-english" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>ரத்து</Button>
            <Button onClick={handleAdd} disabled={addPreparer.isPending}>
              {addPreparer.isPending && <Loader2 size={14} className="mr-2 animate-spin" />}
              சேர்க்க
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
