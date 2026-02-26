import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetAllParties, useAddParty, useUpdateParty, useDeleteParty } from '../hooks/useQueries';
import type { Party } from '../backend';
import { toast } from 'sonner';

const RELATIONSHIP_TYPES = ['தந்தை', 'தாய்', 'மகன்', 'மகள்', 'மனைவி', 'கணவன்', 'சகோதரன்', 'சகோதரி', 'பாட்டனார்', 'பாட்டி', 'மாமனார்', 'மாமியார்', 'மற்றவர்'];

const emptyParty: Omit<Party, 'id'> = {
  name: '', aadhaar: '', mobile: '', address: '', relationship: '',
};

export default function PartyManagement() {
  const { data: parties = [], isLoading } = useGetAllParties();
  const addParty = useAddParty();
  const updateParty = useUpdateParty();
  const deleteParty = useDeleteParty();

  const [showForm, setShowForm] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Party, 'id'>>(emptyParty);
  const [search, setSearch] = useState('');

  const filtered = parties.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.aadhaar.includes(search) ||
    p.mobile.includes(search)
  );

  const openAdd = () => {
    setEditingParty(null);
    setForm(emptyParty);
    setShowForm(true);
  };

  const openEdit = (party: Party) => {
    setEditingParty(party);
    setForm({ name: party.name, aadhaar: party.aadhaar, mobile: party.mobile, address: party.address, relationship: party.relationship });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('பெயர் தேவை'); return; }
    try {
      if (editingParty) {
        await updateParty.mutateAsync({ ...form, id: editingParty.id });
        toast.success('நபர் விவரங்கள் புதுப்பிக்கப்பட்டது');
      } else {
        await addParty.mutateAsync({ ...form, id: `party_${Date.now()}` });
        toast.success('நபர் சேர்க்கப்பட்டது');
      }
      setShowForm(false);
    } catch {
      toast.error('பிழை ஏற்பட்டது');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteParty.mutateAsync(deleteId);
      toast.success('நபர் நீக்கப்பட்டது');
      setDeleteId(null);
    } catch {
      toast.error('நீக்க முடியவில்லை');
    }
  };

  const isSaving = addParty.isPending || updateParty.isPending;

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold font-tamil text-foreground">நபர்கள் மேலாண்மை</h2>
          <p className="text-xs text-muted-foreground font-english">Party Management — {parties.length} records</p>
        </div>
        <Button onClick={openAdd} className="gap-2 font-tamil">
          <Plus size={16} />
          புதிய நபர் சேர்க்க
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="பெயர், ஆதார், மொபைல் தேடுக..."
          className="pl-9 font-tamil text-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-tamil text-xs">பெயர் / Name</TableHead>
              <TableHead className="font-english text-xs">Aadhaar</TableHead>
              <TableHead className="font-english text-xs">Mobile</TableHead>
              <TableHead className="font-tamil text-xs">உறவுமுறை</TableHead>
              <TableHead className="font-tamil text-xs">முகவரி</TableHead>
              <TableHead className="text-right font-english text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 size={20} className="animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-tamil text-sm">
                  {search ? 'தேடல் முடிவுகள் இல்லை' : 'நபர்கள் இல்லை. புதிய நபரை சேர்க்கவும்.'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(party => (
                <TableRow key={party.id} className="hover:bg-muted/30">
                  <TableCell className="font-tamil text-sm font-medium">{party.name}</TableCell>
                  <TableCell className="font-english text-xs text-muted-foreground">{party.aadhaar || '—'}</TableCell>
                  <TableCell className="font-english text-xs">{party.mobile || '—'}</TableCell>
                  <TableCell>
                    {party.relationship && (
                      <Badge variant="secondary" className="font-tamil text-xs">{party.relationship}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-tamil text-xs text-muted-foreground max-w-[200px] truncate">{party.address || '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(party)}>
                        <Pencil size={13} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(party.id)}>
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-tamil">
              {editingParty ? 'நபர் விவரங்கள் திருத்து' : 'புதிய நபர் சேர்க்க'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-tamil text-sm">பெயர் / Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="font-tamil" placeholder="முழு பெயர்" />
              </div>
              <div>
                <Label className="font-tamil text-sm">உறவுமுறை / Relationship</Label>
                <Select value={form.relationship} onValueChange={v => setForm(f => ({ ...f, relationship: v }))}>
                  <SelectTrigger className="font-tamil">
                    <SelectValue placeholder="தேர்ந்தெடுக்கவும்" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_TYPES.map(r => (
                      <SelectItem key={r} value={r} className="font-tamil">{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-tamil text-sm">ஆதார் எண் / Aadhaar</Label>
                <Input value={form.aadhaar} onChange={e => setForm(f => ({ ...f, aadhaar: e.target.value }))} className="font-english" placeholder="XXXX XXXX XXXX" maxLength={14} />
              </div>
              <div>
                <Label className="font-tamil text-sm">மொபைல் எண் / Mobile</Label>
                <Input value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} className="font-english" placeholder="9XXXXXXXXX" maxLength={10} />
              </div>
            </div>
            <div>
              <Label className="font-tamil text-sm">முகவரி / Address</Label>
              <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="font-tamil" placeholder="முழு முகவரி" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)} className="font-tamil">ரத்து</Button>
            <Button onClick={handleSave} disabled={isSaving} className="font-tamil">
              {isSaving && <Loader2 size={14} className="mr-2 animate-spin" />}
              {editingParty ? 'புதுப்பிக்க' : 'சேர்க்க'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-tamil">நபரை நீக்கவா?</AlertDialogTitle>
            <AlertDialogDescription className="font-tamil">இந்த நபரின் விவரங்கள் நிரந்தரமாக நீக்கப்படும்.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-tamil">ரத்து</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="font-tamil bg-destructive hover:bg-destructive/90">
              {deleteParty.isPending && <Loader2 size={14} className="mr-2 animate-spin" />}
              நீக்கு
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
