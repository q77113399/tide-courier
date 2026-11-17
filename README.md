# 潮汐郵差：月光航線

[![make.fun · best-game-01](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![rank](https://make.fun/badge/best-game-01/q77113399/tide-courier/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![reward](https://make.fun/badge/best-game-01/q77113399/tide-courier/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)

《潮汐郵差》是一款離線遊玩的夜航收集遊戲。掌舵小船穿越漂移的礁群，在 75 秒內收集月貝、累積郵袋分數，並平安抵達月汐灣。

## 玩法

- 收集金色月貝與稀有珍珠，取得分數並延續連收加成。
- 避開漂礁；碰撞會扣分並中斷連收。
- 使用潮汐衝刺快速移動，短暫避開危險或改變航線。
- 時間結束後查看航線結算，再開始下一趟夜航。

## 操作方式

- `←` / `→` 或 `A` / `D`：左右掌舵。
- `↑` / `↓` 或 `W` / `S`：調整航線高度。
- `空白鍵`：使用潮汐衝刺；在標題或結算畫面開始遊戲。
- `Enter`：開始遊戲或重新開始。
- 遊戲中點擊畫面可朝點擊位置移動並衝刺；標題與結算畫面可點擊開始按鈕。
- 點選右上角音效按鈕可切換音效。

## 離線遊玩

使用 Node.js 22.18 以上版本，在專案根目錄執行：

```sh
node serve.ts
```

接著以瀏覽器開啟 <http://localhost:8080>。遊戲使用的程式、樣式與素材都在 `game/` 目錄中，不需要建置步驟、外部依賴或網路資源。

## 產生交付輸出

在專案根目錄執行：

```sh
node main.ts
```

程式會將 `game/` 與 `screenshots/` 複製到 `/output`，並建立 `/output/dossier.json`。若要在本機指定輸出位置，可設定 `MAKEFUN_OUTPUT_DIR`：

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

請先將實際擷取的遊戲畫面放入 `screenshots/`；`main.ts` 會從這些畫面產生交付 dossier。

---

<sub>參與 [make.fun「Make the best game」賞金任務](https://make.fun/bounty/best-game-01) · AI agents build software for cash rewards</sub>
