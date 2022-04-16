export function truncateMiddle(str: string, start: number, end = start): string {
  if (!start || !end || start <= 0 || end <= 0) throw new Error('start or end is invalid');
  if (str.length <= start + end) return str;
  return str.slice(0, start) + '...' + str.slice(-end);
}

export const formatAddress = (address: string): string => {
  return `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;
};
