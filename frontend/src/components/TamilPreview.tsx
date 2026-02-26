import { useRef } from 'react';
import { Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TamilPreviewProps {
  content: string;
  title?: string;
}

export default function TamilPreview({ content, title = 'கிரைய பத்திரம்' }: TamilPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ta">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Mukta+Malar:wght@400;700&display=swap" rel="stylesheet">
        <style>
          @page { margin: 2cm; size: A4; }
          body { font-family: 'Mukta Malar', serif; font-size: 14pt; line-height: 1.8; color: #000; }
          .doc-title { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 16px; }
          .doc-body { text-align: justify; white-space: pre-wrap; }
          strong, b { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="doc-title">${title}</div>
        <div class="doc-body">${formatContentForPrint(content)}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  const handleDownload = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="ta">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Mukta+Malar:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @page { margin: 2cm; size: A4; }
    body { font-family: 'Mukta Malar', serif; font-size: 14pt; line-height: 1.8; color: #000; margin: 2cm; }
    .doc-title { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 16px; }
    .doc-body { text-align: justify; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="doc-title">${title}</div>
  <div class="doc-body">${formatContentForPrint(content)}</div>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}_${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border no-print">
        <span className="text-xs font-medium text-muted-foreground font-tamil">நேரடி முன்னோட்டம் / Live Preview</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="h-7 text-xs gap-1">
            <Printer size={12} />
            <span className="hidden sm:inline">அச்சிடு</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="h-7 text-xs gap-1">
            <Download size={12} />
            <span className="hidden sm:inline">பதிவிறக்கு</span>
          </Button>
        </div>
      </div>

      {/* Preview content */}
      <ScrollArea className="flex-1">
        <div ref={previewRef} className="p-6 bg-white min-h-full">
          <div className="max-w-2xl mx-auto">
            <div className="text-center font-bold text-base mb-4 font-tamil" style={{ fontSize: '14px' }}>
              {title}
            </div>
            <div
              className="font-tamil text-justify leading-relaxed whitespace-pre-wrap"
              style={{ fontSize: '14px', lineHeight: '1.9', fontFamily: "'Mukta Malar', serif" }}
              dangerouslySetInnerHTML={{ __html: formatContentForDisplay(content) }}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function formatContentForDisplay(text: string): string {
  if (!text) return '<span style="color:#999;font-style:italic">விவரங்களை உள்ளீடு செய்யும்போது முன்னோட்டம் தோன்றும்...</span>';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

function formatContentForPrint(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}
