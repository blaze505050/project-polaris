import React, { forwardRef, type ImgHTMLAttributes, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop";

export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fittingType?: string;
  originWidth?: number;
  originHeight?: number;
  focalPointX?: number;
  focalPointY?: number;
};

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, className, fittingType, originWidth, originHeight, focalPointX, focalPointY, alt = '', ...props }, ref) => {
    const [imgSrc, setImgSrc] = useState<string | undefined>(src);

    useEffect(() => {
      setImgSrc(src);
    }, [src]);

    if (!src) {
      return <div data-empty-image ref={ref as any} className={cn("bg-slate-800", className)} {...props} />;
    }

    return (
      <img
        ref={ref}
        src={imgSrc || FALLBACK_IMAGE_URL}
        alt={alt}
        className={cn(fittingType === 'fit' ? 'object-contain' : 'object-cover', className)}
        onError={() => setImgSrc(FALLBACK_IMAGE_URL)}
        {...props}
      />
    );
  }
);
Image.displayName = 'Image';
