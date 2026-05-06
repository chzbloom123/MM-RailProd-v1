import styled from 'styled-components';
import { theme } from '@/styles/theme';
import type { EventClass } from '@/types';

const eventColors: Record<EventClass, string> = {
  ACTION: theme.colors.columbia,
  RESOLUTION: theme.colors.declassified,
  DM_EVENT: theme.colors.manila,
  SCENE_CHANGE: theme.colors.trefoilYellow,
  MK_NOTE: theme.colors.redactionBar,
  COMMENT: theme.colors.concrete,
  COMMENT_ACTION: theme.colors.hazardOrange,
  STATUS_CHANGE: theme.colors.trefoilMagenta,
  MILESTONE: theme.colors.trefoilYellow,
  SESSION_MARKER: theme.colors.rust,
};

const eventBgTints: Record<EventClass, string> = {
  ACTION: 'rgba(74, 102, 112, 0.05)',
  RESOLUTION: 'rgba(31, 93, 58, 0.05)',
  DM_EVENT: 'rgba(212, 185, 126, 0.08)',
  SCENE_CHANGE: 'rgba(245, 200, 66, 0.10)',
  MK_NOTE: 'rgba(10, 10, 10, 0.08)',
  COMMENT: 'transparent',
  COMMENT_ACTION: 'rgba(217, 116, 65, 0.05)',
  STATUS_CHANGE: 'rgba(184, 51, 106, 0.05)',
  MILESTONE: 'rgba(245, 200, 66, 0.15)',
  SESSION_MARKER: 'rgba(138, 74, 43, 0.05)',
};

interface EventLogEntryProps {
  $eventClass: EventClass;
}

export const EventLogEntry = styled.div<EventLogEntryProps>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: ${theme.colors.paper};
  border-left: 3px solid ${(props) => eventColors[props.$eventClass]};
  background-color: ${(props) => eventBgTints[props.$eventClass]};
  transition: all 0.3s ${theme.ease.mechanical};
  position: relative;

  &:hover {
    background-color: ${theme.colors.paperShadow};
    transform: translateX(4px);
  }
`;

export const EventTimestamp = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.bodySmall};
  color: ${theme.colors.textMuted};
  letter-spacing: 0.01em;
  text-align: right;
`;

export const EventContent = styled.p`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.body};
  color: ${theme.colors.ink};
  line-height: 1.65;
  letter-spacing: 0.01em;
  margin: 0;
`;

export const RedactionBar = styled.span`
  display: inline-block;
  background: ${theme.colors.redactionBar};
  color: transparent;
  user-select: none;
  border-radius: 1px;
  padding: 0 4px;
`;
