export class AppAdmin{
    constructor(
        public readonly docker_image: string,
        public name: string='',
        public logo: string='',
        public availableUnauth: boolean=true,
        public availableAnyAuth: boolean=true,
        public pendingConfig: boolean=true
    ){}
}