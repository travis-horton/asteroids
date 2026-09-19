# Asteroids — what changed, in plain words

This is the whole history of the Asteroids game, newest first, written for someone who has never seen the code. The game is played on travish.com, in the Programming section. Every entry is one step that reached the main version: a pull request, or one day's changes on one topic.

**How to read an entry**
- The heading names the change, links to the full technical detail on GitHub, and says when it landed (YY.MMDD.HHMM, Boise time).
- A bigger entry lists its parts underneath; each part's name links to the exact change that made it.
- **New:** something you can see or use · **Fixed:** a problem that no longer happens · **Behind the scenes:** a real change you can't see · **Removed:** something that is gone · **Try it:** where to see it, only when that still works today.
- "(Later replaced …)" means that version is gone and says what took its place.

*Written from the git history on 26.0918 and checked against the code of each day. From then on, each pull request carries its own entry, and it is added here automatically when the pull request merges.*

## September 2026

**asteroids #7: Bump brace-expansion from 1.1.11 to 1.1.21** · [PR #7](https://github.com/travis-horton/asteroids/pull/7) · merged 26.0919.1418 · v2.1.3
- Behind the scenes: an automatic dependency update — "Bump brace-expansion from 1.1.11 to 1.1.21".

**asteroids #9: a stray install log removed** · [PR #9](https://github.com/travis-horton/asteroids/pull/9) · merged 26.0919.1418 · v2.1.2
- Fixed: a leftover log from a failed package install (`yarn-error.log`) was part of the public project, including a local folder path. It's gone, and the ignore list already keeps new ones out.

**asteroids #6: A plain-language history of the game** · [PR #6](https://github.com/travis-horton/asteroids/pull/6) · merged 26.0919.1336 · v2.1.1
- **[The history, written](https://github.com/travis-horton/asteroids/commit/5e7b727)** · merged 26.0919.1336
  Behind the scenes: a new page, HISTORY.md, tells the whole story of the game in plain words, from the first version on 18.0819 to today, with a version number for each step (the game is at version 2.1.0).
- **[Kept up to date by itself](https://github.com/travis-horton/asteroids/commit/8967457)** · merged 26.0919.1336
  Behind the scenes: every future change to the game must describe itself in plain words, and when it is accepted that description is added to the top of HISTORY.md with its version number.

**asteroids #5: the high score lives in your own browser** · [PR #5](https://github.com/travis-horton/asteroids/pull/5) · merged 26.0910.2034 · v2.1.0
- Fixed: the game on travish.com had stopped working, because it tried to reach the old online high-score database first, and the website no longer had the settings to connect to it. The game now starts without it.
  New: your best score is kept in your own browser, so it is there the next time you play on the same computer, and the "HIGH score" line changes the moment you beat it. It replaces the shared online high score, and the game no longer uses the online database at all.
  Try it: open https://www.travish.com/programming/asteroids and play with the arrow keys and the space bar.

## February 2026

**Restarting cleanly, and private material removed** · [commit](https://github.com/travis-horton/asteroids/commit/e87af2f) · merged 26.0226.1919 · v2.0.7
- Fixed: pressing R in the middle of a game started a new game but left the old one running underneath it on the same screen; now the old one stops first.
  Fixed: restarting only worked with a capital R (Shift+R or Caps Lock), even though the screen says "R" to restart; now a plain r works too.
  Behind the scenes: private material was removed from the code; the website now supplies it when it builds. The game also moved to the newer way of talking to the online high-score database.

## June 2024

**Code tidy** · [commit](https://github.com/travis-horton/asteroids/commit/62a70f9) · merged 24.0606.1253 · v2.0.6
- Behind the scenes: the spacing in one line of the asteroid code was tidied to match the style checker.

## January 2024

**Asteroids appear again** · [commit](https://github.com/travis-horton/asteroids/commit/5de4239) · merged 24.0103.1641 · v2.0.5
- Fixed: since the renaming on 22.1228, the asteroids were invisible and could not be hit, and they could not hit your ship either. Their size is read correctly again, so they are drawn and collide as before.

## December 2022

**asteroids #3: clearer names in the asteroid code** · [PR #3](https://github.com/travis-horton/asteroids/pull/3) · merged 22.1228.2154 · v2.0.4
- Behind the scenes: inside the asteroid piece of the game, the short labels for an asteroid's size and speed got full-word names, and a second, unused list of installed software versions was deleted (the project keeps one). A slip in the renaming left the asteroids without a readable size, which made them invisible and impossible to hit until 24.0103.

## June 2022

**Automatic checks for the game's math** · [commits](https://github.com/travis-horton/asteroids/compare/8066469...c4a25f5) · merged 22.0626.2141 · v2.0.3
- **[Tests and a style checker](https://github.com/travis-horton/asteroids/commit/982d0a9)** · merged 22.0626.2109
  Behind the scenes: set up automatic tests and a code-style checker, and tidied two lines to its rules. The first test checks that a line 3 across and 4 up measures 5 long. A long error log from a failed software install was saved into the project by accident at the same time, and is still there.
- **[Speed-limit test](https://github.com/travis-horton/asteroids/commit/87e41ce)** · merged 22.0626.2123
  Behind the scenes: a test that the ship's speed limit cuts a too-fast movement down to 2 while keeping its direction. The piece that measures a line's length got a clearer name, and the style checker now covers every file.
- **[Turning test](https://github.com/travis-horton/asteroids/commit/c4a25f5)** · merged 22.0626.2141
  Behind the scenes: a test that turning a point halfway around (180 degrees) puts it on the exact opposite side.

**Game pieces sorted into folders** · [commit](https://github.com/travis-horton/asteroids/commit/8066469) · merged 22.0625.1031 · v2.0.2
- Behind the scenes: the ship, asteroid and bullet each got their own folder (the ship's keyboard handling and crash sparks inside the ship's), and the shared math for turning points joined the rest of the shared math in one place.

**The game's code reorganized** · [commits](https://github.com/travis-horton/asteroids/compare/8067ea6...c7816e9) · merged 22.0620.2256 · v2.0.1
- **[Split into pieces](https://github.com/travis-horton/asteroids/commit/25801de)** · merged 22.0620.2250
  Behind the scenes: the one long game file was split into separate pieces for the ship, asteroids, bullets, crash sparks and keyboard, meant to play exactly as before. One thing was lost in the move: a new record was no longer saved to the shared online high score, so it showed on your screen but was gone the next time.
- **[Code tidy](https://github.com/travis-horton/asteroids/commit/d751847)** · merged 22.0620.2251
  Behind the scenes: formatting tidied to the style rules, and a leftover line removed that printed your remaining lives into the browser's hidden developer console every time you crashed.
- **[A smaller game area](https://github.com/travis-horton/asteroids/commit/c7816e9)** · merged 22.0620.2256
  Fixed: the game area was too big to fit comfortably on the page. It is now 432 pixels square instead of 512, and the asteroids shrink with it.

## July 2021

**The game moves onto the website, with a shared high score** · [commit](https://github.com/travis-horton/asteroids/commit/8067ea6) · merged 21.0701.2210 · v2.0.0
- Removed: the game's own stand-alone page is gone. From here on the game is a piece that the website places on one of its own pages.
  New: a high score shared by everyone who plays, kept in an online database (Firebase), so the corner shows the best score anyone has reached. Before, the high score always showed 0. (Later replaced on 26.0910 by a high score kept in your own browser.)
  New: the game area is 512 pixels square instead of 600, with the asteroids scaled to match so they still break apart three times, and the restart hint now reads "R" instead of "r".

## April 2020

**Planning notes back, under a new name** · [merge](https://github.com/travis-horton/asteroids/commit/ea0141f) · merged 20.0428.0715 · v1.0.3
- Behind the scenes: brought in two changes made on GitHub on 18.1107, which renamed the planning-notes file to "outline", so the notes came back under that name. A leftover commented-out note about reading from a database was also removed from the game file.

## April 2019

**Planning notes removed** · [commit](https://github.com/travis-horton/asteroids/commit/01673c2) · merged 19.0409.1523 · v1.0.2
- Behind the scenes: the early planning-notes file was deleted.

## March 2019

**First split into files** · [commit](https://github.com/travis-horton/asteroids/commit/61dd82d) · merged 19.0306.1444 · v1.0.1
- Behind the scenes: the math that turns a point around a center moved out of the game file into a file of its own.

## August 2018

**Asteroids begins** · [commit](https://github.com/travis-horton/asteroids/commit/5f19130) · merged 18.0819.1315 · v1.0.0
- New: Asteroids, playable on its own web page. You fly a small ship with the arrow keys (left and right turn, up speeds you up, down slows you down) and shoot with the space bar; a hit asteroid breaks into three smaller ones until the pieces are too small to break. Each cleared level brings one more asteroid, you have 3 lives (shown in red on the last one), a crash throws out a burst of sparks, and the Game Over screen shows your score and level. (The stand-alone page was later removed on 21.0701, when the game moved onto the website.)
