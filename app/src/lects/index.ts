import type { Lect } from '../core/types.ts';
import { josonese } from './josonese/index.ts';
import { laoguoyin } from './laoguoyin/index.ts';

export const lects: Lect[] = [laoguoyin, josonese];
