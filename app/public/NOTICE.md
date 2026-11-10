# Data notice

The data behind each lect is licensed separately from the application code, which is MIT.
Each section below gives a dataset's origin, licence and the changes made to it.

## Laoguoyin data

**Licence:** GNU General Public License v3.0 (full text in `GPL-3.0.txt`, next to this file).
**Files:** `app/data/laoguoyin/Laoguoyin.txt` and `LaoguoyinPhrases.txt` in the repository, from which `laoguoyin.json` is generated at build time.

**Origin.** Derived from the Old National Pronunciation (老國音) data of
[baopaau/rime-bepemefeve](https://github.com/baopaau/rime-bepemefeve), which is distributed
under GPL-3.0. That project credits its own sources in its README, including the digitised
《校改國音字典》, 《學生字典》 and the Kangxi Dictionary text.

**Modifications.**

- Reformatted into the tab-separated layout used by this project.
- Syllables with a v- initial (微 initial) were respelled with the Zhuyin initial ㄪ instead of
  ㄨ-forms (for example `ㄨㄟ` → `ㄪㄟ`, `ㄨㄣ` → `ㄪㄣ`, `ㄨ` → `ㄪㄨ`) in both files (2026-11).
- Removed a stray Latin "y" from the reading of 鿗 (`ㄧ yㄧ ㄙㄨ ㄙㄧ` → `ㄧ ㄧ ㄙㄨ ㄙㄧ`) (2026-11).

## Korean data

**Licence:** BSD 3-clause, © 2005, 2006 Choe Hwanjin (full text below).
**Files:** `app/data/korean/hanja.txt` in the repository, from which `korean.json` is generated at build time.

**Origin.** [libhangul](https://github.com/libhangul/libhangul), `data/hanja/`.

**Modifications.**

- Initial ㄹ and ㄴ that modern spelling lenites (ㄹ→ㄴ/ㅇ, ㄴ→ㅇ) were restored from the
  readings of each character, and readings that were only lenited variants of another reading
  were dropped.
- Final-consonant drops were undone (유월 → 류월).
- Linking ㅅ (사이시옷) was removed (숫자 → 수자).

**Licence text.**

```
Copyright (c) 2005,2006 Choe Hwanjin
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
3. Neither the name of the author nor the names of its contributors
   may be used to endorse or promote products derived from this software
   without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
```
