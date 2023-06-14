import { Supplier } from "./supplier";

  
  export interface Package {
    id: number;
    heightCm: number;
    widthCm: number;
    weightKg: number;
    state: string;
    lat: number;
    lon: number;
    description: string;
    supplier?: Supplier;
  }
  