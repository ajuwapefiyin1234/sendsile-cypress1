import PageLoader from "@/components/loaders/PageLoader";
import { ROUTE } from "@/routes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(ROUTE.login);
  }, [navigate]);

  return <PageLoader />;
};

export default Homepage;
