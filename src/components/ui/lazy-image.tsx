import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { twMerge } from 'tailwind-merge';

const LazyImage = ({ src, alt, className }: { src: any; alt: string; className: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className={twMerge(className)}>
      {!imageLoaded && <Skeleton className={className} />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={handleImageLoad}
        className={twMerge(
          `transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`,
          className
        )}
      />
    </div>
  );
};

export default LazyImage;
