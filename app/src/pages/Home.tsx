import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, useInView } from 'framer-motion';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import { FolderCard, FolderTab, FolderBody } from '@/components/ui/FolderCard';
import { DosimeterBar } from '@/components/ui/DosimeterBar';
import { HazardPlacard } from '@/components/ui/HazardPlacard';
import { Stamp } from '@/components/ui/Stamp';
import { EventLogEntry, EventTimestamp, EventContent, RedactionBar } from '@/components/ui/EventLogEntry';
import { BlueprintFrameWithCorners } from '@/components/ui/BlueprintFrame';
import type { EventClass } from '@/types';

gsap.registerPlugin(ScrollTrigger);

/* ───────── Keyframes ───────── */
const glowPulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
`;

const statusPulse = keyframes`
  0%, 100% { box-shadow: 0 0 6px ${theme.colors.declassified}; opacity: 1; }
  50% { box-shadow: 0 0 2px ${theme.colors.declassified}; opacity: 0.5; }
`;

const trefoilSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/* ───────── Section 1: Hero ───────── */
const HeroSection = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: ${theme.colors.ash};
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const HeroBgImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url('/hero-scene.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.35;
  z-index: 0;
`;

const HeroFilmGrain = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-image: url('/paper-texture.jpg');
  background-repeat: repeat;
  mix-blend-mode: overlay;
  z-index: 1;
  pointer-events: none;
`;

const HeroVideo = styled.video`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40vw;
  opacity: 0.25;
  mix-blend-mode: screen;
  pointer-events: none;
  z-index: 0;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const TrefoilWatermark = styled.svg`
  position: absolute;
  bottom: 48px;
  left: 48px;
  width: 300px;
  height: 300px;
  color: ${theme.colors.trefoilYellow};
  opacity: 0.04;
  z-index: 0;
  pointer-events: none;
`;

const TitleBlock = styled.div`
  position: relative;
  z-index: 2;
  padding-left: 8vw;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
  max-width: 70%;

  @media (max-width: ${theme.breakpoints.md}) {
    padding-left: ${theme.gutter};
    max-width: 100%;
    padding-right: ${theme.gutter};
  }
`;

const Eyebrow = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.textMuted};
  line-height: 1.3;
`;

const HeroTitle = styled.h1`
  font-family: ${theme.fonts.stencil};
  font-size: ${theme.typography.hero};
  font-weight: 700;
  letter-spacing: 0.15em;
  line-height: 1.0;
  color: ${theme.colors.textInverse};
  text-transform: uppercase;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.5), 0 0 40px rgba(245,200,66,0.15);
`;

const HeroSubtitle = styled.p`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.body};
  color: ${theme.colors.textInverse};
  opacity: 0.7;
  line-height: 1.65;
  letter-spacing: 0.01em;
  max-width: 520px;
`;

const CTARow = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[7]};
  flex-wrap: wrap;
`;

const DosimeterGaugeWrapper = styled.div`
  position: absolute;
  right: 10vw;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[3]};
  z-index: 2;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const GaugeSvg = styled.svg`
  width: 120px;
  height: 120px;
  transform: rotate(-90deg);
`;

const GaugeGlow = styled.div<{ $intensity: number }>`
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: ${theme.colors.trefoilYellow};
  opacity: ${(props) => props.$intensity * 0.6};
  filter: blur(20px);
  pointer-events: none;
  animation: ${glowPulse} 3s infinite;
  z-index: -1;
`;

/* ───────── Section 2: Title Bar ───────── */
const TitleBarSection = styled.div`
  width: 100%;
  background: ${theme.colors.paper};
  border-bottom: 1px solid ${theme.colors.paperShadow};
  height: 48px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;
`;

const TitleBarContent = styled.div`
  max-width: ${theme.maxWidth};
  width: 100%;
  margin: 0 auto;
  padding: 0 ${theme.gutter};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleBarText = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.ink};
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const TitleBarSep = styled.span`
  color: ${theme.colors.textMuted};
`;

/* ───────── Section 3: The Pitch ───────── */
const PitchSection = styled.section`
  background: ${theme.colors.paper};
  padding: ${theme.spacing[9]} 0;
  position: relative;
  z-index: 10;
`;

const PitchGrid = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${theme.gutter};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing[6]};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const PitchCard = styled(FolderCard)`
  display: flex;
  flex-direction: column;
`;

const PitchCardBody = styled(FolderBody)`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
  flex: 1;
`;

const PitchIcon = styled.div`
  width: 32px;
  height: 32px;
  color: ${(props) => props.color || theme.colors.columbia};
`;

const PitchTitle = styled.h3`
  font-family: ${theme.fonts.stencil};
  font-size: ${theme.typography.h3};
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.2;
  color: ${theme.colors.ink};
  text-transform: uppercase;
`;

const PitchBody = styled.p`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.body};
  color: ${theme.colors.ink};
  line-height: 1.65;
  letter-spacing: 0.01em;
  flex: 1;
`;

/* ───────── Section 4: Interface Preview ───────── */
const InterfaceSection = styled.section`
  background: ${theme.colors.ash};
  padding: ${theme.spacing[9]} 0;
  position: relative;
  z-index: 10;
`;

const InterfaceHeader = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto ${theme.spacing[7]};
  padding: 0 ${theme.gutter};
  text-align: center;
`;

const InterfaceEyebrow = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.textInverse};
  opacity: 0.6;
  line-height: 1.3;
  display: block;
  margin-bottom: ${theme.spacing[3]};
`;

const InterfaceTitle = styled.h2`
  font-family: ${theme.fonts.stencil};
  font-size: ${theme.typography.h2};
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.15;
  color: ${theme.colors.textInverse};
  text-transform: uppercase;
  margin-bottom: ${theme.spacing[3]};
`;

const InterfaceSubtitle = styled.p`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.body};
  color: ${theme.colors.textInverse};
  opacity: 0.7;
  line-height: 1.65;
  letter-spacing: 0.01em;
`;

const MockupContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.gutter};
  background: ${theme.colors.paper};
  border: 2px solid ${theme.colors.basalt};
  position: relative;
`;

const MockupLabelBar = styled.div`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.ink};
  line-height: 1.3;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.paperShadow};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const MockupGrid = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr 360px;
  gap: 0;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const MockupColumn = styled.div`
  padding: ${theme.spacing[4]};
  border-right: 1px solid ${theme.colors.paperShadow};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};

  &:last-child {
    border-right: none;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    border-right: none;
    border-bottom: 1px solid ${theme.colors.paperShadow};
  }
`;

const PlayerCard = styled.div`
  background: ${theme.colors.paper};
  border: 1px solid ${theme.colors.paperShadow};
  border-radius: 4px;
  padding: ${theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const PlayerPortrait = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid ${theme.colors.manila};
  object-fit: cover;
`;

const PlayerName = styled.span`
  font-family: ${theme.fonts.stencil};
  font-size: ${theme.typography.body};
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${theme.colors.ink};
`;

const PlayerPlacards = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  flex-wrap: wrap;
`;

const SceneImage = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background-image: url('/session-scene-01.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
`;

const SceneOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${theme.spacing[3]};
  background: linear-gradient(to top, rgba(42,39,36,0.8), transparent);
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.columbia};
`;

/* ───────── Section 5: Storybook Showcase ───────── */
const StorybookSection = styled.section`
  background: #ded8c6;
  padding: ${theme.spacing[10]} 0;
  position: relative;
  z-index: 10;
`;

const StorybookGrid = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${theme.gutter};
  display: grid;
  grid-template-columns: 55% 45%;
  gap: ${theme.spacing[8]};
  align-items: start;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const StorybookContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[5]};
`;

const StorybookBody = styled.p`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.body};
  color: ${theme.colors.ink};
  line-height: 1.65;
  letter-spacing: 0.01em;
  max-width: 520px;
`;

const StorybookVisual = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[5]};
`;

const StorybookImage = styled.img<{ $rotation: number }>`
  width: 100%;
  border-radius: 4px;
  box-shadow: 4px 6px 0 rgba(28, 24, 18, 0.15);
  transform: rotate(${(props) => props.$rotation}deg);
  transition: transform 0.3s ${theme.ease.mechanical}, box-shadow 0.3s ${theme.ease.mechanical};

  &:hover {
    transform: rotate(${(props) => props.$rotation}deg) scale(1.02);
    box-shadow: 6px 8px 0 rgba(28, 24, 18, 0.2);
  }
`;

const StorybookStamp = styled.div`
  position: absolute;
  top: 20%;
  right: -10px;
  z-index: 2;
`;

/* ───────── Section 6: Schema Teaser ───────── */
const SchemaSection = styled.section`
  background: ${theme.colors.ash};
  padding: ${theme.spacing[9]} 0;
  position: relative;
  z-index: 10;
`;

const SchemaHeader = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto ${theme.spacing[7]};
  padding: 0 ${theme.gutter};
  text-align: center;
`;

const SchemaEyebrow = styled(InterfaceEyebrow)``;
const SchemaTitle = styled(InterfaceTitle)``;
const SchemaSubtitle = styled(InterfaceSubtitle)``;

const EntityGrid = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto ${theme.spacing[7]};
  padding: 0 ${theme.gutter};
  display: flex;
  gap: ${theme.spacing[4]};
  flex-wrap: wrap;
  justify-content: center;
`;

const EntityCard = styled.div<{ $borderColor: string }>`
  width: 160px;
  background: ${theme.colors.paper};
  border: 1px solid ${theme.colors.paperShadow};
  border-top: 3px solid ${(props) => props.$borderColor};
  padding: ${theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  transition: all 0.3s ${theme.ease.mechanical};
  cursor: default;

  &:hover {
    transform: translateY(-4px);
    border-top-width: 5px;
  }
`;

const EntityCode = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.h2};
  font-weight: 700;
  letter-spacing: 0.06em;
  color: ${theme.colors.ink};
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
`;

const EntityName = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.bodySmall};
  color: ${theme.colors.textMuted};
  line-height: 1.5;
  letter-spacing: 0.01em;
`;

const EntityDesc = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.bodySmall};
  color: ${theme.colors.ink};
  line-height: 1.5;
  letter-spacing: 0.01em;
`;

const AttributeRow = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto ${theme.spacing[6]};
  padding: 0 ${theme.gutter};
  display: flex;
  gap: ${theme.spacing[3]};
  flex-wrap: wrap;
  justify-content: center;
`;

const AttributeTag = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.label};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1.3;
  background: ${theme.colors.paper};
  border: 1px solid ${theme.colors.paperShadow};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  color: ${theme.colors.ink};
  transition: all 0.3s ${theme.ease.mechanical};
  cursor: default;

  &:hover {
    background: ${theme.colors.manila};
    transform: translateY(-2px);
  }
`;

const SchemaDiagram = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${theme.gutter};
  position: relative;
`;

const SchemaDiagramImg = styled.img`
  width: 100%;
  border: 2px solid ${theme.colors.basalt};
  display: block;
`;

const SchemaStamp = styled.div`
  position: absolute;
  bottom: ${theme.spacing[4]};
  right: calc(${theme.gutter} + ${theme.spacing[4]});
`;

/* ───────── Section 7: CTA ───────── */
const CTASection = styled.section`
  background: ${theme.colors.paper};
  padding: ${theme.spacing[10]} 0 ${theme.spacing[7]};
  position: relative;
  z-index: 10;
  text-align: center;
`;

const CTAContent = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 ${theme.gutter};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[5]};
`;

const CTATitle = styled.h2`
  font-family: ${theme.fonts.stencil};
  font-size: ${theme.typography.h1};
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.1;
  color: ${theme.colors.ink};
  text-transform: uppercase;
  text-align: center;
`;

const CTABody = styled.p`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.typography.body};
  color: ${theme.colors.textMuted};
  line-height: 1.65;
  letter-spacing: 0.01em;
  text-align: center;
`;

const CTAButtonRow = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  flex-wrap: wrap;
  justify-content: center;
`;

const CTATrefoil = styled.svg`
  width: 80px;
  height: 80px;
  color: ${theme.colors.trefoilYellow};
  opacity: 0.15;
  animation: ${trefoilSpin} 60s linear infinite;
`;

const CTARustLine = styled.div`
  width: 120px;
  height: 1px;
  background: ${theme.colors.rust};
`;

const CTAFooterStamp = styled.div`
  position: absolute;
  bottom: ${theme.spacing[6]};
  right: ${theme.spacing[6]};
  opacity: 0.6;
`;

/* ───────── Reusable scroll reveal wrapper ───────── */
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20% 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
    >
      {children}
    </motion.div>
  );
}

/* ───────── Home Page Component ───────── */
export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const [eyebrowText, setEyebrowText] = useState('');
  const [titleChars, setTitleChars] = useState<string[]>([]);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [gaugeAngle, setGaugeAngle] = useState(0);
  const [gaugeGlowIntensity, setGaugeGlowIntensity] = useState(0);
  const fullTitle = 'MUTANTS × MONSTERS';
  const fullEyebrow = 'CASE FILE 14PN100206';

  /* Typewriter effect for eyebrow */
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setEyebrowText(fullEyebrow.slice(0, i));
      if (i >= fullEyebrow.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  /* Title character stagger */
  useEffect(() => {
    const delay = fullEyebrow.length * 40 + 200;
    const timeout = setTimeout(() => {
      const chars = fullTitle.split('');
      setTitleChars(chars);
      setTimeout(() => setShowSubtitle(true), chars.length * 50 + 300);
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  /* GSAP ScrollTrigger for hero */
  useGSAP(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 0.5,
      },
    });

    tl.to(
      {},
      {
        duration: 1,
        onUpdate: function () {
          const progress = this.progress();
          setGaugeAngle(75 + progress * 100);
          setGaugeGlowIntensity(progress);
          if (progress > 0.7) setShowCTA(true);
        },
      },
      0
    );
  }, { scope: heroRef });

  /* Gauge needle load animation */
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const target = 75;
      const duration = 2000;
      const startTime = performance.now();

      function animate(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const wobble = t >= 0.85 ? Math.sin((t - 0.85) * 20) * 3 * (1 - (t - 0.85) / 0.15) : 0;
        setGaugeAngle(start + (target - start) * eased + wobble);
        if (t < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }, fullEyebrow.length * 40 + 500);
    return () => clearTimeout(timeout);
  }, []);

  const entities = [
    { code: 'CH', name: 'Character', desc: 'Baseline human survivor', color: theme.colors.columbia },
    { code: 'Mu', name: 'Mutant', desc: 'Genetically altered being', color: theme.colors.trefoilYellow },
    { code: 'Mo', name: 'Monster', desc: 'Anomalous creature', color: theme.colors.trefoilMagenta },
    { code: 'Sy', name: 'Synthetic', desc: 'Manufactured entity', color: theme.colors.concrete },
    { code: 'Hy', name: 'Hybrid', desc: 'Crossbred organism', color: theme.colors.hazardOrange },
  ];

  const attributes = ['VIT', 'MX', 'REF', 'BRT', 'CUN', 'END', 'PRS'];

  const logEntries: { class: EventClass; content: React.ReactNode; ts: string }[] = [
    { class: 'SCENE_CHANGE', content: 'The vault door groans open...', ts: '2087-03-14 14:23:07' },
    { class: 'ACTION', content: 'KARA-7 advances to the catwalk...', ts: '2087-03-14 14:23:07' },
    { class: 'MK_NOTE', content: <RedactionBar>██████ ██████</RedactionBar>, ts: '2087-03-14 14:23:07' },
    { class: 'RESOLUTION', content: 'The lock yields. 14 vs REF. Success.', ts: '2087-03-14 14:23:07' },
  ];

  const pitchCards = [
    {
      tab: '01 // RUN',
      iconColor: theme.colors.columbia,
      title: 'LIVE SESSION INTERFACE',
      body: 'Three-column tactical display. Player dosimeters on the left, scene blueprint in the center, event stream on the right. Everything updates in real-time as the story unfolds.',
      cta: 'SEE IT IN ACTION →',
      to: '/session',
    },
    {
      tab: '02 // LOG',
      iconColor: theme.colors.manila,
      title: 'TYPED EVENT STREAM',
      body: 'Every action, resolution, scene change, and MK note is timestamped and classified. The event log is the spine of your session — a complete documentary record of what happened and when.',
      cta: 'VIEW THE SCHEMA →',
      to: '/schema',
    },
    {
      tab: '03 // EXPORT',
      iconColor: theme.colors.trefoilYellow,
      title: 'ILLUSTRATED STORYBOOK',
      body: 'At session end, export a printable hardcover artifact. Full-bleed scene images, two-column justified body, drop caps, ornamental borders, trefoil fleurons. Your campaign as a declassified document.',
      cta: 'BROWSE THE ARCHIVE →',
      to: '/archive',
    },
  ];

  return (
    <>
      {/* ─── Hero ─── */}
      <HeroSection ref={heroRef}>
        <HeroBgImage />
        <HeroFilmGrain />
        <HeroVideo autoPlay muted loop playsInline src="/hero-dosimeter-loop.mp4" />
        <TrefoilWatermark viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C10.5 5 8 8 8 12C8 14.5 9.5 16.5 12 17.5V14C11 13.5 10.5 12.5 10.5 11.5C10.5 9.5 11.5 7.5 12 6C12.5 7.5 13.5 9.5 13.5 11.5C13.5 12.5 13 13.5 12 14V17.5C14.5 16.5 16 14.5 16 12C16 8 13.5 5 12 2Z" />
        </TrefoilWatermark>

        <TitleBlock>
          <Eyebrow aria-label="Case file number">{eyebrowText}</Eyebrow>
          <HeroTitle>
            {titleChars.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                style={{ display: 'inline-block' }}
              >
                {char === ' ' ? ' ' : char}
              </motion.span>
            ))}
          </HeroTitle>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={showSubtitle ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <HeroSubtitle>
              A DECOMMISSIONED RECORDS SYSTEM FOR POST-APOCALYPTIC TABLETOP SESSIONS
            </HeroSubtitle>
          </motion.div>

          <CTARow>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showCTA ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <Button $variant="primary" as={Link} to="/session">ENTER THE SESSION</Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showCTA ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Button $variant="secondary" as={Link} to="/archive">READ THE ARCHIVE</Button>
            </motion.div>
          </CTARow>
        </TitleBlock>

        <DosimeterGaugeWrapper>
          <div style={{ position: 'relative' }}>
            <GaugeGlow $intensity={gaugeGlowIntensity} />
            <GaugeSvg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke={theme.colors.trefoilYellow} strokeWidth="2" strokeOpacity="0.4" />
              {[...Array(36)].map((_, i) => {
                const angle = (i * 10 * Math.PI) / 180;
                const x1 = 60 + 48 * Math.cos(angle);
                const y1 = 60 + 48 * Math.sin(angle);
                const x2 = 60 + (i % 5 === 0 ? 42 : 46) * Math.cos(angle);
                const y2 = 60 + (i % 5 === 0 ? 42 : 46) * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={theme.colors.trefoilYellow}
                    strokeWidth={i % 5 === 0 ? 2 : 1}
                    strokeOpacity="0.3"
                  />
                );
              })}
              <line
                x1="60"
                y1="60"
                x2={60 + 44 * Math.cos((gaugeAngle * Math.PI) / 180)}
                y2={60 + 44 * Math.sin((gaugeAngle * Math.PI) / 180)}
                stroke={theme.colors.trefoilYellow}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="60" cy="60" r="4" fill={theme.colors.trefoilYellow} />
            </GaugeSvg>
          </div>
        </DosimeterGaugeWrapper>
      </HeroSection>

      {/* ─── Title Bar ─── */}
      <TitleBarSection>
        <TitleBarContent>
          <TitleBarText>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.colors.trefoilYellow} aria-hidden="true">
              <path d="M12 2C10.5 5 8 8 8 12C8 14.5 9.5 16.5 12 17.5V14C11 13.5 10.5 12.5 10.5 11.5C10.5 9.5 11.5 7.5 12 6C12.5 7.5 13.5 9.5 13.5 11.5C13.5 12.5 13 13.5 12 14V17.5C14.5 16.5 16 14.5 16 12C16 8 13.5 5 12 2Z" />
            </svg>
            MUTANTS × MONSTERS
            <TitleBarSep>//</TitleBarSep>
            CASE FILE 14PN100206
            <TitleBarSep>//</TitleBarSep>
            SESSION 14
            <TitleBarSep>//</TitleBarSep>
            SYSTEM:
          </TitleBarText>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], fontFamily: theme.fonts.mono, fontSize: theme.typography.label, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.colors.declassified }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.colors.declassified, animation: `${statusPulse} 2s infinite` }} />
            ONLINE
          </div>
        </TitleBarContent>
      </TitleBarSection>

      {/* ─── The Pitch ─── */}
      <PitchSection>
        <PitchGrid>
          {pitchCards.map((card, i) => (
            <ScrollReveal key={card.tab} delay={i * 0.15}>
              <PitchCard>
                <FolderTab>{card.tab}</FolderTab>
                <PitchCardBody>
                  <PitchIcon color={card.iconColor}>
                    {i === 0 ? (
                      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="6,4 28,16 6,28" />
                      </svg>
                    ) : i === 1 ? (
                      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="6" width="24" height="20" rx="2" />
                        <line x1="4" y1="12" x2="28" y2="12" />
                        <line x1="9" y1="18" x2="19" y2="18" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="4" width="11" height="24" rx="1" />
                        <rect x="17" y="4" width="11" height="24" rx="1" />
                        <line x1="9" y1="10" x2="9" y2="10" />
                      </svg>
                    )}
                  </PitchIcon>
                  <PitchTitle>{card.title}</PitchTitle>
                  <PitchBody>{card.body}</PitchBody>
                  <Button $variant="ghost" as={Link} to={card.to} style={{ alignSelf: 'flex-start' }}>
                    {card.cta}
                  </Button>
                </PitchCardBody>
              </PitchCard>
            </ScrollReveal>
          ))}
        </PitchGrid>
      </PitchSection>

      {/* ─── Interface Preview ─── */}
      <InterfaceSection>
        <InterfaceHeader>
          <ScrollReveal>
            <InterfaceEyebrow>LIVE SYSTEM PREVIEW</InterfaceEyebrow>
            <InterfaceTitle>SESSION INTERFACE</InterfaceTitle>
            <InterfaceSubtitle>
              Three-column tactical layout. Real-time event streaming. Dosimeter health tracking.
            </InterfaceSubtitle>
          </ScrollReveal>
        </InterfaceHeader>

        <ScrollReveal>
          <MockupContainer>
            <MockupLabelBar>
              SESSION 14 <span style={{ color: theme.colors.textMuted }}>//</span> 2087-03-14 <span style={{ color: theme.colors.textMuted }}>//</span> STATUS: ACTIVE
            </MockupLabelBar>
            <MockupGrid>
              <MockupColumn>
                <PlayerCard>
                  <PlayerHeader>
                    <PlayerPortrait src="/character-card-portrait-01.jpg" alt="KARA-7" />
                    <PlayerName>KARA-7</PlayerName>
                  </PlayerHeader>
                  <DosimeterBar value={72} max={100} />
                  <PlayerPlacards>
                    <HazardPlacard $variant="yellow">IRRADIATED</HazardPlacard>
                    <HazardPlacard $variant="yellow">STIMmed</HazardPlacard>
                  </PlayerPlacards>
                </PlayerCard>
                <PlayerCard>
                  <PlayerHeader>
                    <PlayerPortrait src="/character-card-portrait-02.jpg" alt="GRISTLE" />
                    <PlayerName>GRISTLE</PlayerName>
                  </PlayerHeader>
                  <DosimeterBar value={18} max={100} />
                  <PlayerPlacards>
                    <HazardPlacard $variant="magenta">CRITICAL</HazardPlacard>
                  </PlayerPlacards>
                </PlayerCard>
              </MockupColumn>

              <MockupColumn style={{ padding: 0, borderRight: 'none' }}>
                <BlueprintFrameWithCorners label="SCENE RECORD // 2087-03-14 14:23:07">
                  <SceneImage>
                    <SceneOverlay>SECTOR 7-D // CONTAINMENT VAULT</SceneOverlay>
                  </SceneImage>
                </BlueprintFrameWithCorners>
              </MockupColumn>

              <MockupColumn>
                {logEntries.map((entry, idx) => (
                  <EventLogEntry key={idx} $eventClass={entry.class}>
                    <EventTimestamp>{entry.ts}</EventTimestamp>
                    <EventContent>{entry.content}</EventContent>
                  </EventLogEntry>
                ))}
              </MockupColumn>
            </MockupGrid>
          </MockupContainer>
        </ScrollReveal>
      </InterfaceSection>

      {/* ─── Storybook Showcase ─── */}
      <StorybookSection>
        <StorybookGrid>
          <StorybookContent>
            <ScrollReveal>
              <Eyebrow style={{ color: theme.colors.textMuted }}>THE SOUL OF THE PRODUCT</Eyebrow>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 style={{ fontFamily: theme.fonts.stencil, fontSize: theme.typography.h2, fontWeight: 700, letterSpacing: '0.06em', lineHeight: 1.15, color: theme.colors.ink, textTransform: 'uppercase' }}>
                YOUR CAMPAIGN AS A DECLASSIFIED DOCUMENT
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <StorybookBody>
                When the session ends, the real artifact begins. MMC exports every scene, every roll, every redacted MK note into a printable hardcover storybook — a document that looks like it was pulled from a flooded filing cabinet beneath the Hanford Site.
              </StorybookBody>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <StorybookBody>
                Full-bleed scene illustrations open each chapter. Two-column justified body in classical serif. Drop caps. Ornamental borders around milestones. Running heads with campaign name and page number. Trefoil fleurons mark section breaks.
              </StorybookBody>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <StorybookBody>
                This is not a character sheet. This is not a transcript. This is the story you survived, bound in leather and stamped with gold.
              </StorybookBody>
            </ScrollReveal>
            <ScrollReveal delay={0.5}>
              <Button $variant="primary" as={Link} to="/archive">BROWSE THE ARCHIVE →</Button>
            </ScrollReveal>
          </StorybookContent>

          <StorybookVisual>
            <ScrollReveal>
              <StorybookImage src="/storybook-cover.jpg" alt="Storybook cover" $rotation={-2} />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <StorybookImage src="/storybook-spread.jpg" alt="Storybook spread" $rotation={1.5} style={{ marginTop: -20 }} />
            </ScrollReveal>
            <StorybookStamp>
              <Stamp $color="declassified" $rotation={4}>DECLASSIFIED</Stamp>
            </StorybookStamp>
          </StorybookVisual>
        </StorybookGrid>
      </StorybookSection>

      {/* ─── Schema Teaser ─── */}
      <SchemaSection>
        <SchemaHeader>
          <ScrollReveal>
            <SchemaEyebrow>GAME SCHEMA</SchemaEyebrow>
            <SchemaTitle>FIVE ENTITIES. SEVEN ATTRIBUTES. ONE D20.</SchemaTitle>
            <SchemaSubtitle>
              Not D&D. An original post-apocalyptic system built for narrative survival.
            </SchemaSubtitle>
          </ScrollReveal>
        </SchemaHeader>

        <EntityGrid>
          {entities.map((e, i) => (
            <ScrollReveal key={e.code} delay={i * 0.08}>
              <EntityCard $borderColor={e.color}>
                <EntityCode>{e.code}</EntityCode>
                <EntityName>{e.name}</EntityName>
                <EntityDesc>{e.desc}</EntityDesc>
              </EntityCard>
            </ScrollReveal>
          ))}
        </EntityGrid>

        <ScrollReveal>
          <AttributeRow>
            {attributes.map((attr, i) => (
              <motion.span
                key={attr}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
                <AttributeTag>{attr}</AttributeTag>
              </motion.span>
            ))}
          </AttributeRow>
        </ScrollReveal>

        <ScrollReveal>
          <SchemaDiagram>
            <SchemaDiagramImg src="/schema-entity-diagram.jpg" alt="Entity type diagram" />
            <SchemaStamp>
              <Stamp $color="declassified" $rotation={-2}>UNCLASSIFIED</Stamp>
            </SchemaStamp>
          </SchemaDiagram>
        </ScrollReveal>

        <ScrollReveal>
          <div style={{ textAlign: 'center', marginTop: theme.spacing[7] }}>
            <Button $variant="secondary" as={Link} to="/schema" style={{ color: theme.colors.textInverse, borderColor: theme.colors.textInverse }}>
              READ THE FULL SCHEMA →
            </Button>
          </div>
        </ScrollReveal>
      </SchemaSection>

      {/* ─── CTA ─── */}
      <CTASection>
        <CTAContent>
          <ScrollReveal>
            <CTATitle>START YOUR CASE FILE</CTATitle>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <CTABody>
              The Hanford Site is waiting. The vaults are open. The dosimeters are reading. Assemble your team, pick your entities, and log what survives.
            </CTABody>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <CTAButtonRow>
              <Button $variant="primary" as={Link} to="/session">ENTER THE SESSION</Button>
              <Button $variant="secondary" as={Link} to="/archive">VIEW THE ARCHIVE</Button>
            </CTAButtonRow>
          </ScrollReveal>
          <CTARustLine />
          <CTATrefoil viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C10.5 5 8 8 8 12C8 14.5 9.5 16.5 12 17.5V14C11 13.5 10.5 12.5 10.5 11.5C10.5 9.5 11.5 7.5 12 6C12.5 7.5 13.5 9.5 13.5 11.5C13.5 12.5 13 13.5 12 14V17.5C14.5 16.5 16 14.5 16 12C16 8 13.5 5 12 2Z" />
          </CTATrefoil>
        </CTAContent>
        <CTAFooterStamp>
          <Stamp $color="declassified" $rotation={3}>DECLASSIFIED // PERMANENT RECORD</Stamp>
        </CTAFooterStamp>
      </CTASection>
    </>
  );
}
