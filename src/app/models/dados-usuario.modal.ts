export class DadosUsuario {
    constructor(
        public role?: string,//?opcional
        public empresaId?: number,
        public id?: number,
        public exp?: number,
        public sub?: string,
        public created?: number
    ) { }
}
