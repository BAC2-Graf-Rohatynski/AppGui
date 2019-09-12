export class Slave {
  ssid: number = -1;
  groups: string[] = [];
  activeShow: string;
  macAddress: string;
  macAddressTemporary: string;
  ipAddress: string;
  ddfHash: string;
  imagesHash: string;
  status: string;
  type: string;
  device: string;
  manufacturer: string;
  univers: string;
  hls: string;
  dmxChannels: number = 0;
  startDmxAddress: number = 0;
  endDmxAddress: number = 0;
  udpPort: number = 0;
  isRotating: boolean = false;
  positionX: number = 0;
  positionY: number = 0;
  positionZ: number = 0;
  rotationX: number = 0;
  rotationY: number = 0;
  rotationZ: number = 0;
  accelerationX: number = 0;
  accelerationY: number = 0;
  accelerationZ: number = 0;
  ddfId: number = 0;
}
