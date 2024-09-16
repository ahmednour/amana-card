export default function ImageLoader({ src, width, quality }) {
  if (!src) {
    return '';
  }
  
  const params = new URLSearchParams({
    w: width,
    q: quality || 75,
  });

  return `${src}?${params.toString()}`;
}
