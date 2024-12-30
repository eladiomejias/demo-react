import React, { Component } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Typography variant="h5" align="center" color="error" gutterBottom>
            Algo salió mal.
          </Typography>
          <Typography variant="body1" align="center">
            Por favor, intenta recargar la página o contacta al soporte técnico.
          </Typography>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
