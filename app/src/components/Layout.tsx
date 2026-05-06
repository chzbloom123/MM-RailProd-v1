import { useEffect } from 'react';
import styled from 'styled-components';
import Lenis from 'lenis';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PaperTexture } from './PaperTexture';

const LayoutContainer = styled.div`
  position: relative;
  z-index: 10;
`;

const Main = styled.main`
  position: relative;
  z-index: 10;
`;

export function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <PaperTexture />
      <LayoutContainer>
        <Navbar />
        <Main>{children}</Main>
        <Footer />
      </LayoutContainer>
    </>
  );
}
