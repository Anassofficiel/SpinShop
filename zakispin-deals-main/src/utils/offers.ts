const OFFER_STORAGE_KEY = 'spinshop_offer';

export interface WheelSector {
  id: number;
  label: string;
  type: 'discount' | 'retry' | 'none' | 'shipping' | 'gift';
  value: number;
  color: string;
}

export const WHEEL_SECTORS: WheelSector[] = [
  { id: 1, label: '-10%', type: 'discount', value: 10, color: '#2563eb' },
  { id: 2, label: 'RETRY', type: 'retry', value: 0, color: '#14b8a6' },
  { id: 3, label: '-30%', type: 'discount', value: 30, color: '#f59e0b' },
  { id: 4, label: 'BAD LUCK', type: 'none', value: 0, color: '#ef4444' },
  { id: 5, label: 'FREE SHIPPING', type: 'shipping', value: 0, color: '#8b5cf6' },
  { id: 6, label: 'GIFT', type: 'gift', value: 0, color: '#ec4899' },
];

export interface Offer {
  type: 'discount' | 'shipping' | 'gift' | 'retry' | 'none';
  value: number;
  label: string;
  expiresAt?: number;
}

export const saveOffer = (offer: Offer) => {
  const offerData = {
    ...offer,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  };
  localStorage.setItem(OFFER_STORAGE_KEY, JSON.stringify(offerData));
};

export const getOffer = (): Offer | null => {
  try {
    const stored = localStorage.getItem(OFFER_STORAGE_KEY);
    if (!stored) return null;
    
    const offer = JSON.parse(stored);
    if (offer.expiresAt && Date.now() > offer.expiresAt) {
      localStorage.removeItem(OFFER_STORAGE_KEY);
      return null;
    }
    
    return offer;
  } catch {
    return null;
  }
};

export const clearOffer = () => {
  localStorage.removeItem(OFFER_STORAGE_KEY);
};

export const getOfferTimeRemaining = (): number => {
  const offer = getOffer();
  if (!offer || !offer.expiresAt) return 0;
  
  const remaining = offer.expiresAt - Date.now();
  return Math.max(0, remaining);
};
