export class Ddf {
  version: number;
  type: string;
  category: string;
  imageHash?: string;
  manufacturer: string;
  model: string;
  author: string;
  createDate: string;
  powerConsumption: string;
  ressourceConsumption: string;
  comment: string;
  power: string;
  dmxSum: number;
  dmxUsedSum: number;
  panTiltInvert: boolean;
  standardDevice: string;


  effects: Effect[];
}

export class Effect{
  //checked: boolean;
  mainGroup: string;
  subgroup?: string;
  mode?: string;
  dmxChannels?: number;
  color: string;
  gobo: string;
  type?: string;
  unit?: string;
  dmxVal?: number;
  dmxMin?: number;
  dmxMax?: number;
  dmxReal?: string;
  realMin?: number;
  realMax?: number;
  speed?: number;
  hlVal?: number;
  hlValSpot?: number;
  energyVal?: number;
  fuelVal?: number;

  constructor(){
    this.mainGroup = '';
    this.subgroup = '';
    this.mode = '';
    this.dmxChannels = 0;
    this.type = '';
    this.unit = '';
  }

  selectedGroup?: string;
  selectedSubgroup?: string;
  selectedType?: string;
}

export class DeviceType{

  name: string;
  groups: Map<string, Map<string, string[]>> = new Map([
    ['', new Map([
      ['',['']]
    ])]
  ])
  mode: Map<string, string[]>;
  //subgroups: Map<string,string[]>;
  type: string[];
  standardDevice: string[];

  constructor(name: string, groups: Map<string, Map<string,string[]>>){
    this.name = name;
    this.groups = groups;
  }

  stepArray = ['on','off','open','close','color','splitcolor','gobo','prisma','macro','mod'];
  stepRangeArray = ['rotation','gobo shake','pulsation','rotation position','random'];
  rangeArray = ['linear','log','s-curve','circ','ptp','lin'];

}
