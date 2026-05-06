import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'stamp' | 'ghost' | 'declass';

interface StyledButtonProps {
  $variant: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: ${theme.colors.hazardOrange};
    color: ${theme.colors.ink};
    border: none;
    &:hover {
      background: #c26336;
      transform: translateY(-2px);
    }
  `,
  secondary: css`
    background: transparent;
    color: ${theme.colors.ink};
    border: 2px solid ${theme.colors.ink};
    &:hover {
      background: ${theme.colors.ink};
      color: ${theme.colors.paper};
    }
  `,
  stamp: css`
    background: ${theme.colors.classified};
    color: ${theme.colors.paper};
    border: 3px double ${theme.colors.classified};
    &:hover {
      transform: rotate(1deg);
      opacity: 0.9;
    }
  `,
  ghost: css`
    background: transparent;
    color: ${theme.colors.textMuted};
    border: 1px solid ${theme.colors.paperShadow};
    &:hover {
      background: ${theme.colors.paperShadow};
    }
  `,
  declass: css`
    background: ${theme.colors.declassified};
    color: ${theme.colors.paper};
    border: none;
    &:hover {
      background: #267a4d;
    }
  `,
};

export const Button = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[5]};
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.3;
  cursor: pointer;
  transition: all 0.2s ${theme.ease.mechanical};
  ${(props) => variantStyles[props.$variant]}
  &:active {
    transform: scale(0.98);
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.hazardOrange};
    outline-offset: 2px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  flex-wrap: wrap;
`;
