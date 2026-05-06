import styled from 'styled-components';
import { theme } from '@/styles/theme';

export type HazardVariant = 'yellow' | 'magenta' | 'classified';

interface HazardPlacardProps {
  $variant?: HazardVariant;
}

const variantColors: Record<HazardVariant, string> = {
  yellow: theme.colors.trefoilYellow,
  magenta: theme.colors.trefoilMagenta,
  classified: theme.colors.classified,
};

export const HazardPlacard = styled.span<HazardPlacardProps>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1.3;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
  border: 2px solid ${(props) => variantColors[props.$variant || 'yellow']};
  color: ${(props) => variantColors[props.$variant || 'yellow']};
  background: ${(props) =>
    props.$variant === 'yellow'
      ? 'rgba(245, 200, 66, 0.1)'
      : props.$variant === 'magenta'
      ? 'rgba(184, 51, 106, 0.1)'
      : 'rgba(139, 31, 31, 0.1)'};
`;
