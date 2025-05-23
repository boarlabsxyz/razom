import Link from 'next/link';

import st from '@comComps/header/Header.module.css';
import CustomImage from '@comComps/customImage';

type RazomProps = {
  name: 'logotype';
  height: 34;
};

type BannerProps = RazomProps;

function Banner({ name, height }: BannerProps) {
  const shouldPrefetch = false;

  return (
    <div className={st['banner-container']}>
      <Link
        href="/"
        className={st['banner-link']}
        {...(shouldPrefetch ? { prefetch: false } : {})}
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
