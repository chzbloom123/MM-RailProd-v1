import styled from 'styled-components';

const PaperTextureOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.06;
  background-image: url('/paper-texture.jpg');
  background-repeat: repeat;
  background-size: 256px 256px;
  mix-blend-mode: multiply;
`;

export function PaperTexture() {
  return <PaperTextureOverlay aria-hidden="true" />;
}
