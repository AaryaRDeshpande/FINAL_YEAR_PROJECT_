const replacements = [
  [/hereinafter/gi, 'from now on'],
  [/aforementioned/gi, 'mentioned earlier'],
  [/pursuant to/gi, 'under'],
  [/in the event that/gi, 'if'],
  [/notwithstanding/gi, 'despite'],
  [/commence/gi, 'start'],
  [/terminate/gi, 'end'],
  [/endeavor/gi, 'try'],
  [/shall/gi, 'will'],
  [/party of the first part/gi, 'first party'],
  [/party of the second part/gi, 'second party'],
  [/indemnify/gi, 'protect from claims'],
  [/warrant/gi, 'promise'],
  [/obligation/gi, 'duty'],
  [/liability/gi, 'responsibility'],
  [/utilize/gi, 'use']
];

export function simplifyText(originalText) {
  let text = originalText;
  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }
  return text;
}
