import { useEffect, useState } from 'react';

import { PORTAL_ELEMENT_ID } from '~/literals';

import { SelectorOrElement } from '~/types';

export function usePortalElement(portalElement?: SelectorOrElement) {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (portalElement) {
      if (typeof portalElement === 'string') {
        const portal = document.querySelector(portalElement);

        if (portal) {
          setElement(portal as HTMLElement);
        }
      } else {
        setElement(portalElement);
      }
    } else {
      const portal = document.createElement('div');

      portal.id = PORTAL_ELEMENT_ID;

      document.body.appendChild(portal);
      setElement(portal);
    }

    return () => {
      if (!portalElement) {
        const existingPortal = document.getElementById(PORTAL_ELEMENT_ID);

        if (existingPortal && existingPortal.parentNode === document.body) {
          document.body.removeChild(existingPortal);
        }
      }
    };
  }, [portalElement]);

  return element as HTMLElement;
}
