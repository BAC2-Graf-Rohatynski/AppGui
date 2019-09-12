import { Injectable } from '@angular/core';
import {DeviceType} from "./ddf";

@Injectable({
  providedIn: 'root'
})
export class DeviceTypeService {

  deviceTypes: DeviceType[] = [];

  constructor() {
    this.initDmxDevice();
    this.initMatrixDevice();
    this.initEffect();
    this.initLaser();
    this.initIldaLaser();
    this.initDmxMedia()
  }

  initDmxDevice() {
    //general Modes
    let linearScurveLogMode: string[] = ['linear', 'S-Curve (-9)','S-Curve (-8)','S-Curve (-7)','S-Curve (-6)',
      'S-Curve (-5)','S-Curve (-4)','S-Curve (-3)','S-Curve (-2)','S-Curve (-1)','S-Curve (0)',
      'S-Curve (1)','S-Curve (2)','S-Curve (3)','S-Curve (4)','S-Curve (5)',
      'S-Curve (6)','S-Curve (7)','S-Curve (8)','S-Curve (9)', 'log'];
    let openCloseMode: string[] = ['open', 'close'];
    let macroRandomMode: string[] = ['Macro', 'Random'];

    //Position Modes
    let circPtpLinMode: string[] = ['CIRC', 'PTP', 'LIN'];
    let offMode: string[] = ['OFF'];
    let modMode: string[] = ['Mod'];
    let macroMode: string[] = ['Macro'];

    //Color Modes
    let openColorRotationMode: string[] = ['open', 'color', 'rotation'];
    let splitcolorMode: string[] =['splitcolor'];

    //Beam Modes
    let rotationPosLinearMode: string[] = ['rotation position', 'linear'];
    let rotationMode: string[] = ['rotation'];
    let openGoboGoboShakeMode: string[] = ['Open', 'Gobo', 'Gobo Shake'];

    //Control Mode
    let controlMode: string[] = ['Pan/Tilt Reset', 'Gobo Reset', 'Color Reset', 'Beam Reset', 'Effect Reset', 'Complete Reset'];

    //subGroups
    let intensitySubMap = new Map([
      ['Intensity', linearScurveLogMode],
      ['V-Intensity', linearScurveLogMode],
      ['Aura', linearScurveLogMode],
      ['Shutter',openCloseMode],
      ['Strob', linearScurveLogMode.concat(openCloseMode,macroRandomMode)],
      ['Pulsation', linearScurveLogMode.concat(openCloseMode,macroRandomMode)]
    ]);

    let positionSubMap = new Map([
      ['Pan(x)', circPtpLinMode],
      ['Tilt(x)', circPtpLinMode],
      ['Pan - Tilt Time', linearScurveLogMode],
      ['Pan - Tilt Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Position Blink', offMode.concat(linearScurveLogMode,modMode)]
    ]);

    let colorSubMap = new Map([
      ['LED R', linearScurveLogMode],
      ['LED G', linearScurveLogMode],
      ['LED B', linearScurveLogMode],
      ['LED W', linearScurveLogMode],
      ['LED WW', linearScurveLogMode],
      ['LED CW', linearScurveLogMode],
      ['LED  A', linearScurveLogMode],
      ['LED U', linearScurveLogMode],
      ['LED Cyan', linearScurveLogMode],
      ['Magenta', linearScurveLogMode],
      ['Yellow', linearScurveLogMode],
      ['HSV-H', linearScurveLogMode],
      ['HSV-s', linearScurveLogMode],
      ['CTB Wheel', openColorRotationMode],
      ['CTO Wheel', openColorRotationMode],
      ['CTO Wheel (x)', openColorRotationMode.concat(splitcolorMode)],
      ['Color Time',linearScurveLogMode.concat(macroMode)],
      ['Color Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Aura LED R', linearScurveLogMode],
      ['Aura LED G', linearScurveLogMode],
      ['Aura LED B', linearScurveLogMode],
      ['Aura LED W', linearScurveLogMode],
      ['Aura LED WW', linearScurveLogMode],
      ['Aura LED CW', linearScurveLogMode],
      ['Aura LED A', linearScurveLogMode],
      ['Aura LED U', linearScurveLogMode],
      ['Aura Cyan', linearScurveLogMode],
      ['Aura Magenta', linearScurveLogMode],
      ['Aura Yellow', linearScurveLogMode]
    ]);

    let beamSubMap = new Map([
      ['Gobo Wheel(x)', openGoboGoboShakeMode.concat(rotationMode)],
      ['Gobo Rotation', rotationMode.concat(rotationPosLinearMode)],
      ['Gobo Time', linearScurveLogMode.concat(macroMode)],
      ['Gobo Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Focus', linearScurveLogMode],
      ['Frost', offMode.concat("on",linearScurveLogMode)],
      ['Zoom', linearScurveLogMode],
      ['Zoom Macro', offMode.concat(macroMode)],
      ['Zoom Time', linearScurveLogMode.concat(macroMode)],
      ['Iris', linearScurveLogMode],
      ['Iris Mode', offMode.concat(macroMode,modMode)],
      ['Prism Insertion', offMode.concat('Prisma')],
      ['Prism Rotation', rotationMode.concat(rotationPosLinearMode)]
    ]);

    let effectSubMap = new Map([
      ['Animation', rotationMode.concat('open','animation')],
      ['Animation Rotation', rotationMode.concat(rotationPosLinearMode)],
      ['Animation Mode', offMode.concat(macroMode)],
      ['Animation Speed', linearScurveLogMode.concat(macroMode)],
      ['Animation Control', []],
      ['Animation Offset', []],
      ['Animation Macro', []],
      ['Macro Effects', []]
    ]);

    let controlSubMap = new Map([
      ['Lamp ON/OFF', offMode.concat('on')],
      ['Reset', controlMode],
      ['Autofocus ', []],
      ['Background Select', []],
      ['Shape Transition', []],
      ['Shape Fade', []]
    ]);

    //Groups
    let groupMap = new Map([
      ['Intensity', intensitySubMap],
      ['Position', positionSubMap],
      ['Color', colorSubMap],
      ['Beam', beamSubMap],
      ['Effect', effectSubMap],
      ['Control', controlSubMap]

    ]);

    //Mode
    let stepType = ['ON', 'OFF', 'open', 'close', 'color', 'splitcolor', 'Gobo', 'Prisma', 'Macro Mode'];
    let stepRangeType = ['Rotation', 'Gobo shake', 'Rotate Position', 'Random'];

    let typeMap = new Map([
      ['step', stepType],
      ['step/range', stepRangeType]
    ])

    //standard Device
    let standardDevice = ['Dimmer', 'LED Par', 'Effekt Par', 'Linsen Scheinwerfer', 'Blinder', 'Fluter', 'Strob', 'MH Spot', 'MH Beam', 'MH Wash', 'Scanner'];

    let dmxDevice: DeviceType = new DeviceType('DMX Device', groupMap);
    console.log(dmxDevice);
    dmxDevice.mode = typeMap;
    dmxDevice.standardDevice = standardDevice;
    dmxDevice.groups.delete('Matrix');
    this.deviceTypes.push(dmxDevice);
    console.log(dmxDevice);

    console.log("service");
    console.log(this.deviceTypes);
  }

  initMatrixDevice() {
    //general Modes
    let linearScurveLogMode: string[] = ['linear', 'S-Curve (-9)','S-Curve (-8)','S-Curve (-7)','S-Curve (-6)',
      'S-Curve (-5)','S-Curve (-4)','S-Curve (-3)','S-Curve (-2)','S-Curve (-1)','S-Curve (0)',
      'S-Curve (1)','S-Curve (2)','S-Curve (3)','S-Curve (4)','S-Curve (5)',
      'S-Curve (6)','S-Curve (7)','S-Curve (8)','S-Curve (9)', 'log'];
    let openCloseMode: string[] = ['open', 'close'];
    let macroRandomMode: string[] = ['Macro', 'Random'];

    //Position Modes
    let circPtpLinMode: string[] = ['CIRC', 'PTP', 'LIN'];
    let offMode: string[] = ['OFF'];
    let modMode: string[] = ['Mod'];
    let macroMode: string[] = ['Macro'];

    //Color Modes
    let openColorRotationMode: string[] = ['open', 'color', 'rotation'];
    let splitcolorMode: string[] =['splitcolor'];

    //Beam Modes
    let rotationPosLinearMode: string[] = ['rotation position', 'linear'];
    let rotationMode: string[] = ['rotation'];
    let openGoboGoboShakeMode: string[] = ['Open', 'Gobo', 'Gobo Shake'];

    //Control Mode
    let controlMode: string[] = ['Pan/Tilt Reset', 'Gobo Reset', 'Color Reset', 'Beam Reset', 'Effect Reset', 'Complete Reset'];

    //subGroups
    let intensitySubMap = new Map([
      ['Intensity', linearScurveLogMode],
      ['V-Intensity', linearScurveLogMode],
      ['Aura', linearScurveLogMode],
      ['Shutter',openCloseMode],
      ['Strob', linearScurveLogMode.concat(openCloseMode,macroRandomMode)],
      ['Pulsation', linearScurveLogMode.concat(openCloseMode,macroRandomMode)]
    ]);

    let positionSubMap = new Map([
      ['Pan(x)', circPtpLinMode],
      ['Tilt(x)', circPtpLinMode],
      ['Pan - Tilt Time', linearScurveLogMode],
      ['Pan - Tilt Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Position Blink', offMode.concat(linearScurveLogMode,modMode)]
    ]);

    let colorSubMap = new Map([
      ['LED R', linearScurveLogMode],
      ['LED G', linearScurveLogMode],
      ['LED B', linearScurveLogMode],
      ['LED W', linearScurveLogMode],
      ['LED WW', linearScurveLogMode],
      ['LED CW', linearScurveLogMode],
      ['LED  A', linearScurveLogMode],
      ['LED U', linearScurveLogMode],
      ['LED Cyan', linearScurveLogMode],
      ['Magenta', linearScurveLogMode],
      ['Yellow', linearScurveLogMode],
      ['HSV-H', linearScurveLogMode],
      ['HSV-s', linearScurveLogMode],
      ['CTB Wheel', openColorRotationMode],
      ['CTO Wheel', openColorRotationMode],
      ['CTO Wheel (x)', openColorRotationMode.concat(splitcolorMode)],
      ['Color Time',linearScurveLogMode.concat(macroMode)],
      ['Color Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Aura LED R', linearScurveLogMode],
      ['Aura LED G', linearScurveLogMode],
      ['Aura LED B', linearScurveLogMode],
      ['Aura LED W', linearScurveLogMode],
      ['Aura LED WW', linearScurveLogMode],
      ['Aura LED CW', linearScurveLogMode],
      ['Aura LED A', linearScurveLogMode],
      ['Aura LED U', linearScurveLogMode],
      ['Aura Cyan', linearScurveLogMode],
      ['Aura Magenta', linearScurveLogMode],
      ['Aura Yellow', linearScurveLogMode]
    ]);

    let beamSubMap = new Map([
      ['Gobo Wheel(x)', openGoboGoboShakeMode.concat(rotationMode)],
      ['Gobo Rotation', rotationMode.concat(rotationPosLinearMode)],
      ['Gobo Time', linearScurveLogMode.concat(macroMode)],
      ['Gobo Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Focus', linearScurveLogMode],
      ['Frost', offMode.concat("on",linearScurveLogMode)],
      ['Zoom', linearScurveLogMode],
      ['Zoom Macro', offMode.concat(macroMode)],
      ['Zoom Time', linearScurveLogMode.concat(macroMode)],
      ['Iris', linearScurveLogMode],
      ['Iris Mode', offMode.concat(macroMode,modMode)],
      ['Prism Insertion', offMode.concat('Prisma')],
      ['Prism Rotation', rotationMode.concat(rotationPosLinearMode)]
    ]);

    let effectSubMap = new Map([
      ['Animation', rotationMode.concat('open','animation')],
      ['Animation Rotation', rotationMode.concat(rotationPosLinearMode)],
      ['Animation Mode', offMode.concat(macroMode)],
      ['Animation Speed', linearScurveLogMode.concat(macroMode)],
      ['Animation Control', []],
      ['Animation Offset', []],
      ['Animation Macro', []],
      ['Macro Effects', []]
    ]);

    let controlSubMap = new Map([
      ['Lamp ON/OFF', offMode.concat('on')],
      ['Reset', controlMode],
      ['Autofocus ', []],
      ['Background Select', []],
      ['Shape Transition', []],
      ['Shape Fade', []]
    ]);

    //Groups
    let groupMap = new Map([
      ['Intensity', intensitySubMap],
      ['Position', positionSubMap],
      ['Color', colorSubMap],
      ['Beam', beamSubMap],
      ['Effect', effectSubMap],
      ['Matrix', controlSubMap],
      ['Control', controlSubMap]

    ]);

    //Mode
    let stepType = ['ON', 'OFF', 'open', 'close', 'color', 'splitcolor', 'Gobo', 'Prisma', 'Macro Mode'];
    let stepRangeType = ['Rotation', 'Gobo shake', 'Rotate Position', 'Random'];

    let typeMap = new Map([
      ['step', stepType],
      ['step/range', stepRangeType]
    ])

    //standard device
    let standardDevice = ['Stripes', 'LED Stripes', 'Blinder', 'Fluter', 'Panels', 'LED Panels', 'MH Matrix Spot', 'MH Matrix Beam', 'MH Matrix Wash', 'Deko', 'LED Floor'];

    let matrixDevice: DeviceType = new DeviceType('DMX Matrix Device', groupMap);
    matrixDevice.mode = typeMap;
    matrixDevice.standardDevice = standardDevice;
    this.deviceTypes.push(matrixDevice);
  }

  initEffect() {
    //general Modes
    let linearScurveLogMode: string[] = ['linear', 'S-Curve (-9)','S-Curve (-8)','S-Curve (-7)','S-Curve (-6)',
      'S-Curve (-5)','S-Curve (-4)','S-Curve (-3)','S-Curve (-2)','S-Curve (-1)','S-Curve (0)',
      'S-Curve (1)','S-Curve (2)','S-Curve (3)','S-Curve (4)','S-Curve (5)',
      'S-Curve (6)','S-Curve (7)','S-Curve (8)','S-Curve (9)', 'log'];
    let openCloseMode: string[] = ['open', 'close'];
    let macroRandomMode: string[] = ['Macro', 'Random'];

    //Position Modes
    let circPtpLinMode: string[] = ['CIRC', 'PTP', 'LIN'];
    let offMode: string[] = ['OFF'];
    let modMode: string[] = ['Mod'];
    let macroMode: string[] = ['Macro'];

    //Color Modes
    let openColorRotationMode: string[] = ['open', 'color', 'rotation'];
    let splitcolorMode: string[] =['splitcolor'];

    //Beam Modes
    let rotationPosLinearMode: string[] = ['rotation position', 'linear'];
    let rotationMode: string[] = ['rotation'];
    let openGoboGoboShakeMode: string[] = ['Open', 'Gobo', 'Gobo Shake'];

    //Control Mode
    let controlMode: string[] = ['Pan/Tilt Reset', 'Gobo Reset', 'Color Reset', 'Beam Reset', 'Effect Reset', 'Complete Reset'];

    //subGroups
    let intensitySubMap = new Map([
      ['Intensity', linearScurveLogMode],
      ['V-Intensity', linearScurveLogMode],
      ['Aura', linearScurveLogMode],
      ['Shutter',openCloseMode],
      ['Strob', linearScurveLogMode.concat(openCloseMode,macroRandomMode)],
      ['Pulsation', linearScurveLogMode.concat(openCloseMode,macroRandomMode)]
    ]);

    let positionSubMap = new Map([
      ['Pan(x)', circPtpLinMode],
      ['Tilt(x)', circPtpLinMode],
      ['Pan - Tilt Time', linearScurveLogMode],
      ['Pan - Tilt Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Position Blink', offMode.concat(linearScurveLogMode,modMode)]
    ]);


    let colorSubMap = new Map([
      ['LED R', linearScurveLogMode],
      ['LED G', linearScurveLogMode],
      ['LED B', linearScurveLogMode],
      ['LED W', linearScurveLogMode],
      ['LED WW', linearScurveLogMode],
      ['LED CW', linearScurveLogMode],
      ['LED  A', linearScurveLogMode],
      ['LED U', linearScurveLogMode],
      ['LED Cyan', linearScurveLogMode],
      ['Magenta', linearScurveLogMode],
      ['Yellow', linearScurveLogMode],
      ['HSV-H', linearScurveLogMode],
      ['HSV-s', linearScurveLogMode],
      ['CTB Wheel', openColorRotationMode],
      ['CTO Wheel', openColorRotationMode],
      ['CTO Wheel (x)', openColorRotationMode.concat(splitcolorMode)],
      ['Color Time',linearScurveLogMode.concat(macroMode)],
      ['Color Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Aura LED R', linearScurveLogMode],
      ['Aura LED G', linearScurveLogMode],
      ['Aura LED B', linearScurveLogMode],
      ['Aura LED W', linearScurveLogMode],
      ['Aura LED WW', linearScurveLogMode],
      ['Aura LED CW', linearScurveLogMode],
      ['Aura LED A', linearScurveLogMode],
      ['Aura LED U', linearScurveLogMode],
      ['Aura Cyan', linearScurveLogMode],
      ['Aura Magenta', linearScurveLogMode],
      ['Aura Yellow', linearScurveLogMode]
    ]);

    let beamSubMap = new Map([
      ['Gobo Wheel(x)', openGoboGoboShakeMode.concat(rotationMode)],
      ['Gobo Rotation', rotationMode.concat(rotationPosLinearMode)],
      ['Gobo Time', linearScurveLogMode.concat(macroMode)],
      ['Gobo Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Focus', linearScurveLogMode],
      ['Frost', offMode.concat("on",linearScurveLogMode)],
      ['Zoom', linearScurveLogMode],
      ['Zoom Macro', offMode.concat(macroMode)],
      ['Zoom Time', linearScurveLogMode.concat(macroMode)],
      ['Iris', linearScurveLogMode],
      ['Iris Mode', offMode.concat(macroMode,modMode)],
      ['Prism Insertion', offMode.concat('Prisma')],
      ['Prism Rotation', rotationMode.concat(rotationPosLinearMode)]
    ]);


    let effectSubMap = new Map([
      ['Animation', rotationMode.concat('open','animation')],
      ['Animation Rotation', rotationMode.concat(rotationPosLinearMode)],
      ['Animation Mode', offMode.concat(macroMode)],
      ['Animation Speed', linearScurveLogMode.concat(macroMode)],
      ['Animation Control', []],
      ['Animation Offset', []],
      ['Animation Macro', []],
      ['Macro Effects', []]
    ]);

    let controlSubMap = new Map([
      ['Lamp ON/OFF', offMode.concat('on')],
      ['Reset', controlMode],
      ['Autofocus ', []],
      ['Background Select', []],
      ['Shape Transition', []],
      ['Shape Fade', []]
    ]);

    //Groups
    let groupMap = new Map([
      ['Effect', effectSubMap],
      ['Control', controlSubMap]

    ]);

    //Mode
    let stepType = ['ON', 'OFF', 'open', 'close', 'color', 'splitcolor', 'Gobo', 'Prisma', 'Macro Mode'];
    let stepRangeType = ['Rotation', 'Gobo shake', 'Rotate Position', 'Random'];

    let typeMap = new Map([
      ['step', stepType],
      ['step/range', stepRangeType]
    ])

    //standard device
    let standardDevice = ['Fogger', 'Hazer', 'CO2', 'Confetti,', 'Disco', 'Kugel', 'Flame', 'Jets', 'Pyro', 'Lifte', 'Soap Bubble', 'Foam Machine', 'Pump'];

    let effect: DeviceType = new DeviceType('DMX Effect', groupMap);
    effect.mode = typeMap;
    effect.standardDevice = standardDevice;
    effect.groups.delete('Intensity');
    effect.groups.delete('Position');
    effect.groups.delete('Color');
    effect.groups.delete('Beam');
    effect.groups.delete('Matrix');
    this.deviceTypes.push(effect);
  }

  initLaser() {
    //general Modes
    let linearScurveLogMode: string[] = ['linear', 'S-Curve (-9)','S-Curve (-8)','S-Curve (-7)','S-Curve (-6)',
      'S-Curve (-5)','S-Curve (-4)','S-Curve (-3)','S-Curve (-2)','S-Curve (-1)','S-Curve (0)',
      'S-Curve (1)','S-Curve (2)','S-Curve (3)','S-Curve (4)','S-Curve (5)',
      'S-Curve (6)','S-Curve (7)','S-Curve (8)','S-Curve (9)', 'log'];
    let openCloseMode: string[] = ['open', 'close'];
    let macroRandomMode: string[] = ['Macro', 'Random'];

    //Position Modes
    let circPtpLinMode: string[] = ['CIRC', 'PTP', 'LIN'];
    let offMode: string[] = ['OFF'];
    let modMode: string[] = ['Mod'];
    let macroMode: string[] = ['Macro'];

    //Color Modes
    let openColorRotationMode: string[] = ['open', 'color', 'rotation'];
    let splitcolorMode: string[] =['splitcolor'];

    //Beam Modes
    let rotationPosLinearMode: string[] = ['rotation position', 'linear'];
    let rotationMode: string[] = ['rotation'];
    let openGoboGoboShakeMode: string[] = ['Open', 'Gobo', 'Gobo Shake'];

    //Control Mode
    let controlMode: string[] = ['Pan/Tilt Reset', 'Gobo Reset', 'Color Reset', 'Beam Reset', 'Effect Reset', 'Complete Reset'];

    //subGroups
    let intensitySubMap = new Map([
      ['Intensity', linearScurveLogMode],
      ['V-Intensity', linearScurveLogMode],
      ['Aura', linearScurveLogMode],
      ['Shutter',openCloseMode],
      ['Strob', linearScurveLogMode.concat(openCloseMode,macroRandomMode)],
      ['Pulsation', linearScurveLogMode.concat(openCloseMode,macroRandomMode)]
    ]);

    let positionSubMap = new Map([
      ['Pan(x)', circPtpLinMode],
      ['Tilt(x)', circPtpLinMode],
      ['Pan - Tilt Time', linearScurveLogMode],
      ['Pan - Tilt Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Position Blink', offMode.concat(linearScurveLogMode,modMode)]
    ]);

    let colorSubMap = new Map([
      ['LED R', linearScurveLogMode],
      ['LED G', linearScurveLogMode],
      ['LED B', linearScurveLogMode],
      ['LED W', linearScurveLogMode],
      ['LED WW', linearScurveLogMode],
      ['LED CW', linearScurveLogMode],
      ['LED  A', linearScurveLogMode],
      ['LED U', linearScurveLogMode],
      ['LED Cyan', linearScurveLogMode],
      ['Magenta', linearScurveLogMode],
      ['Yellow', linearScurveLogMode],
      ['HSV-H', linearScurveLogMode],
      ['HSV-s', linearScurveLogMode],
      ['CTB Wheel', openColorRotationMode],
      ['CTO Wheel', openColorRotationMode],
      ['CTO Wheel (x)', openColorRotationMode.concat(splitcolorMode)],
      ['Color Time',linearScurveLogMode.concat(macroMode)],
      ['Color Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Aura LED R', linearScurveLogMode],
      ['Aura LED G', linearScurveLogMode],
      ['Aura LED B', linearScurveLogMode],
      ['Aura LED W', linearScurveLogMode],
      ['Aura LED WW', linearScurveLogMode],
      ['Aura LED CW', linearScurveLogMode],
      ['Aura LED A', linearScurveLogMode],
      ['Aura LED U', linearScurveLogMode],
      ['Aura Cyan', linearScurveLogMode],
      ['Aura Magenta', linearScurveLogMode],
      ['Aura Yellow', linearScurveLogMode]
    ]);

    let beamSubMap = new Map([
      ['Gobo Wheel(x)', openGoboGoboShakeMode.concat(rotationMode)],
      ['Gobo Rotation', rotationMode.concat(rotationPosLinearMode)],
      ['Gobo Time', linearScurveLogMode.concat(macroMode)],
      ['Gobo Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Focus', linearScurveLogMode],
      ['Frost', offMode.concat("on",linearScurveLogMode)],
      ['Zoom', linearScurveLogMode],
      ['Zoom Macro', offMode.concat(macroMode)],
      ['Zoom Time', linearScurveLogMode.concat(macroMode)],
      ['Iris', linearScurveLogMode],
      ['Iris Mode', offMode.concat(macroMode,modMode)],
      ['Prism Insertion', offMode.concat('Prisma')],
      ['Prism Rotation', rotationMode.concat(rotationPosLinearMode)]
    ]);

    let effectSubMap = new Map([
      ['Animation', rotationMode.concat('open','animation')],
      ['Animation Rotation', rotationMode.concat(rotationPosLinearMode)],
      ['Animation Mode', offMode.concat(macroMode)],
      ['Animation Speed', linearScurveLogMode.concat(macroMode)],
      ['Animation Control', []],
      ['Animation Offset', []],
      ['Animation Macro', []],
      ['Macro Effects', []]
    ]);

    let controlSubMap = new Map([
      ['Lamp ON/OFF', offMode.concat('on')],
      ['Reset', controlMode],
      ['Autofocus ', []],
      ['Background Select', []],
      ['Shape Transition', []],
      ['Shape Fade', []]
    ]);

    //Groups
    let groupMap = new Map([
      ['Intensity', intensitySubMap],
      ['Position', positionSubMap],
      ['Color', colorSubMap],
      ['Beam', beamSubMap],
      ['Effect', effectSubMap],
      ['Control', controlSubMap]

    ]);

    //Mode
    let stepType = ['ON', 'OFF', 'open', 'close', 'color', 'splitcolor', 'Gobo', 'Prisma', 'Macro Mode'];
    let stepRangeType = ['Rotation', 'Gobo shake', 'Rotate Position', 'Random'];

    let typeMap = new Map([
      ['step', stepType],
      ['step/range', stepRangeType]
    ])

    //standard device
    let standardDevice = ['Laser PC'];

    let device: DeviceType = new DeviceType('DMX Laser', groupMap);
    device.mode = typeMap;
    device.standardDevice = standardDevice
    device.groups.delete('Matrix');
    this.deviceTypes.push(device);
  }

  initIldaLaser() {
    //general Modes
    let linearScurveLogMode: string[] = ['linear', 'S-Curve', 'log'];
    let openCloseMode: string[] = ['open', 'close'];
    let macroRandomMode: string[] = ['Macro', 'Random'];

    //Position Modes
    let circPtpLinMode: string[] = ['CIRC', 'PTP', 'LIN'];
    let offMode: string[] = ['OFF'];
    let modMode: string[] = ['Mod'];
    let macroMode: string[] = ['Macro'];

    //Color Modes
    let openColorRotationMode: string[] = ['open', 'color', 'rotation'];
    let splitcolorMode: string[] =['splitcolor'];

    //Beam Modes
    let rotationPosLinearMode: string[] = ['rotation position', 'linear'];
    let rotationMode: string[] = ['rotation'];
    let openGoboGoboShakeMode: string[] = ['Open', 'Gobo', 'Gobo Shake'];

    //Control Mode
    let controlMode: string[] = ['Pan/Tilt Reset', 'Gobo Reset', 'Color Reset', 'Beam Reset', 'Effect Reset', 'Complete Reset'];

    //subGroups
    let intensitySubMap = new Map([
      ['Intensity', linearScurveLogMode],
      ['V-Intensity', linearScurveLogMode],
      ['Aura', linearScurveLogMode],
      ['Shutter',openCloseMode],
      ['Strob', linearScurveLogMode.concat(openCloseMode,macroRandomMode)],
      ['Pulsation', linearScurveLogMode.concat(openCloseMode,macroRandomMode)]
    ]);

    let positionSubMap = new Map([
      ['Pan(x)', circPtpLinMode],
      ['Tilt(x)', circPtpLinMode],
      ['Pan - Tilt Time', linearScurveLogMode],
      ['Pan - Tilt Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Position Blink', offMode.concat(linearScurveLogMode,modMode)]
    ]);

    let colorSubMap = new Map([
      ['LED R', linearScurveLogMode],
      ['LED G', linearScurveLogMode],
      ['LED B', linearScurveLogMode],
      ['LED W', linearScurveLogMode],
      ['LED WW', linearScurveLogMode],
      ['LED CW', linearScurveLogMode],
      ['LED  A', linearScurveLogMode],
      ['LED U', linearScurveLogMode],
      ['LED Cyan', linearScurveLogMode],
      ['Magenta', linearScurveLogMode],
      ['Yellow', linearScurveLogMode],
      ['HSV-H', linearScurveLogMode],
      ['HSV-s', linearScurveLogMode],
      ['CTB Wheel', openColorRotationMode],
      ['CTO Wheel', openColorRotationMode],
      ['CTO Wheel (x)', openColorRotationMode.concat(splitcolorMode)],
      ['Color Time',linearScurveLogMode.concat(macroMode)],
      ['Color Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Aura LED R', linearScurveLogMode],
      ['Aura LED G', linearScurveLogMode],
      ['Aura LED B', linearScurveLogMode],
      ['Aura LED W', linearScurveLogMode],
      ['Aura LED WW', linearScurveLogMode],
      ['Aura LED CW', linearScurveLogMode],
      ['Aura LED A', linearScurveLogMode],
      ['Aura LED U', linearScurveLogMode],
      ['Aura Cyan', linearScurveLogMode],
      ['Aura Magenta', linearScurveLogMode],
      ['Aura Yellow', linearScurveLogMode]
    ]);

    let beamSubMap = new Map([
      ['Gobo Wheel(x)', openGoboGoboShakeMode.concat(rotationMode)],
      ['Gobo Rotation', rotationMode.concat(rotationPosLinearMode)],
      ['Gobo Time', linearScurveLogMode.concat(macroMode)],
      ['Gobo Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Focus', linearScurveLogMode],
      ['Frost', offMode.concat("on",linearScurveLogMode)],
      ['Zoom', linearScurveLogMode],
      ['Zoom Macro', offMode.concat(macroMode)],
      ['Zoom Time', linearScurveLogMode.concat(macroMode)],
      ['Iris', linearScurveLogMode],
      ['Iris Mode', offMode.concat(macroMode,modMode)],
      ['Prism Insertion', offMode.concat('Prisma')],
      ['Prism Rotation', rotationMode.concat(rotationPosLinearMode)]
    ]);

    let effectSubMap = new Map([
      ['Animation', rotationMode.concat('open','animation')],
      ['Animation Rotation', rotationMode.concat(rotationPosLinearMode)],
      ['Animation Mode', offMode.concat(macroMode)],
      ['Animation Speed', linearScurveLogMode.concat(macroMode)],
      ['Animation Control', []],
      ['Animation Offset', []],
      ['Animation Macro', []],
      ['Macro Effects', []]
    ]);

    let controlSubMap = new Map([
      ['Lamp ON/OFF', offMode.concat('on')],
      ['Reset', controlMode],
      ['Autofocus ', []],
      ['Background Select', []],
      ['Shape Transition', []],
      ['Shape Fade', []]
    ]);

    //Groups
    let groupMap = new Map([
      ['Intensity', intensitySubMap],
      ['Position', positionSubMap],
      ['Color', colorSubMap],
      ['Beam', beamSubMap],
      ['Effect', effectSubMap],
      ['Control', controlSubMap]

    ]);
    //Mode
    let stepType = ['ON', 'OFF', 'open', 'close', 'color', 'splitcolor', 'Gobo', 'Prisma', 'Macro Mode'];
    let stepRangeType = ['Rotation', 'Gobo shake', 'Rotate Position', 'Random'];

    let typeMap = new Map([
      ['step', stepType],
      ['step/range', stepRangeType]
    ])


    let device: DeviceType = new DeviceType('ILDA Laser', groupMap);
    device.mode = typeMap;
    device.groups.delete('Matrix');
    this.deviceTypes.push(device);
  }

  initDmxMedia() {
    //general Modes
    let linearScurveLogMode: string[] = ['linear', 'S-Curve (-9)','S-Curve (-8)','S-Curve (-7)','S-Curve (-6)',
      'S-Curve (-5)','S-Curve (-4)','S-Curve (-3)','S-Curve (-2)','S-Curve (-1)','S-Curve (0)',
      'S-Curve (1)','S-Curve (2)','S-Curve (3)','S-Curve (4)','S-Curve (5)',
      'S-Curve (6)','S-Curve (7)','S-Curve (8)','S-Curve (9)', 'log'];
    let openCloseMode: string[] = ['open', 'close'];
    let macroRandomMode: string[] = ['Macro', 'Random'];

    //Position Modes
    let circPtpLinMode: string[] = ['CIRC', 'PTP', 'LIN'];
    let offMode: string[] = ['OFF'];
    let modMode: string[] = ['Mod'];
    let macroMode: string[] = ['Macro'];

    //Color Modes
    let openColorRotationMode: string[] = ['open', 'color', 'rotation'];
    let splitcolorMode: string[] =['splitcolor'];

    //Beam Modes
    let rotationPosLinearMode: string[] = ['rotation position', 'linear'];
    let rotationMode: string[] = ['rotation'];
    let openGoboGoboShakeMode: string[] = ['Open', 'Gobo', 'Gobo Shake'];

    //Control Mode
    let controlMode: string[] = ['Pan/Tilt Reset', 'Gobo Reset', 'Color Reset', 'Beam Reset', 'Effect Reset', 'Complete Reset'];

    //subGroups
    let intensitySubMap = new Map([
      ['Intensity', linearScurveLogMode],
      ['V-Intensity', linearScurveLogMode],
      ['Aura', linearScurveLogMode],
      ['Shutter',openCloseMode],
      ['Strob', linearScurveLogMode.concat(openCloseMode,macroRandomMode)],
      ['Pulsation', linearScurveLogMode.concat(openCloseMode,macroRandomMode)]
    ]);

    let positionSubMap = new Map([
      ['Pan(x)', circPtpLinMode],
      ['Tilt(x)', circPtpLinMode],
      ['Pan - Tilt Time', linearScurveLogMode],
      ['Pan - Tilt Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Position Blink', offMode.concat(linearScurveLogMode,modMode)]
    ]);

    let colorSubMap = new Map([
      ['LED R', linearScurveLogMode],
      ['LED G', linearScurveLogMode],
      ['LED B', linearScurveLogMode],
      ['LED W', linearScurveLogMode],
      ['LED WW', linearScurveLogMode],
      ['LED CW', linearScurveLogMode],
      ['LED  A', linearScurveLogMode],
      ['LED U', linearScurveLogMode],
      ['LED Cyan', linearScurveLogMode],
      ['Magenta', linearScurveLogMode],
      ['Yellow', linearScurveLogMode],
      ['HSV-H', linearScurveLogMode],
      ['HSV-s', linearScurveLogMode],
      ['CTB Wheel', openColorRotationMode],
      ['CTO Wheel', openColorRotationMode],
      ['CTO Wheel (x)', openColorRotationMode.concat(splitcolorMode)],
      ['Color Time',linearScurveLogMode.concat(macroMode)],
      ['Color Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Aura LED R', linearScurveLogMode],
      ['Aura LED G', linearScurveLogMode],
      ['Aura LED B', linearScurveLogMode],
      ['Aura LED W', linearScurveLogMode],
      ['Aura LED WW', linearScurveLogMode],
      ['Aura LED CW', linearScurveLogMode],
      ['Aura LED A', linearScurveLogMode],
      ['Aura LED U', linearScurveLogMode],
      ['Aura Cyan', linearScurveLogMode],
      ['Aura Magenta', linearScurveLogMode],
      ['Aura Yellow', linearScurveLogMode]
    ]);

    let beamSubMap = new Map([
      ['Gobo Wheel(x)', openGoboGoboShakeMode.concat(rotationMode)],
      ['Gobo Rotation', rotationMode.concat(rotationPosLinearMode)],
      ['Gobo Time', linearScurveLogMode.concat(macroMode)],
      ['Gobo Macro', offMode.concat(macroRandomMode,linearScurveLogMode)],
      ['Focus', linearScurveLogMode],
      ['Frost', offMode.concat("on",linearScurveLogMode)],
      ['Zoom', linearScurveLogMode],
      ['Zoom Macro', offMode.concat(macroMode)],
      ['Zoom Time', linearScurveLogMode.concat(macroMode)],
      ['Iris', linearScurveLogMode],
      ['Iris Mode', offMode.concat(macroMode,modMode)],
      ['Prism Insertion', offMode.concat('Prisma')],
      ['Prism Rotation', rotationMode.concat(rotationPosLinearMode)]
    ]);

    let effectSubMap = new Map([
      ['Animation', rotationMode.concat('open','animation')],
      ['Animation Rotation', rotationMode.concat(rotationPosLinearMode)],
      ['Animation Mode', offMode.concat(macroMode)],
      ['Animation Speed', linearScurveLogMode.concat(macroMode)],
      ['Animation Control', ['']],
      ['Animation Offset', ['']],
      ['Animation Macro', ['']],
      ['Macro Effects', ['']]
    ]);

    let controlSubMap = new Map([
      ['Lamp ON/OFF', offMode.concat('on')],
      ['Reset', controlMode],
      ['Autofocus ', ['']],
      ['Background Select', ['']],
      ['Shape Transition', ['']],
      ['Shape Fade', ['']]
    ]);

    //Groups
    let groupMap = new Map([
      ['Intensity', intensitySubMap],
      ['Position', positionSubMap],
      ['Color', colorSubMap],
      ['Beam', beamSubMap],
      ['Effect', effectSubMap],
      ['Control', controlSubMap]

    ]);
    //Mode
    let stepType = ['ON', 'OFF', 'open', 'close', 'color', 'splitcolor', 'Gobo', 'Prisma', 'Macro Mode'];
    let stepRangeType = ['Rotation', 'Gobo shake', 'Rotate Position', 'Random'];

    //standard device
    let standardDevice = ['Wall', 'Media PC'];

    let typeMap = new Map([
      ['step', stepType],
      ['step/range', stepRangeType]
    ])

    let device: DeviceType = new DeviceType('DMX Media', groupMap);
    device.mode = typeMap;
    device.standardDevice = standardDevice;
    device.groups.delete('Position');
    device.groups.delete('Beam');
    device.groups.delete('Effect');
    device.groups.delete('Control');
    device.groups.delete('Matrix');
    this.deviceTypes.push(device);
  }

}
