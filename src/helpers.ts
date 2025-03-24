export const asQuote = (str: string) => {
  return str.split('\n').map((line) => `> ${line}`).join('\n') + '\n'
}