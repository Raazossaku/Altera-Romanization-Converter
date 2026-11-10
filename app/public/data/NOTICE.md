# Data notice

The files in this folder (`Laoguoyin.txt`, `LaoguoyinPhrases.txt`) are licensed under the
**GNU General Public License v3.0** (see `LICENSE` in this folder). They are NOT covered
by the MIT licence that applies to the application code elsewhere in this repository.

## Origin

Derived from the Old National Pronunciation (老國音) data of
[baopaau/rime-bepemefeve](https://github.com/baopaau/rime-bepemefeve), which is
distributed under GPL-3.0. That project in turn credits the sources listed in its README
(including the digitised 《校改國音字典》, 《學生字典》, the Kangxi Dictionary text and
others). Please see that README for the full acknowledgements.

## Modifications

These files have been modified from the upstream versions. Changes so far:

- Reformatted into the tab-separated `Laoguoyin.txt` / `LaoguoyinPhrases.txt` layout used
  by this project.
- Syllables with a v- initial (微 initial) were respelled with the Zhuyin initial ㄪ
  instead of ㄨ-forms (for example `ㄨㄟ` → `ㄪㄟ`, `ㄨㄣ` → `ㄪㄣ`, `ㄨ` → `ㄪㄨ`) in all cases, in both
  files (2026-11).
- Removed a stray Latin "y" from the reading of 鿗 (`ㄧ yㄧ ㄙㄨ ㄙㄧ` → `ㄧ ㄧ ㄙㄨ ㄙㄧ`) (2026-11).
