import st from '../Header.module.css';
import Navigation from '../Navigation/Navigation';

type HeaderContentProps = {
  children: React.ReactNode;
};

function HeaderContent({ children }: HeaderContentProps) {
  return (
    <div className={st.content}>
      {children}
      <Navigation />
    </div>
  );
}

export default HeaderContent;
