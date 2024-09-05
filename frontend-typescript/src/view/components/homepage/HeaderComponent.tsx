function HeaderComponent() {
  return (
    <div className="header-component">
          <p className="welcome">welcome to</p>
          <h1 className="mt-2 mb-0">
            <span className="title happy">
              Happy <span className="circle happy"></span>
            </span>
            <span className="title activities">
              ACTIVITIES <span className="circle activities"></span>
            </span>
          </h1>
          <p className="subtitle">
            your trusted tasks <span className="d-block">management application</span>
          </p>
          <div className="subtitle-line"></div>
    </div>
  );
}
export default HeaderComponent;
