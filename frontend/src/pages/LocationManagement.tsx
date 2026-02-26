import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetAllLocations, useAddLocation, useUpdateLocation, useDeleteLocation } from '../hooks/useQueries';
import type { Location } from '../backend';
import { toast } from 'sonner';

const emptyLocation: Omit<Location, 'id'> = {
  officeName: '', district: '', taluk: '', village: '',
};

export default function LocationManagement() {
  const { data: locations = [], isLoading } = useGetAllLocations();
  const addLocation = useAddLocation();
  const updateLocation = useUpdateLocation();
  const deleteLocation = useDeleteLocation();

  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Location, 'id'>>(emptyLocation);
  const [search, setSearch] = useState('');

  const filtered = locations.filter(l =>
    l.officeName.toLowerCase().includes(search.toLowerCase()) ||
    l.district.toLowerCase().includes(search.toLowerCase()) ||
    l.taluk.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingLocation(null);
    setForm(emptyLocation);
    setShowForm(true);
  };

  const openEdit = (loc: Location) => {
    setEditingLocation(loc);
    setForm({ officeName: loc.officeName, district: loc.district, taluk: loc.taluk, village: loc.village });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.officeName.trim()) { toast.error('அலுவலக பெயர் தேவை'); return; }
    try {
      if (editingLocation) {
        await updateLocation.mutateAsync({ ...form, id: editingLocation.id });
        toast.success('இட விவரங்கள் புதுப்பிக்கப்பட்டது');
      } else {
        await addLocation.mutateAsync({ ...form, id: `loc_${Date.now()}` });
        toast.success('இடம் சேர்க்கப்பட்டது');
      }
      setShowForm(false);
    } catch {
      toast.error('பிழை ஏற்பட்டது');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteLocation.mutateAsync(deleteId);
      toast.success('இடம் நீக்கப்பட்டது');
      setDeleteId(null);
    } catch {
      toast.error('நீக்க முடியவில்லை');
    }
  };

  const isSaving = addLocation.isPending || updateLocation.isPending;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold font-tamil text-foreground">இட விவரங்கள் மேலாண்மை</h2>
          <p className="text-xs text-muted-foreground font-english">Location Management — {locations.length} records</p>
        </div>
        <Button onClick={openAdd} className="gap-2 font-tamil">
          <Plus size={16} />
          புதிய இடம் சேர்க்க
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="அலுவலகம், மாவட்டம், வட்டம் தேடுக..."
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
              <TableHead className="font-tamil text-xs">சார்பதிவாளர் அலுவலகம்</TableHead>
              <TableHead className="font-tamil text-xs">மாவட்டம் / District</TableHead>
              <TableHead className="font-tamil text-xs">வட்டம் / Taluk</TableHead>
              <TableHead className="font-tamil text-xs">கிராமம் / Village</TableHead>
              <TableHead className="text-right font-english text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 size={20} className="animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-tamil text-sm">
                  {search ? 'தேடல் முடிவுகள் இல்லை' : 'இடங்கள் இல்லை. புதிய இடத்தை சேர்க்கவும்.'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(loc => (
                <TableRow key={loc.id} className="hover:bg-muted/30">
                  <TableCell className="font-tamil text-sm font-medium">{loc.officeName}</TableCell>
                  <TableCell className="font-tamil text-sm">{loc.district || '—'}</TableCell>
                  <TableCell className="font-tamil text-sm">{loc.taluk || '—'}</TableCell>
                  <TableCell className="font-tamil text-sm text-muted-foreground">{loc.village || '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(loc)}>
                        <Pencil size={13} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(loc.id)}>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-tamil">
              {editingLocation ? 'இட விவரங்கள் திருத்து' : 'புதிய இடம் சேர்க்க'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="font-tamil text-sm">சார்பதிவாளர் அலுவலகம் *</Label>
              <Input
                value={form.officeName}
                onChange={e => setForm(f => ({ ...f, officeName: e.target.value }))}
                className="font-tamil"
                placeholder="அலுவலக பெயர்"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-tamil text-sm">மாவட்டம் / District</Label>
                <Input
                  value={form.district}
                  onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                  className="font-tamil"
                  placeholder="மாவட்டம்"
                />
              </div>
              <div>
                <Label className="font-tamil text-sm">வட்டம் / Taluk</Label>
                <Input
                  value={form.taluk}
                  onChange={e => setForm(f => ({ ...f, taluk: e.target.value }))}
                  className="font-tamil"
                  placeholder="வட்டம்"
                />
              </div>
            </div>
            <div>
              <Label className="font-tamil text-sm">கிராமம் / Village</Label>
              <Input
                value={form.village}
                onChange={e => setForm(f => ({ ...f, village: e.target.value }))}
                className="font-tamil"
                placeholder="கிராமம்"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)} className="font-tamil">ரத்து</Button>
            <Button onClick={handleSave} disabled={isSaving} className="font-tamil">
              {isSaving && <Loader2 size={14} className="mr-2 animate-spin" />}
              {editingLocation ? 'புதுப்பிக்க' : 'சேர்க்க'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-tamil">இடத்தை நீக்கவா?</AlertDialogTitle>
            <AlertDialogDescription className="font-tamil">இந்த இட விவரங்கள் நிரந்தரமாக நீக்கப்படும்.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-tamil">ரத்து</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="font-tamil bg-destructive hover:bg-destructive/90">
              {deleteLocation.isPending && <Loader2 size={14} className="mr-2 animate-spin" />}
              நீக்கு
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
