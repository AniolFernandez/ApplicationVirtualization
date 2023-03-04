import { Application } from "./application";

export class Category{
    constructor(
        public name: String,
        public isOpen: boolean,
        public apps: Application[]
    ){}
}