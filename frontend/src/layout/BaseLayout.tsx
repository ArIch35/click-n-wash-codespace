import { AppShell, Overlay, Transition, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode, useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import { sizes } from '../utils/constants';
import Header from './Header/Header';

const BaseLayout = ({ children }: { children: ReactNode }) => {
  const [navbarOpened, navbarHandlers] = useDisclosure();
  const [visible, setVisible] = useState(false);

  const scaleX = {
    in: { opacity: 1, transform: 'scaleX(1)' },
    out: { opacity: 0, transform: 'scaleX(0)' },
    common: { transformOrigin: 'left' },
    transitionProperty: 'transform, opacity',
  };

  return (
    <AppShell>
      <AppShell.Header h={sizes.headerHeight}>
        <Header toggle={navbarHandlers.open} setVisible={setVisible} />
      </AppShell.Header>

      <AppShell.Main pt={sizes.headerHeight} h={`calc(100vh - ${rem(sizes.headerHeight)})`}>
        {children}
        {visible && (
          <Overlay
            zIndex={101}
            opacity={0.4}
            blur={1}
            onClick={(event) => {
              event.preventDefault();
              navbarHandlers.close();
              setVisible(false);
            }}
          />
        )}
      </AppShell.Main>

      <AppShell.Navbar>
        <div style={{ position: 'absolute', zIndex: 1000 }}>
          <Transition
            mounted={navbarOpened}
            transition={scaleX}
            timingFunction="ease"
            keepMounted
            duration={200}
          >
            {(transitionStyle) => (
              <div style={transitionStyle}>
                <Navbar toggle={navbarHandlers.close} setVisible={setVisible} />
              </div>
            )}
          </Transition>
        </div>
      </AppShell.Navbar>
    </AppShell>
  );
};

export default BaseLayout;
