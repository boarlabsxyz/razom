export default function concatClassNames(
  ...names: (string | undefined | null)[]
): string {
  return names.filter(Boolean).join(' ');
}
