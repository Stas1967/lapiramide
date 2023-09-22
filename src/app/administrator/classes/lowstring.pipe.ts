import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'lowstring'
})
export class LowstringPipe implements PipeTransform {
    transform(value: string): string {
        const gstate = value.trim().toLowerCase();
        const rep = gstate.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const lowstate = rep.replace(/\s/g, '');
        return lowstate;
    }
}
