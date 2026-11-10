import type { Lect } from '../types.ts';
import { josonese } from './josonese/index.ts';
import { laoguoyin } from './laoguoyin/index.ts';

export const lects: Lect[] = [laoguoyin, josonese];
