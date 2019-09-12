export class Function {
  name: string;

  constructor(id: number, name: string){
    this.name = name;
  }

  getName(){
    return this.name;
  }
}


export class Shutter extends  Function{

  kind: string;
  type: string;
  dmxMin: number;
  dmxMax: number;


}


export class Strobe extends  Function{

  kind: string;
  type: string;
  dmxMin: number;
  dmxMax: number;


}

export class Dimmer extends  Function{

  kind: string;
  type: string;
  dmxMin: number;
  dmxMax: number;


}

export class Zoom extends  Function{

  kind: string;
  type: string;
  dmxMin: number;
  dmxMax: number;


}

export class Focus extends  Function{

  kind: string;
  type: string;
  dmxMin: number;
  dmxMax: number;


}
