import React, { useState, useEffect } from 'react';

function CodePreview({ code }) {
  const [error, setError] = useState(null);
  const [Preview, setPreview] = useState(null);

  useEffect(() => {
    const createComponent = () => {
      try {
        // Clean and prepare the code
        const cleanedCode = code
          .replace(/React\./g, '')
          .replace(/function\s+([A-Z][A-Za-z0-9]*)\s*\(/g, 'const $1 = (')
          .replace(/useState\(/g, 'React.useState(')
          .replace(/useEffect\(/g, 'React.useEffect(')
          .replace(/useRef\(/g, 'React.useRef(')
          .replace(/useMemo\(/g, 'React.useMemo(')
          .replace(/useCallback\(/g, 'React.useCallback(');

        const componentName = code.match(/function\s+([A-Z][A-Za-z0-9]*)/)?.[1] || 'App';

        // Create the component
        const componentCode = `
          ${cleanedCode}
          return ${componentName};
        `;

        // eslint-disable-next-line no-new-func
        const Component = new Function(
          'React',
          'useState',
          'useEffect',
          'useRef',
          'useMemo',
          'useCallback',
          `
          try {
            const { useState, useEffect, useRef, useMemo, useCallback } = React;
            ${componentCode}
          } catch (err) {
            console.error('Component creation error:', err);
            return () => null;
          }
          `
        )(
          React,
          React.useState,
          React.useEffect,
          React.useRef,
          React.useMemo,
          React.useCallback
        );

        if (typeof Component !== 'function') {
          throw new Error('Component must be a function');
        }

        setPreview(() => Component);
        setError(null);
      } catch (err) {
        console.error('Preview error:', err);
        setError('Unable to render preview. Check console for details.');
        setPreview(null);
      }
    };

    createComponent();
  }, [code]);

  const renderPreview = () => {
    if (error) {
      return (
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-red-500">{error}</div>
          <div className="mt-2 text-xs text-gray-500">
            Please ensure the component code is valid React code.
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="text-sm text-gray-500 mb-2">Live Preview:</div>
        <div className="preview-container border rounded-lg p-4">
          <ErrorBoundary>
            {Preview ? (
              <Preview />
            ) : (
              <div className="text-gray-400">Loading preview...</div>
            )}
          </ErrorBoundary>
        </div>
      </div>
    );
  };

  return renderPreview();
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Preview render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-sm p-2">
          <div>Error rendering component:</div>
          <div className="text-xs mt-1 text-gray-500">
            {this.state.error?.message || 'Unknown error'}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CodePreview;
