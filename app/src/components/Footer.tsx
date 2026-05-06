import { Link } from 'react-router';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const FooterContainer = styled.footer`
  background: ${theme.colors.ash};
  color: ${theme.colors.textInverse};
  padding-top: ${theme.spacing[7]};
  padding-bottom: ${theme.spacing[5]};
  position: relative;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${theme.spacing[6]};
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${theme.gutter};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const FooterStamp = styled.div`
  font-family: ${theme.fonts.stamp};
  font-size: ${theme.typography.bodySmall};
  letter-spacing: 0.05em;
  color: ${theme.colors.textInverse};
  opacity: 0.7;
  text-transform: uppercase;
`;

const FooterLink = styled(Link)`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.bodySmall};
  color: ${theme.colors.textInverse};
  text-decoration: none;
  line-height: 1.5;
  letter-spacing: 0.01em;

  &:hover {
    color: ${theme.colors.hazardOrange};
  }
`;

const UnclassifiedBadge = styled.div`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.declassified};
  line-height: 1.3;
  text-align: right;

  @media (max-width: ${theme.breakpoints.md}) {
    text-align: left;
  }
`;

const BottomBar = styled.div`
  max-width: ${theme.maxWidth};
  margin: ${theme.spacing[5]} auto 0;
  padding: ${theme.spacing[4]} ${theme.gutter} 0;
  border-top: 1px solid ${theme.colors.rust};
  text-align: center;
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.bodySmall};
  color: ${theme.colors.textInverse};
  opacity: 0.5;
  letter-spacing: 0.01em;
`;

export function Footer() {
  return (
    <FooterContainer>
      <FooterGrid>
        <FooterColumn>
          <FooterStamp>DEPARTMENT OF MUTANT AFFAIRS</FooterStamp>
          <FooterStamp>EST. 2087</FooterStamp>
        </FooterColumn>
        <FooterColumn>
          <FooterLink to="/">HOME</FooterLink>
          <FooterLink to="/session">SESSION</FooterLink>
          <FooterLink to="/schema">SCHEMA</FooterLink>
          <FooterLink to="/archive">ARCHIVE</FooterLink>
        </FooterColumn>
        <FooterColumn>
          <UnclassifiedBadge>THIS DOCUMENT IS UNCLASSIFIED</UnclassifiedBadge>
        </FooterColumn>
      </FooterGrid>
      <BottomBar>
        MUTANTS × MONSTERS v0.9.2 // BUILD 2087-03-14
      </BottomBar>
    </FooterContainer>
  );
}
