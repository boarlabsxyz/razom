import Link from 'next/link';

import CustomImage from '../../customImage';
import st from '../Header.module.css';

type RazomProps = {
  name: 'logotype';
  height: 34;
};

type BannerProps = RazomProps;

function Banner({ name, height }: BannerProps) {
  return (
    <div className={st.bannerContainer}>
      <Link
        href="/"
        className={st.bannerLink}
        {...(false ? { prefetch: false } : {})}
      >
        <CustomImage
          src={`/img/logo/${name}.svg`}
          alt={name}
          width={146}
          height={height}
          priority
        />
      </Link>
    </div>
  );
}

export default Banner;
