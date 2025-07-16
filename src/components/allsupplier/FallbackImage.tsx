import Image, { ImageProps } from "next/image";

export default function FallbackImage(props: ImageProps) {
  return (
    <Image
      {...props}
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
      style={props.style}
      onError={props.onError}
    />
  );
} 