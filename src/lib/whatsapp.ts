// AD Pictures booking number: 0908 030 809 (Ethiopia, +251) in wa.me format.
const WA_NUM = "251908030809";
const WA_DEFAULT = "Hi AD Pictures, I would like to book a shoot. My event is";

export function waLink(message?: string): string {
  const text = message && message.trim() ? message : WA_DEFAULT;
  return `https://wa.me/${WA_NUM}?text=${encodeURIComponent(text)}`;
}
