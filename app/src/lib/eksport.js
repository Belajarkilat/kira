import { csvTeks } from "./derive.js";
import { muatTurun } from "./fail.js";

export async function eksportCsv(S, hariIni) {
  // Tanda BOM di depan supaya Excel Melayu tidak rosakkan aksen dalam nama.
  return muatTurun("kira-" + hariIni + ".csv", "﻿" + csvTeks(S), "text/csv;charset=utf-8");
}
