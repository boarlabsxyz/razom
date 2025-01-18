import st from '@comComps/header/Header.module.css';
import Navigation from '@comComps/header/Navigation';

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
