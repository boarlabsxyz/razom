import Image, { ImageProps } from 'next/image';
import getImageQuality from '../../../helpers/getImageQuality';

interface CustomImageProps extends Omit<ImageProps, 'quality'> {
  alt: string;
}

const CustomImage = (props: CustomImageProps): JSX.Element => {
  const { src, alt, ...rest } = props;

  if (typeof src !== 'string') {
    throw new Error('CustomImage: src must be a string');
  }

  let quality: number;
  try {
    quality = getImageQuality(src);
  } catch {
    quality = 75;
  }

  return <Image src={src} alt={alt} quality={quality} {...rest} />;
};

export default CustomImage;
