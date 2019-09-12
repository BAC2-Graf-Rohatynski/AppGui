export class Tab {
  name: string;
  isSaved: boolean = false;
  displayName: string;

  constructor(name: string) {
    this.name = name;
  }
}
