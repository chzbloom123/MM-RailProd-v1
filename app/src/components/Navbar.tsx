import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { useAuth } from '@/lib/auth';

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.stickyNav};
  height: 64px;
  background: ${theme.colors.paper};
  border-bottom: 1px solid ${theme.colors.paperShadow};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.gutter};
  max-width: ${theme.maxWidth};
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-family: ${theme.fonts.stencil};
  font-size: ${theme.typography.h3};
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${theme.colors.ink};
  text-shadow: 1px 1px 0 rgba(28, 24, 18, 0.15);
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  text-decoration: none;
`;

const TrefoilIcon = styled.svg`
  width: 24px;
  height: 24px;
  color: ${theme.colors.trefoilYellow};
  flex-shrink: 0;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[6]};

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLinkItem = styled(Link)`
  position: relative;
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.nav};
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.colors.ink};
  line-height: 1;
  text-decoration: none;
  transition: color 0.3s ease;
  padding: ${theme.spacing[2]} 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: ${theme.colors.hazardOrange};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${theme.colors.hazardOrange};
    &::after {
      width: 100%;
    }
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.hazardOrange};
    outline-offset: 2px;
  }
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.declassified};
  line-height: 1.3;

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${theme.colors.declassified};
  box-shadow: 0 0 6px ${theme.colors.declassified};
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const HamburgerButton = styled.button`
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: ${theme.spacing[2]};
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
  }
`;

const HamburgerLine = styled.span`
  display: block;
  width: 24px;
  height: 2px;
  background: ${theme.colors.ink};
  transition: all 0.3s ease;
`;

const MobileDrawer = styled.div<{ $open: boolean }>`
  display: none;
  position: fixed;
  top: 64px;
  right: 0;
  bottom: 0;
  width: 280px;
  background: ${theme.colors.ash};
  padding: ${theme.spacing[6]};
  flex-direction: column;
  gap: ${theme.spacing[5]};
  transform: translateX(${(props) => (props.$open ? '0' : '100%')});
  transition: transform 0.3s ${theme.ease.mechanical};
  z-index: ${theme.zIndex.stickyNav};

  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
  }
`;

const MobileNavLink = styled(Link)`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.nav};
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.colors.textInverse};
  text-decoration: none;
  padding: ${theme.spacing[3]} 0;
  border-bottom: 1px solid ${theme.colors.borderDark};

  &:hover {
    color: ${theme.colors.hazardOrange};
  }
`;

const MobileStatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.declassified};
  margin-top: auto;
`;

const AuthCluster = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const UserBadge = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.textMuted};
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LogoutButton = styled.button`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.nav};
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.colors.ink};
  background: none;
  border: none;
  padding: ${theme.spacing[2]} 0;
  cursor: pointer;
  position: relative;
  line-height: 1;
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: ${theme.colors.hazardOrange};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${theme.colors.hazardOrange};
    &::after {
      width: 100%;
    }
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.hazardOrange};
    outline-offset: 2px;
  }
`;

const MobileUserBadge = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.textMuted};
  padding: ${theme.spacing[2]} 0;
  border-bottom: 1px solid ${theme.colors.borderDark};
  word-break: break-all;
`;

const MobileLogoutButton = styled.button`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.nav};
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.colors.textInverse};
  background: none;
  border: none;
  padding: ${theme.spacing[3]} 0;
  border-bottom: 1px solid ${theme.colors.borderDark};
  text-align: left;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.hazardOrange};
  }
`;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    setMobileOpen(false);
    navigate('/');
  }

  return (
    <>
      <Nav role="navigation" aria-label="Main navigation">
        <Logo to="/">
          <TrefoilIcon viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C10.5 5 8 8 8 12C8 14.5 9.5 16.5 12 17.5V14C11 13.5 10.5 12.5 10.5 11.5C10.5 9.5 11.5 7.5 12 6C12.5 7.5 13.5 9.5 13.5 11.5C13.5 12.5 13 13.5 12 14V17.5C14.5 16.5 16 14.5 16 12C16 8 13.5 5 12 2Z" />
          </TrefoilIcon>
          MUTANTS × MONSTERS
        </Logo>

        <NavLinks>
          <NavLinkItem to="/">HOME</NavLinkItem>
          <NavLinkItem to="/session">SESSION</NavLinkItem>
          <NavLinkItem to="/schema">SCHEMA</NavLinkItem>
          <NavLinkItem to="/archive">ARCHIVE</NavLinkItem>
        </NavLinks>

        <AuthCluster>
          {state.status === 'authenticated' && (
            <>
              <UserBadge title={state.user.email}>{state.user.email}</UserBadge>
              <LogoutButton type="button" onClick={handleLogout}>
                LOGOUT
              </LogoutButton>
            </>
          )}
          {state.status === 'anonymous' && (
            <NavLinkItem to="/login">LOGIN</NavLinkItem>
          )}
          <StatusBadge>
            <StatusDot aria-hidden="true" />
            SYSTEM: ONLINE
          </StatusBadge>
        </AuthCluster>

        <HamburgerButton
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <HamburgerLine />
          <HamburgerLine />
          <HamburgerLine />
        </HamburgerButton>
      </Nav>

      <MobileDrawer $open={mobileOpen} aria-hidden={!mobileOpen}>
        <MobileNavLink to="/" onClick={() => setMobileOpen(false)}>HOME</MobileNavLink>
        <MobileNavLink to="/session" onClick={() => setMobileOpen(false)}>SESSION</MobileNavLink>
        <MobileNavLink to="/schema" onClick={() => setMobileOpen(false)}>SCHEMA</MobileNavLink>
        <MobileNavLink to="/archive" onClick={() => setMobileOpen(false)}>ARCHIVE</MobileNavLink>
        {state.status === 'authenticated' && (
          <>
            <MobileUserBadge>{state.user.email}</MobileUserBadge>
            <MobileLogoutButton type="button" onClick={handleLogout}>
              LOGOUT
            </MobileLogoutButton>
          </>
        )}
        {state.status === 'anonymous' && (
          <MobileNavLink to="/login" onClick={() => setMobileOpen(false)}>LOGIN</MobileNavLink>
        )}
        <MobileStatusBadge>
          <StatusDot aria-hidden="true" />
          SYSTEM: ONLINE
        </MobileStatusBadge>
      </MobileDrawer>
    </>
  );
}
