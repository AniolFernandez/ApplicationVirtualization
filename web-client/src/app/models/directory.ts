export class Directory {
    constructor(
        public fullpath: String,
        public parent: String,
        public files: File[],
    ) { }
}
export class File {
    constructor(
        public name: String,
        public isFile: boolean,
    ) { }
}