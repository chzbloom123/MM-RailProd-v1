import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const FolderCard = styled.div`
  position: relative;
  background: ${theme.colors.paper};
  border: 1px solid ${theme.colors.paperShadow};
  border-radius: 0 0 4px 4px;
  box-shadow: 2px 3px 0 rgba(28, 24, 18, 0.12);
  transition: all 0.3s ${theme.ease.mechanical};
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 4px 6px 0 rgba(28, 24, 18, 0.15);
  }
`;

export const FolderTab = styled.div`
  position: absolute;
  top: -12px;
  left: ${theme.spacing[4]};
  width: 80px;
  height: 12px;
  background: ${theme.colors.manila};
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.ink};
  line-height: 1;
`;

export const FolderBody = styled.div`
  padding: ${theme.spacing[5]} ${theme.spacing[5]} ${theme.spacing[5]} ${theme.spacing[5]};
  position: relative;
`;

export const FolderFoldCrease = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60%;
  height: 1px;
  background: linear-gradient(
    to right,
    ${theme.colors.paperShadow}30 0%,
    transparent 100%
  );
  transform: rotate(-12deg);
  transform-origin: left bottom;
`;

export const CoffeeRing = styled.img`
  position: absolute;
  bottom: ${theme.spacing[2]};
  right: ${theme.spacing[2]};
  width: 80px;
  height: 80px;
  opacity: 0.3;
  pointer-events: none;
`;
