// Convert numbers to Tamil words
const ones = ['', 'ஒன்று', 'இரண்டு', 'மூன்று', 'நான்கு', 'ஐந்து', 'ஆறு', 'ஏழு', 'எட்டு', 'ஒன்பது',
  'பத்து', 'பதினொன்று', 'பன்னிரண்டு', 'பதிமூன்று', 'பதினான்கு', 'பதினைந்து',
  'பதினாறு', 'பதினேழு', 'பதினெட்டு', 'பத்தொன்பது'];

const tens = ['', 'பத்து', 'இருபது', 'முப்பது', 'நாற்பது', 'ஐம்பது',
  'அறுபது', 'எழுபது', 'எண்பது', 'தொண்ணூறு'];

function convertHundreds(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ones[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return tens[t] + (o > 0 ? ' ' + ones[o] : '');
  }
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const hundredWord = h === 1 ? 'நூறு' : ones[h] + ' நூறு';
  return hundredWord + (rest > 0 ? ' ' + convertHundreds(rest) : '');
}

export function numberToTamilWords(num: number): string {
  if (num === 0) return 'பூஜ்யம்';
  if (isNaN(num) || num < 0) return '';

  let result = '';
  let n = Math.floor(num);

  if (n >= 10000000) {
    const crores = Math.floor(n / 10000000);
    result += convertHundreds(crores) + ' கோடி ';
    n = n % 10000000;
  }

  if (n >= 100000) {
    const lakhs = Math.floor(n / 100000);
    result += convertHundreds(lakhs) + ' லட்சம் ';
    n = n % 100000;
  }

  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);
    result += convertHundreds(thousands) + ' ஆயிரம் ';
    n = n % 1000;
  }

  if (n > 0) {
    result += convertHundreds(n);
  }

  return result.trim() + ' ரூபாய்';
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString('en-IN');
}
