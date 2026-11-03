import { useState } from 'react';
import { Smile } from 'lucide-react';
import { cn } from '../../utils/format';

// Image with graceful fallback when a remote photo fails to load.
export default function Img({ src, alt, className, ...props }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div role="img" aria-label={alt} className={cn('flex items-center justify-center bg-gradient-to-br from-brand-50 to-teal-50 text-brand-200', className)}>
        <Smile className="h-1/3 w-1/3 max-h-16 max-w-16" />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={cn('object-cover', className)} {...props} />;
}
