import { useEffect } from "react";
import TimelineComponent from "../components/homepage/TimelineComponent";
import HeaderComponent from "../components/homepage/HeaderComponent";
import ShowTypesComponent from "../components/homepage/ShowTypesComponent";

function HomePage() {
  useEffect(() => {
    document.title = "Happy Activities";
  }, []);

  return (
    <>
      <HeaderComponent />
      <TimelineComponent />
      <ShowTypesComponent />
    </>
  );
}

export default HomePage;
