import CustomImage from '@comComps/customImage';
import st from './Hero.module.css';

export default function Hero() {
  return (
    <section className={st.container} aria-label="Hero section">
      <div className={`${st.textWrapper} ${st.mainTextWrapper}`}>
        <h2 className={st.mainText}>
          <span>ПЛАТФОРМА</span> <br className={st.br} />
          <span> ІЗ</span>
          <span className={st.greenText}> ПОШУКУ ІНІЦІАТИВ</span>
          <span> ВЕТЕРАНАМ</span>
        </h2>
      </div>
      <div className={`${st.textWrapper} ${st.secondaryTextWrapper}`}>
        <h4 className={st.secondaryText}>
          Обʼєднуємо ініціативи та їхніх авторів для тих, хто цього потребує.
        </h4>
      </div>
      <button
        className="button button--primary"
        aria-label="Зв'язатися з нами"
        type="button"
      >
        <div className={st.buttonContent}>
          <p>Зв’язатися з нами</p>
          <CustomImage
            src={`/icons/arrowRight.svg`}
            alt="Right arrow icon"
            width={15}
            height={18}
            priority
          />
        </div>
      </button>
    </section>
  );
}
