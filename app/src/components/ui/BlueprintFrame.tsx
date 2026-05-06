import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const BlueprintFrame = styled.div`
  position: relative;
  border: 2px solid ${theme.colors.columbia};
  background: ${theme.colors.ash};
  padding: ${theme.spacing[5]};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, ${theme.colors.columbia}08 1px, transparent 1px),
      linear-gradient(to bottom, ${theme.colors.columbia}08 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 1;
  }
`;

export const BlueprintLabelBar = styled.div`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.columbia};
  line-height: 1.3;
  margin-bottom: ${theme.spacing[3]};
`;

export const CornerBracket = styled.div<{ $position: 'tl' | 'tr' | 'bl' | 'br' }>`
  position: absolute;
  width: 16px;
  height: 16px;
  z-index: 2;
  ${(props) => {
    switch (props.$position) {
      case 'tl':
        return 'top: -2px; left: -2px; border-top: 3px solid ${theme.colors.columbia}; border-left: 3px solid ${theme.colors.columbia};';
      case 'tr':
        return 'top: -2px; right: -2px; border-top: 3px solid ${theme.colors.columbia}; border-right: 3px solid ${theme.colors.columbia};';
      case 'bl':
        return 'bottom: -2px; left: -2px; border-bottom: 3px solid ${theme.colors.columbia}; border-left: 3px solid ${theme.colors.columbia};';
      case 'br':
        return 'bottom: -2px; right: -2px; border-bottom: 3px solid ${theme.colors.columbia}; border-right: 3px solid ${theme.colors.columbia};';
      default:
        return '';
    }
  }}
`;

export function BlueprintFrameWithCorners({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <BlueprintFrame>
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <CornerBracket $position="tl" />
        <CornerBracket $position="tr" />
        <CornerBracket $position="bl" />
        <CornerBracket $position="br" />
      </div>
      {label && <BlueprintLabelBar>{label}</BlueprintLabelBar>}
      <div style={{ position: 'relative', zIndex: 3 }}>{children}</div>
    </BlueprintFrame>
  );
}
