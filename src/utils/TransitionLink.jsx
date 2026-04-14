import { sleep } from "@/lib/reusable";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const TransitionLink = ({ children, href, ...props }) => {
  const navigate = useNavigate();

  const handleTransition = async (e) => {
    e.preventDefault();
    const transitionContainer = document.querySelector("#transition-container");
    transitionContainer?.classList.add("page-transition");
    await sleep(150);
    navigate(href);
    await sleep(250);
    transitionContainer?.classList.remove("page-transition");
  };
  return (
    <Link onClick={handleTransition} to={href} {...props}>
      {children}
    </Link>
  );
};

TransitionLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default TransitionLink;
