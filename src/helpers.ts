export const asQuote = (str: string) => {
  console.log(str);
  return str.split('\n').map((line) => `> ${line}`).join('\n')
}