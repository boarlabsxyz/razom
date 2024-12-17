import st from '../Header.module.css';
import NavMain from '../Navigation/NavMain';

type HeaderContentProps = {
  children: React.ReactNode;
};

function HeaderContent({ children }: HeaderContentProps) {
  return (
    <div className={st.content}>
      {children}
      <NavMain />
    </div>
  );
}

export default HeaderContent;
