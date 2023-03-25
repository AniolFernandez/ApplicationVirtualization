export class Directory {
    constructor(
        public fullpath: string,
        public parent: string,
        public files: File[],
    ) { }
}
export class File {
    constructor(
        public name: string,
        public isFile: boolean,
    ) { }
}