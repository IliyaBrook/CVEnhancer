export function noBreakHyphens(text: string): string {
  return text.replace(/(\w)-(\w)/g, '$1\u2011$2');
}
