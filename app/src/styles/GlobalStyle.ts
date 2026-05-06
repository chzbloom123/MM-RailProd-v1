import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  html, body {
    height: 100%;
    width: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${theme.fonts.mono};
    font-size: ${theme.typography.body};
    line-height: 1.65;
    letter-spacing: 0.01em;
    color: ${theme.colors.ink};
    background-color: ${theme.colors.paper};
    font-variant-numeric: tabular-nums;
  }

  img, video {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button {
    font: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.stencil};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    line-height: 1.1;
    font-weight: 700;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
