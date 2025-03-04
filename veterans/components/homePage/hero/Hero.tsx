import st from './Hero.module.css';

export default function Hero() {
  return (
    <section className={st.container}>
      <div className={`${st.textWrapper} ${st.mainTextWrapper}`}>
        <h3 className={st.mainText}>
          <span>ПЛАТФОРМА ІЗ</span>{' '}
          <span className={st.greenText}>ПОШУКУ ІНІЦІАТИВ</span>{' '}
          <span>ВЕТЕРАНАМ</span>
        </h3>
      </div>
      <div className={`${st.textWrapper} ${st.secondTextWrapper}`}>
        <h4>
          Обʼєднуємо ініціативи та їхніх авторів для тих, хто цього потребує.
        </h4>
      </div>
      <button>
        <p>Зв’язатися з нами</p>
      </button>
    </section>
  );
}
