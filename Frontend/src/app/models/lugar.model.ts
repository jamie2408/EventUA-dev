import { Evento } from './evento.model';

export class Lugar {
    constructor(
        public eventos: Evento[],
        public plantas: string,
        public bbox: string,
        public nombre?: string,
        public id?: string,
        public uid?: string,
    )
    {}
}
