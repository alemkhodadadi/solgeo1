export type User = {
  id: number
  username: string
  password: string
}

export type Instrument = {
  id: number
  type: string
  model: string
}

export type Data = {
  users: User[]
  projects: Project[]
}


// models/Project.ts
export interface Project {
  _id: string
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  installDate: string
  sensorCount: number
  images: Image[]
  sensors: Sensor[]
  parameters: Parameter[]
  stats: Stats
  dimensions: Record<string, string> // string:string key-value pairs
  projects: Project[]
}

// models/Image.ts
export interface Image {
  _id: string
  contentType: string
  url: string
}

// models/Sensor.ts
export interface Sensor {
  eui: string
  type: string
  rev: string
  signalQuality: number
  online: boolean
  position: {
    x: number
    y: number
  }
  userConfig: {
    name: string
    color: string
    sampleRate: number
    alertThresholdTheta: number
    alertThresholdPhi: number
    channelNumber: number
    alerts: SensorAlert[]
  }
  stats: {
    lastTX: string
  }
}

export interface SensorAlert {
  level: number
  onTheta: boolean
  onPhi: boolean
}

// models/Parameter.ts
export interface Parameter {
  name: string
  mesUnit: string | null
  mesUnitKey: string | null
  mesUnitGroupName: string | null
  rootMesUnit: string | null
  valueFormat: 'float64' | 'string' | 'int' | string
}

// models/Stats.ts
export interface Stats {
  device: { online: number; offline: number }
  gateway: { online: number; offline: number }
  alert: {
    totalStats: { count: number }
    statsPerLevel: { level: number; count: number }[]
  }
}

// models/MeasurementGroup.ts
export interface MeasurementGroup {
  category: string
  name: string
  mesUnits: {
    name: string
    label: string
  }[]
}
