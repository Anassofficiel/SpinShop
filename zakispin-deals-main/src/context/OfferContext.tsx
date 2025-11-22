import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  getOffer,
  saveOffer,
  clearOffer,
  getOfferTimeRemaining,
} from '../utils/offers';

export interface Offer {
  type: 'discount' | 'shipping' | 'gift' | 'retry' | 'none';
  value: number;
  label: string;
}

interface OfferContextType {
  currentOffer: Offer | null;
  timeRemaining: number;
  applyOffer: (offer: Offer) => void;
  removeOffer: () => void;
  getDiscount: () => number;
  hasFreeShipping: () => boolean;
  hasGift: () => boolean;
}

const OfferContext = createContext<OfferContextType | undefined>(undefined);

export const useOffer = () => {
  const context = useContext(OfferContext);
  if (!context) {
    throw new Error('useOffer must be used within OfferProvider');
  }
  return context;
};

export const OfferProvider = ({ children }: { children: ReactNode }) => {
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const offer = getOffer();
    if (offer) {
      setCurrentOffer(offer);
      setTimeRemaining(getOfferTimeRemaining());
    }
  }, []);

  useEffect(() => {
    if (!currentOffer) return;

    const interval = setInterval(() => {
      const remaining = getOfferTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining === 0) {
        setCurrentOffer(null);
        clearOffer();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentOffer]);

  const applyOffer = (offer: Offer) => {
    saveOffer(offer);
    setCurrentOffer(offer);
    setTimeRemaining(getOfferTimeRemaining());
  };

  const removeOffer = () => {
    clearOffer();
    setCurrentOffer(null);
    setTimeRemaining(0);
  };

  const getDiscount = () => {
    if (!currentOffer || currentOffer.type !== 'discount') return 0;
    return currentOffer.value;
  };

  const hasFreeShipping = () => currentOffer?.type === 'shipping';

  const hasGift = () => currentOffer?.type === 'gift';

  return (
    <OfferContext.Provider
      value={{
        currentOffer,
        timeRemaining,
        applyOffer,
        removeOffer,
        getDiscount,
        hasFreeShipping,
        hasGift,
      }}
    >
      {children}
    </OfferContext.Provider>
  );
};
