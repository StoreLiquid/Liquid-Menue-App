export type CategoryType = '10ml' | '60ml' | '120ml';

export interface Liquid {
  id: string;
  herstellerId: string;
  sorte: string;
  hersteller: string; // Name des Herstellers (für Anzeige)
  kategorie: CategoryType | string;
  nikotin?: string;
  fuellmenge?: string;
  preis?: string;
  tags: string[];
  bildUrl?: string | null;
}

export interface Manufacturer {
  id: string;
  name: string;
  bildUrl?: string;
  kategorien: (CategoryType | string)[];
}

export type Hersteller = Manufacturer;

export interface CategoryButtonsProps {
  selectedCategory: CategoryType | string | null;
  onCategoryChange: (category: CategoryType | string | null) => void;
}

export interface SearchbarProps {
  onSearch: (term: string) => void;
  initialValue?: string;
}

export interface ManufacturerGridProps {
  hersteller: Manufacturer[];
  selectedCategory: CategoryType | string | null;
  onManufacturerClick: (manufacturerId: string) => void;
  selectedManufacturer: string | null;
}

export interface ProductListProps {
  liquids: Liquid[];
  manufacturerId: string | null;
  selectedCategory: CategoryType | string | null;
  selectedTags: string[];
}

export interface TagsFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
} 