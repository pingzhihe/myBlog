# Site fonts

`fonts.css` is loaded by both Docusaurus and the standalone home prototype.
All bundled fonts are the original upstream files, self-hosted without a font CDN.
The adjacent `LICENSE.txt` files must stay with the fonts.

| Role | Font | Weight |
| --- | --- | --- |
| English name and headings | Inter | 500 (navbar name: 400) |
| English navigation and reading text | Inter | 400 |
| Chinese throughout the site | LXGW Neo XiHei Screen | 400 |
| Dates, indices, supporting labels, code | IBM Plex Mono | 400 |

Inter and IBM Plex Mono are the selected free replacements for NB International
Pro and its Mono style. No NB font files are bundled or required.

Inter leads the heading/body stacks; IBM Plex Mono leads the metadata/code stack.
Chinese glyphs fall back to LXGW automatically, including within mixed-language
paragraphs. LXGW's upstream file contains only Regular: a heading's CSS weight
of 500 selects that available face for Chinese, not a separate Medium weight.

## Upstream files

- [Inter](https://github.com/rsms/inter), commit `353b61b9f4430d5f420d56605a6e7993e0941470`:
  `docs/font-files/InterVariable.woff2` (SIL OFL 1.1).
- [LXGW Neo XiHei Screen](https://github.com/lxgw/LxgwNeoXiZhi-Screen/releases/tag/26.08.21),
  release `26.08.21`: `LXGWNeoXiHeiScreen.ttf` (IPA Font License 1.0).
  The original, unmodified TTF is about 7.3 MiB. It is cached across pages and
  uses `font-display: swap` so text stays readable during the initial download.
  Both the IPA agreement and the upstream incorporated-font notices are bundled.
- [IBM Plex](https://github.com/IBM/plex), commit
  `763c36ef9117782905ae010056dfbe8fd2653a25`:
  `packages/plex-mono/fonts/complete/woff2/IBMPlexMono-Regular.woff2` (SIL OFL 1.1).

## Original IPA font restoration

Following the author's [web embedding instructions](https://github.com/lxgw/lxgw/blob/main/documents/xizhi_embedding_instructions.md),
the LXGW face checks for locally installed `IPAexGothic` before loading the
bundled derivative. Readers can restore the original by installing IPAexGothic
from the [IPA download page](https://moji.or.jp/ipafont/ipafontdownload/) and
restarting their browser. The `/fonts` page, linked in the footer, exposes the
licenses and these instructions. A locally installed original can have Japanese
glyph forms and less Chinese coverage; this is an intentional restoration path.
