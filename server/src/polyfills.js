// Web API polyfills for Node.js 18 and debug mode
// This file must be loaded before any other modules that use Web APIs

try {
  const nodeFetch = require('node-fetch');

  // Polyfill fetch
  if (!globalThis.fetch) {
    globalThis.fetch = nodeFetch;
  }

  // Polyfill Headers - check if it exists and is a constructor
  if (!globalThis.Headers && nodeFetch.Headers && typeof nodeFetch.Headers === 'function') {
    globalThis.Headers = nodeFetch.Headers;
  }

  // Polyfill Request - check if it exists and is a constructor
  if (!globalThis.Request && nodeFetch.Request && typeof nodeFetch.Request === 'function') {
    globalThis.Request = nodeFetch.Request;
  }

  // Polyfill Response - check if it exists and is a constructor
  if (!globalThis.Response && nodeFetch.Response && typeof nodeFetch.Response === 'function') {
    globalThis.Response = nodeFetch.Response;
  }

  // Polyfill FormData - use form-data package since node-fetch v2 doesn't export it
  if (!globalThis.FormData) {
    try {
      const FormData = require('form-data');
      globalThis.FormData = FormData;
    } catch (formDataError) {
      console.warn('Could not load form-data polyfill:', formDataError.message);
    }
  }

} catch (error) {
  console.error('Error loading polyfills:', error);
  // Continue without polyfills - some might be available natively
}
