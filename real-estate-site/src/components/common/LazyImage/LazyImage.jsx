import React from 'react';

/**
 * LazyImage Component
 * Lazy loading wrapper for images with placeholder
 */
const LazyImage = ({ src, alt, className, placeholder = '/placeholder.jpg' }) => {
    const [imageSrc, setImageSrc] = React.useState(placeholder);
    const [imageRef, setImageRef] = React.useState();

    React.useEffect(() => {
        let observer;

        if (imageRef && 'IntersectionObserver' in window) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setImageSrc(src);
                            observer.unobserve(imageRef);
                        }
                    });
                },
                { rootMargin: '50px' }
            );

            observer.observe(imageRef);
        } else {
            // Fallback for browsers without IntersectionObserver
            setImageSrc(src);
        }

        return () => {
            if (observer && observer.unobserve && imageRef) {
                observer.unobserve(imageRef);
            }
        };
    }, [src, imageRef]);

    return (
        <img
            ref={setImageRef}
            src={imageSrc}
            alt={alt}
            className={className}
            loading="lazy"
        />
    );
};

export default LazyImage;
