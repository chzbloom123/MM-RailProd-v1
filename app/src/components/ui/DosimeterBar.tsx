import styled, { css, keyframes } from 'styled-components';
import { theme } from '@/styles/theme';

const criticalPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

interface DosimeterTrackProps {
  $critical?: boolean;
}

export const DosimeterTrack = styled.div`
  width: 100%;
  height: 4px;
  background: ${theme.colors.basalt};
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;

interface DosimeterFillProps {
  $value: number;
  $max: number;
}

export const DosimeterFill = styled.div<DosimeterFillProps>`
  height: 100%;
  width: ${(props) => (props.$value / props.$max) * 100}%;
  background: ${(props) =>
    props.$value / props.$max <= 0.3 ? theme.colors.trefoilMagenta : theme.colors.trefoilYellow};
  border-radius: 2px;
  transition: width 0.5s ${theme.ease.mechanical}, background 0.5s ${theme.ease.mechanical};
`;

interface DosimeterBarProps {
  value: number;
  max: number;
  label?: string;
}

const DosimeterContainer = styled.div<DosimeterTrackProps>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
  ${(props) =>
    props.$critical &&
    css`
      ${DosimeterFill} {
        animation: ${criticalPulse} 1.5s infinite;
      }
    `}
`;

const DosimeterLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DosimeterLabel = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.textMuted};
`;

const DosimeterValue = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  color: ${theme.colors.ink};
`;

export function DosimeterBar({ value, max, label = 'DOSIMETER' }: DosimeterBarProps) {
  const isCritical = value / max <= 0.3;
  return (
    <DosimeterContainer $critical={isCritical}>
      <DosimeterLabelRow>
        <DosimeterLabel>{label}</DosimeterLabel>
        <DosimeterValue>
          {value}/{max}
        </DosimeterValue>
      </DosimeterLabelRow>
      <DosimeterTrack>
        <DosimeterFill $value={value} $max={max} />
      </DosimeterTrack>
    </DosimeterContainer>
  );
}
