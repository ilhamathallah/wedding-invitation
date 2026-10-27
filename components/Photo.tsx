// Shows the photo, or a soft placeholder until you add one in lib/config.ts.
export default function Photo({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  }
  return <div role="img" aria-label={alt} className={`h-full w-full bg-gradient-to-br from-mist via-paper to-sage/30 ${className}`} />;
}
