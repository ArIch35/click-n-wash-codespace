import { AppShell, Box, Overlay, Transition } from '@mantine/core';
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
      <AppShell.Header zIndex={0} h={sizes.headerHeight}>
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
                <Navbar toggle={navbarHandlers.close} setVisible={setVisible} />
              </div>
            )}
          </Transition>
        </div>

        <Box pt={sizes.headerHeight} style={{ height: '100vh', zIndex: 0 }}>
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
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default BaseLayout;
