import { useState } from 'react';
import { Loader2, Trash2, FileText, FileSignature, Eye } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetAllDrafts, useDeleteDraft } from '../hooks/useQueries';
import type { DeedDraft } from '../backend';
import { toast } from 'sonner';

function formatDate(ts: bigint): string {
  const ms = Number(ts);
  if (!ms) return '—';
  return new Date(ms).toLocaleDateString('ta-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getDeedTypeLabel(deedType: DeedDraft['deedType']): string {
  const key = typeof deedType === 'string' ? deedType : JSON.stringify(deedType);
  if (key.includes('Sale') || key === 'SaleDeed') return 'கிரைய பத்திரம்';
  if (key.includes('Agreement') || key === 'AgreementDeed') return 'கிரைய உடன்படிக்கை';
  return 'ஆவணம்';
}

function isSaleDeed(deedType: DeedDraft['deedType']): boolean {
  const key = typeof deedType === 'string' ? deedType : JSON.stringify(deedType);
  return key.includes('Sale') || key === 'SaleDeed';
}

export default function Drafts() {
  const { data: drafts = [], isLoading } = useGetAllDrafts();
  const deleteDraft = useDeleteDraft();
  const navigate = useNavigate();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewDraft, setPreviewDraft] = useState<DeedDraft | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDraft.mutateAsync(deleteId);
      toast.success('வரைவு நீக்கப்பட்டது');
      setDeleteId(null);
    } catch {
      toast.error('நீக்க முடியவில்லை');
    }
  };

  const handleResume = (draft: DeedDraft) => {
    const path = isSaleDeed(draft.deedType) ? '/sale-deed' : '/agreement-deed';
    navigate({ to: path });
    toast.info('வரைவு திறக்கப்படுகிறது... தரவை படிவத்தில் நிரப்பவும்.');
  };

  const sortedDrafts = [...drafts].sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold font-tamil text-foreground">வரைவுகள்</h2>
        <p className="text-xs text-muted-foreground font-english">Saved Drafts — {drafts.length} drafts</p>
      </div>

      <div className="border border-border rounded-lg overflow-hidden bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-tamil text-xs">ஆவண வகை / Type</TableHead>
              <TableHead className="font-tamil text-xs">உருவாக்கிய தேதி / Created</TableHead>
              <TableHead className="font-tamil text-xs">புதுப்பிக்கப்பட்ட தேதி / Updated</TableHead>
              <TableHead className="font-tamil text-xs">ID</TableHead>
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
            ) : sortedDrafts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-tamil text-sm">
                  வரைவுகள் இல்லை. புதிய ஆவணம் உருவாக்கி சேமிக்கவும்.
                </TableCell>
              </TableRow>
            ) : (
              sortedDrafts.map(draft => (
                <TableRow key={draft.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isSaleDeed(draft.deedType)
                        ? <FileText size={14} className="text-amber-600" />
                        : <FileSignature size={14} className="text-purple-600" />
                      }
                      <Badge variant="secondary" className="font-tamil text-xs">
                        {getDeedTypeLabel(draft.deedType)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-tamil text-xs">{formatDate(draft.createdAt)}</TableCell>
                  <TableCell className="font-tamil text-xs">{formatDate(draft.updatedAt)}</TableCell>
                  <TableCell className="font-english text-xs text-muted-foreground truncate max-w-[120px]">{draft.id}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPreviewDraft(draft)} title="முன்னோட்டம்">
                        <Eye size={13} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs font-tamil" onClick={() => handleResume(draft)}>
                        தொடர்
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(draft.id)}>
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

      {/* Preview Dialog */}
      <Dialog open={!!previewDraft} onOpenChange={() => setPreviewDraft(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="font-tamil">
              {previewDraft ? getDeedTypeLabel(previewDraft.deedType) : ''} — வரைவு முன்னோட்டம்
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <pre className="text-xs font-tamil whitespace-pre-wrap p-4 bg-muted/30 rounded">
              {previewDraft ? (() => {
                try {
                  const data = JSON.parse(previewDraft.formData);
                  return JSON.stringify(data, null, 2);
                } catch {
                  return previewDraft.formData;
                }
              })() : ''}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-tamil">வரைவை நீக்கவா?</AlertDialogTitle>
            <AlertDialogDescription className="font-tamil">இந்த வரைவு நிரந்தரமாக நீக்கப்படும்.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-tamil">ரத்து</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="font-tamil bg-destructive hover:bg-destructive/90">
              {deleteDraft.isPending && <Loader2 size={14} className="mr-2 animate-spin" />}
              நீக்கு
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
