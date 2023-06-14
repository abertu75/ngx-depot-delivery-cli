import { Package } from "./package";

export interface Order {
    id: number
    state: string;
    date: string;
    stateUpdateDate: string;
    packages: Package[];
  }
