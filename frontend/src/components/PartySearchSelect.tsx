import { useState, useRef, useEffect } from 'react';
import { Search, Plus, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Party } from '../backend';

interface PartySearchSelectProps {
  parties: Party[];
  selectedParties: Party[];
  onAdd: (party: Party) => void;
  onRemove: (id: string) => void;
  label: string;
}

export default function PartySearchSelect({ parties, selectedParties, onAdd, onRemove, label }: PartySearchSelectProps) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? parties.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.aadhaar.includes(query) ||
        p.mobile.includes(query)
      )
    : parties;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSelected = (id: string) => selectedParties.some(p => p.id === id);

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            placeholder={`${label} தேடுக... (பெயர், ஆதார், மொபைல்)`}
            className="pl-9 text-sm font-tamil"
          />
        </div>
        {showDropdown && filtered.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filtered.map(party => (
              <div
                key={party.id}
                className="flex items-center justify-between px-3 py-2 hover:bg-muted cursor-pointer"
                onClick={() => {
                  if (!isSelected(party.id)) {
                    onAdd(party);
                  }
                  setQuery('');
                  setShowDropdown(false);
                }}
              >
                <div>
                  <div className="text-sm font-medium font-tamil">{party.name}</div>
                  <div className="text-xs text-muted-foreground font-english">
                    {party.aadhaar} | {party.mobile}
                  </div>
                </div>
                {isSelected(party.id) && <Check size={14} className="text-primary" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected parties */}
      {selectedParties.length > 0 && (
        <div className="space-y-1">
          {selectedParties.map((party, idx) => (
            <div key={party.id} className="flex items-center gap-2 bg-secondary/50 rounded-md px-3 py-1.5">
              <span className="text-xs font-medium text-muted-foreground w-5">({idx + 1})</span>
              <span className="text-sm font-tamil flex-1">{party.name}</span>
              <span className="text-xs text-muted-foreground font-english">{party.mobile}</span>
              <button onClick={() => onRemove(party.id)} className="text-muted-foreground hover:text-destructive">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
