import styled from 'styled-components';
import { theme } from '@/styles/theme';

export type StampColor = 'classified' | 'declassified';

interface StampProps {
  $color?: StampColor;
  $rotation?: number;
}

export const Stamp = styled.div<StampProps>`
  display: inline-block;
  font-family: ${theme.fonts.stamp};
  font-size: ${theme.typography.stamp};
  letter-spacing: 0.05em;
  line-height: 1.2;
  color: ${(props) =>
    props.$color === 'classified' ? theme.colors.classified : theme.colors.declassified};
  opacity: 0.7;
  border: 3px double
    ${(props) =>
      props.$color === 'classified' ? theme.colors.classified : theme.colors.declassified};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  transform: rotate(${(props) => props.$rotation || -3}deg);
  mix-blend-mode: multiply;
  text-transform: uppercase;
  pointer-events: none;
`;
