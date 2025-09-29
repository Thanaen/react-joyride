import React, { useEffect, useRef, useState } from 'react';

import Joyride from '~/index';
import { SelectorOrElement } from '~/types';

import { cleanup, render, screen } from '../__fixtures__/test-utils';

const CUSTOM_PORTAL_ID = 'custom-portal';
const TARGET_ID = 'portal-target';

type RectConfig = {
  height?: number;
  left: number;
  top: number;
  width?: number;
};

function createRect({ height = 0, left, top, width = 0 }: RectConfig) {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    toJSON() {
      return this;
    },
    top,
    width,
    x: left,
    y: top,
  } as DOMRect;
}

function PortalFixture({ usePortalElementRef = false }: { usePortalElementRef?: boolean }) {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [portalElement, setPortalElement] = useState<SelectorOrElement>(
    usePortalElementRef ? null : `#${CUSTOM_PORTAL_ID}`,
  );

  useEffect(() => {
    if (usePortalElementRef && portalRef.current) {
      setPortalElement(portalRef.current);
    }
  }, [usePortalElementRef]);

  const steps = [
    {
      content: 'Portal spotlight',
      disableBeacon: true,
      floaterProps: {
        portalElement: `#${CUSTOM_PORTAL_ID}`,
      },
      spotlightPadding: 0,
      target: `#${TARGET_ID}`,
    },
  ];

  return (
    <div style={{ position: 'relative', top: 100, left: 80 }}>
      <div
        id="scroll-parent"
        style={{
          border: '1px solid transparent',
          maxHeight: 400,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <button id={TARGET_ID} type="button">
          Target
        </button>
        <div ref={portalRef} id={CUSTOM_PORTAL_ID} />
      </div>
      {portalElement && (
        <Joyride
          disableOverlayClose
          disableScrolling
          floaterProps={{ portalElement: `#${CUSTOM_PORTAL_ID}` }}
          portalElement={portalElement}
          run
          spotlightPadding={0}
          steps={steps}
        />
      )}
    </div>
  );
}

describe('Joyride > portalElement', () => {
  const portalRect = createRect({ top: 120, left: 80, width: 400, height: 400 });
  const targetRect = createRect({ top: 300, left: 160, width: 120, height: 40 });
  const defaultRect = createRect({ top: 0, left: 0 });
  let boundingClientRectMock: ReturnType<typeof vi.spyOn>;
  let originalScrollingElement: Element | null | undefined;

  beforeEach(() => {
    originalScrollingElement = document.scrollingElement;
    Object.defineProperty(document, 'scrollingElement', {
      configurable: true,
      value: document.documentElement,
    });

    boundingClientRectMock = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function mockGetBoundingClientRect(this: HTMLElement) {
        if (this.id === CUSTOM_PORTAL_ID) {
          return portalRect;
        }

        if (this.id === TARGET_ID) {
          return targetRect;
        }

        return defaultRect;
      });
  });

  afterEach(() => {
    cleanup();
    boundingClientRectMock.mockRestore();
    Object.defineProperty(document, 'scrollingElement', {
      configurable: true,
      value: originalScrollingElement,
    });
  });

  it('positions spotlight relative to portal selector', async () => {
    render(<PortalFixture />);

    const spotlight = await screen.findByTestId('spotlight');

    expect(spotlight.style.top).toBe('180px');
    expect(spotlight.style.left).toBe('80px');
  });

  it('positions spotlight relative to portal element reference', async () => {
    render(<PortalFixture usePortalElementRef />);

    const spotlight = await screen.findByTestId('spotlight');

    expect(spotlight.style.top).toBe('180px');
    expect(spotlight.style.left).toBe('80px');
  });
});
