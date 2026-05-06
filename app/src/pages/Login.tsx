import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { useAuth } from '@/lib/auth';
import { ApiError } from '@/lib/api';

export default function Login() {
  return <CredentialsForm mode="login" />;
}

export function Register() {
  return <CredentialsForm mode="register" />;
}

interface LocationState { from?: string }

function CredentialsForm({ mode }: { mode: 'login' | 'register' }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') await login(email, password);
      else await register(email, password);
      const from = (location.state as LocationState | null)?.from ?? '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unexpected error');
    } finally {
      setSubmitting(false);
    }
  }

  const heading = mode === 'login' ? 'AUTHENTICATE' : 'REGISTER ACCESS';
  const submitLabel = mode === 'login' ? 'GRANT ACCESS' : 'CREATE FILE';
  const altText = mode === 'login' ? 'Need credentials?' : 'Already issued?';
  const altHref = mode === 'login' ? '/register' : '/login';
  const altLink = mode === 'login' ? 'REQUEST CLEARANCE' : 'AUTHENTICATE';

  return (
    <Page>
      <Card>
        <Eyebrow>FORM 14PN-{mode === 'login' ? '001' : '002'}</Eyebrow>
        <Title>{heading}</Title>
        <Form onSubmit={onSubmit}>
          <Field>
            <Label htmlFor="email">EMAIL</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <Label htmlFor="password">PASSPHRASE</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {mode === 'register' && <Hint>Minimum 8 characters.</Hint>}
          </Field>
          {error && <ErrorBanner role="alert">{error}</ErrorBanner>}
          <Submit type="submit" disabled={submitting}>
            {submitting ? 'PROCESSING…' : submitLabel}
          </Submit>
        </Form>
        <Alt>
          {altText} <Link to={altHref}>{altLink}</Link>
        </Alt>
      </Card>
    </Page>
  );
}

const Page = styled.main`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[7]} ${theme.gutter};
  background: ${theme.colors.paper};
`;

const Card = styled.section`
  width: 100%;
  max-width: 420px;
  background: ${theme.colors.paper};
  border: 1px solid ${theme.colors.paperShadow};
  border-top: 4px solid ${theme.colors.manila};
  padding: ${theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
  box-shadow: 4px 6px 0 rgba(28, 24, 18, 0.08);
`;

const Eyebrow = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.textMuted};
`;

const Title = styled.h1`
  font-family: ${theme.fonts.stencil};
  font-size: ${theme.typography.h2};
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${theme.colors.ink};
  line-height: 1.1;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const Label = styled.label`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.ink};
`;

const Input = styled.input`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.body};
  background: ${theme.colors.paperShadow};
  border: 1px solid ${theme.colors.basalt};
  padding: ${theme.spacing[3]};
  color: ${theme.colors.ink};

  &:focus {
    outline: 2px solid ${theme.colors.hazardOrange};
    outline-offset: 2px;
  }
`;

const Hint = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.bodySmall};
  color: ${theme.colors.textMuted};
`;

const ErrorBanner = styled.div`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.bodySmall};
  background: ${theme.colors.classified};
  color: ${theme.colors.paper};
  padding: ${theme.spacing[3]};
  letter-spacing: 0.04em;
`;

const Submit = styled.button`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: ${theme.colors.hazardOrange};
  color: ${theme.colors.ink};
  border: none;
  padding: ${theme.spacing[3]} ${theme.spacing[5]};
  cursor: pointer;
  transition: transform 0.2s ${theme.ease.mechanical};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Alt = styled.p`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.bodySmall};
  color: ${theme.colors.textMuted};
  text-align: center;

  a {
    color: ${theme.colors.ink};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;
