import { Suspense } from "react";
import PageLoader from "./loaders/PageLoader";

const withSuspense = (Component) => {
  const WrappedComponent = (props) => (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  );

  WrappedComponent.displayName = `WithSuspense(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
};

export default withSuspense;
