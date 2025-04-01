export const asQuote = (str: string) =>
  `\n${str
    .split('\n')
    .map(line => `> ${line}`)
    .join('\n')}\n`
