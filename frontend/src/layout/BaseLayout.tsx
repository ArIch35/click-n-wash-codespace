import { useDisclosure } from '@mantine/hooks';
import { AppShell, Overlay, Transition } from '@mantine/core';
import { ReactNode, useState } from 'react';
import Header from './Header/Header';
import Navbar from '../components/navbar/Navbar';

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
      <AppShell.Header zIndex={0}>
        <Header toggle={navbarHandlers.open} setVisible={setVisible} />
      </AppShell.Header>

      <AppShell.Main>
        <div style={{ position: 'absolute', zIndex: 10 }}>
          <Transition
            mounted={navbarOpened}
            transition={scaleX}
            timingFunction="ease"
            keepMounted
            duration={200}
          >
            {(transitionStyle) => (
              <div style={transitionStyle}>
                <Navbar />
              </div>
            )}
          </Transition>
        </div>

        <div style={{ paddingTop: '45px', height: '100vh', zIndex: 0 }}>
          {children}
          {visible && (
            <Overlay
              zIndex={1}
              opacity={0.4}
              blur={1}
              onClick={(event) => {
                event.preventDefault();
                navbarHandlers.close();
                setVisible(false);
              }}
            />
          )}
        </div>
      </AppShell.Main>
    </AppShell>
  );
};

export default BaseLayout;
