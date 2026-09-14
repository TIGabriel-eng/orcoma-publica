export type SectorType = 'publico' | 'privado' | 'terceiro-setor' | 'saude';

export interface ServiceItem {
  id: SectorType;
  title: string;
  tag: string;
  subtitle: string;
  icon: string;
  description: string;
  features: string[];
  targetAudience: string;
  badge: string;
}

export interface Differential {
  id: string;
  title: string;
  icon: string;
  description: string;
  highlight: string;
  items?: string[];
}

export interface UnitItem {
  id: string;
  city: string;
  state: string;
  role: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  isMatriz?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  sector: SectorType | 'outro';
  organization: string;
  unit: string;
  message: string;
}

