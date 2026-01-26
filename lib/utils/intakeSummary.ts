// lib/utils/intakeSummary.ts

/**
 * intake payload（FastAPIから取得したヒアリング結果）を
 * 施術者向けに読みやすい文章へ変換するユーティリティ
 *
 * ・AI未使用（ルールベース）
 * ・断定・診断表現なし
 * ・事実ベースで要点をまとめる
 */

type Payload = Record<string, any>;

type KeySpec = {
  key: string;   // payload 内のキー名
  label: string; // 日本語表示ラベル
};

type SummaryOptions = {
  mode?: 'lines' | 'paragraph'; // 既定は lines
};

// 値が空かどうかを判定（表示・文章化の対象外にするため）
function isEmpty(v: any) {
  return (
    v === null ||
    v === undefined ||
    v === '' ||
    (Array.isArray(v) && v.length === 0)
  );
}

// payload の値を文章用テキストに変換
function valToText(v: any): string {
  if (isEmpty(v)) return '';
  if (Array.isArray(v)) return v.join('、');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

  // 重要項目の優先順位を定義
  const PRIORITY_ORDER = [
    /main|chief|concern|complaint|困り|主訴/,
    /onset|since|start|発症|いつから/,
    /severity|level|pain|つらさ|痛み/,
    /sleep|睡眠/,
    /stress|ストレス/,
  ];

  /**
 * importantKeys から抽出した情報を
 * 「意味のかたまり」ごとに整理して自然な文章を作る
 *
 * ・箇条書き感をなくす
 * ・施術者が一読で把握できる文章にする
 */
function buildParagraph(picked: {
  key: string;
  label: string;
  text: string;
}[]): string {

  // --- よく使う項目を役割ごとに拾う ---
  const main = picked.find(p => /main|chief|困り|主訴/.test(p.key));
  const onset = picked.find(p => /onset|発症|いつから/.test(p.key));
  const severity = picked.find(p => /severity|痛み|つらさ/.test(p.key));

  const sleep = picked.find(p => /sleep|睡眠/.test(p.key));
  const stress = picked.find(p => /stress|ストレス/.test(p.key));

  const exercise = picked.find(p => /運動/.test(p.label));
  const hope = picked.find(p => /希望/.test(p.label));

  const sentences: string[] = [];

  // --- ① 主症状・経過 ---
  if (main) {
    let s = `主な困りごとは「${main.text}」`;
    if (onset) {
      const onsetText = onset.text;
  
      // 「〜から」が含まれている場合は、そのまま使う
      if (/から/.test(onsetText)) {
        s += `で、症状は${onsetText}続いています`;
      } else {
        // 含まれていない場合のみ「頃から」を補う
        s += `で、症状は「${onsetText}」頃から続いています`;
      }
    }
    sentences.push(s + '。');
  }

  // --- ② 程度・生活背景 ---
  if (severity || sleep || stress) {
    let s = '';

    // 先に生活背景を組み立てる
    const lifestyleParts: string[] = [];
    if (sleep) lifestyleParts.push(`睡眠面では${sleep.text}`);
    if (stress) lifestyleParts.push(`ストレス面では${stress.text}`);

    if (severity) {
      // severity がある場合は主文として開始
      s = `つらさは${severity.text}とのことで`;

      if (lifestyleParts.length > 0) {
        // 後続情報がある場合のみ「、」で接続
        s += `、${lifestyleParts.join('、')}と回答されています`;
      }
    } else if (lifestyleParts.length > 0) {
      // severity がない場合は、生活背景を文頭として開始
      s = `${lifestyleParts.join('、')}と回答されています`;
    }

    // 文が成立している場合のみ追加
    if (s) {
      sentences.push(s + '。');
    }
  }

  // --- ③ 補足情報（あれば） ---
  if (exercise || hope) {
    const parts: string[] = [];
    if (exercise) parts.push(`運動習慣は${exercise.text}`);
    if (hope) parts.push(`ご本人の希望は「${hope.text}」`);
    sentences.push(parts.join('、') + 'とのことです。');
  }

  // 文章が何も作れなかった場合の保険
  if (sentences.length === 0) {
    return '特筆すべき回答はありませんでした。';
  }

  // 段落として返す（改行あり）
  return sentences.join('\n');
}


/**
 * 施術者向け要点まとめ文章を生成する
 *
 * @param payload - FastAPIから取得したヒアリング全データ
 * @param importantKeys - 重要項目（キー＋日本語ラベル）
 */
export function generateIntakeSummary(
  payload: Payload,
  importantKeys: KeySpec[],
  options: SummaryOptions = {},
): string {
  // まずは「重要項目だけ」を候補として取り出す（=スコープを小さくして安全に）
  const picked = importantKeys
    .map((s) => ({
      key: s.key,
      label: s.label,
      value: payload?.[s.key],
      text: valToText(payload?.[s.key]),
    }))
    .filter((x) => !isEmpty(x.value))
    .sort((a, b) => {
      const ai = PRIORITY_ORDER.findIndex((r) => r.test(a.key));
      const bi = PRIORITY_ORDER.findIndex((r) => r.test(b.key));
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

    // 重要項目が一つもなければ定型文を返す
  if (picked.length === 0) {
    return '特筆すべき回答はありませんでした。';
  }

  /**
   * キー名に応じた文章テンプレート定義
   * ※ キー名の正規表現でゆるく判定する
   * ※ 将来キーが増えても破綻しにくい
   */
  const templates: Array<{
    match: (key: string) => boolean;
    build: (label: string, text: string) => string;
  }> = [
    // 主訴系
    { match: (k) => /main|chief|concern|trouble|complaint|主訴|困り/.test(k), build: (_l, t) => `主な困りごとは「${t}」です。` },
    // 発症時期系
    { match: (k) => /onset|start|since|when|発症|いつから/.test(k), build: (_l, t) => `症状は「${t}」頃から続いています。` },
    // つらさ/痛みスケール系
    { match: (k) => /severity|scale|pain|level|つらさ|痛み|程度/.test(k), build: (_l, t) => `つらさ（程度）は「${t}」です。` },
    // 睡眠
    { match: (k) => /sleep|睡眠/.test(k), build: (_l, t) => `睡眠面では「${t}」と回答されています。` },
    // ストレス
    { match: (k) => /stress|ストレス/.test(k), build: (_l, t) => `ストレス面では「${t}」とのことです。` },
  ];

  const lines: string[] = [];

  // 各重要項目を1文ずつ文章化
  for (const item of picked) {
    const tpl = templates.find((t) => t.match(item.key));
    if (tpl) {
      lines.push(tpl.build(item.label, item.text));
    } else {
      // テンプレに当てはまらない場合の汎用文
      lines.push(`${item.label}は「${item.text}」と回答されています。`);
    }
  }

  const mode = options.mode ?? 'lines';

  // 文章が冗長になるのを防ぐ：最大8行まで（必要なら調整）
  const sentenceLines = lines.slice(0, 8);

  // ▼ ここから分岐
  if (mode === 'lines') {
    // 今まで通り：1文ずつ改行表示
    return sentenceLines.join('\n');
  }

  // 施術者・カルテ向けの自然文表示
  if (mode === 'paragraph') {
    return buildParagraph(picked);
  }

  // 念のためのフォールバック
  return lines.slice(0, 8).join('\n');
}
