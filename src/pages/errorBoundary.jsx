import { Component } from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error or send it to a monitoring service instead of setting state
    // eslint-disable-next-line
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;

    if (hasError) {
      if (
        error
          ?.toString()
          .includes('Failed to fetch dynamically imported module: ')
      ) {
        window.location.reload();
      }

      return (
        <div className="text-center items-center justify-center flex-col gap-4 py-32 max-w-2xl mx-auto">
          <h1 className="text-4xl font-medium">Oops! Something went wrong.</h1>
          <p>
            We&apos;re sorry, but something went wrong. Please try refreshing
            the page, or contact support if the problem persists.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
