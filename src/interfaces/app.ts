export interface IProject {
  _id: string;
  name: string;
  address?: string;
  userId?: number;
  description?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  installDate?: string; // ISO date
  images?: any[];        // Replace `any` if image structure is known
  sensors?: any[];
  parameters?: any[];
  stats?: {
    device?: {
      online?: number;
      offline?: number;
    };
    gateway?: {
      online?: number;
      offline?: number;
    };
    alert?: {
      totalStats?: {
        count?: number;
      };
      statsPerLevel?: {
        level?: number;
        count?: number;
      }[];
    };
  };
  dimensions?: {
    temperature?: 'celsius' | 'fahrenheit';
  };
  sensorCount?: number;
  projects?: IProject[]
}

export interface IInstrument {
  id: string;
  type: string;             // e.g., "accelerometer", "geophone"
  model: string;
  serialNumber: string;
  installedAt: string;      // ISO timestamp
  lastCalibration?: string; // Optional ISO date
  status: 'online' | 'offline' | 'maintenance';
}

export interface ILoadingProjectStatus { id: string; status: boolean };

export interface IProjectTreeNode {
  key: string;
  label: string;
  children?: IProjectTreeNode[];
}

export interface IMainRoute {
		name: string,
		route: string
}