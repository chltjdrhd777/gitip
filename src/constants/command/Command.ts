export class Command<N extends string = string> {
  constructor(public name: N, public scriptSource: string) {}
}
