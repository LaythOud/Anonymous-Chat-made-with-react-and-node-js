import React from 'react'

export default class ErrorBoundary extends React.Component {
  state = {
    error: '',
    errorInfo: '',
    hasError: false,
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.log({ error, errorInfo })
    this.setState({ errorInfo })
  }
  
    render() {
      if (this.state.hasError) {
        // Error path
        return (
          <div className="error">
            <button onClick={() => {window.location.reload()}} className="chat-exit fadeIn first">X</button>
            <div className="wrapper fadeInDown">
              <div id="formContent">
                <h2 className="active">Something went wrong.</h2>
              </div>
            </div>
          </div>
        );
      }
      // Normally, just render children
      return this.props.children;
    }  
  }