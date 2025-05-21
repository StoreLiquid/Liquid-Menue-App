import { Liquid, Hersteller, CategoryType } from '../types';

export const hersteller: Hersteller[] = [
  {
    id: 'dr-frost',
    name: 'Dr. Frost',
    bildUrl: 'https://example.com/dr-frost.jpg',
    kategorien: ['10ml', '60ml']
  },
  {
    id: 'dinner-lady',
    name: 'Dinner Lady',
    bildUrl: 'https://example.com/dinner-lady.jpg',
    kategorien: ['10ml', '60ml', '120ml']
  },
  {
    id: 'vampire-vape',
    name: 'Vampire Vape',
    bildUrl: 'https://example.com/vampire-vape.jpg',
    kategorien: ['10ml']
  },
  {
    id: 'riot-squad',
    name: 'Riot Squad',
    bildUrl: 'https://example.com/riot-squad.jpg',
    kategorien: ['60ml', '120ml']
  }
];

export const liquids: Liquid[] = [
  {
    id: '1',
    herstellerId: 'dr-frost',
    hersteller: 'Dr. Frost',
    sorte: 'Polar Ice',
    nikotin: '20 mg Nikotinsalz',
    fuellmenge: '10 ml',
    preis: '6,90 €',
    tags: ['Kalt', 'Minze'],
    kategorie: '10ml'
  },
  {
    id: '2',
    herstellerId: 'dr-frost',
    hersteller: 'Dr. Frost',
    sorte: 'Strawberry Ice',
    nikotin: '20 mg Nikotinsalz',
    fuellmenge: '10 ml',
    preis: '6,90 €',
    tags: ['Kalt', 'Fruchtig', 'Süß'],
    kategorie: '10ml'
  },
  {
    id: '3',
    herstellerId: 'dinner-lady',
    hersteller: 'Dinner Lady',
    sorte: 'Lemon Tart',
    nikotin: 'Nikotinshot nötig',
    fuellmenge: '60 ml',
    preis: '24,90 €',
    tags: ['Süß', 'Dessert'],
    kategorie: '60ml'
  },
  {
    id: '4',
    herstellerId: 'vampire-vape',
    hersteller: 'Vampire Vape',
    sorte: 'Heisenberg',
    nikotin: '18 mg',
    fuellmenge: '10 ml',
    preis: '5,90 €',
    tags: ['Kalt', 'Fruchtig'],
    kategorie: '10ml'
  },
  {
    id: '5',
    herstellerId: 'riot-squad',
    hersteller: 'Riot Squad',
    sorte: 'Tropical Fury',
    nikotin: 'Nikotinshot nötig',
    fuellmenge: '120 ml',
    preis: '32,90 €',
    tags: ['Fruchtig', 'Süß'],
    kategorie: '120ml'
  }
]; 