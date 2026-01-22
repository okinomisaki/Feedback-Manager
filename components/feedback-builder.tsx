"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Check,
  Copy,
  RotateCcw,
  Sparkles,
  Heart,
  Star,
  Settings,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { cn } from "../lib/utils";

// 項目の型定義
interface CheckItem {
  id: string;
  label: string;
  text?: string; // 生成される文章（良かった点・アドバイス用）
  errorText?: string; // エラー時の文章（判定用チェック用）
}

// デフォルトの判定用チェック項目
const DEFAULT_REQUIRED_CHECKS: CheckItem[] = [
  {
    id: "test-pass",
    label: "テストはすべてパスしている",
    errorText:
      "テストが通っていない部分があるようです。エラーメッセージを確認して、修正をお願いします。",
  },
  {
    id: "requirements-met",
    label: "要件（例：5ファイル）を満たしている",
    errorText:
      "要件を満たしていない箇所があるようです。課題の指示を再度確認してみてください。",
  },
];

// デフォルトの良かった点
const DEFAULT_GOOD_POINTS: CheckItem[] = [
  {
    id: "good-commit",
    label: "コミットのタイミングが適切",
    text: "コミットのタイミングが適切で、作業の流れが分かりやすかったです。",
  },
  {
    id: "good-readme",
    label: "READMEがMarkdownで正しく書けている",
    text: "READMEがMarkdownで正しく書けていて、読みやすくまとまっています。",
  },
  {
    id: "good-test",
    label: "テストが通っている",
    text: "テストがすべて通っており、動作確認がしっかりできています。",
  },
  {
    id: "good-overall",
    label: "全体的に丁寧に取り組めている",
    text: "全体的に丁寧に取り組めていて、コードも読みやすいです。",
  },
];

// デフォルトのアドバイス項目
const DEFAULT_ADVICE_ITEMS: CheckItem[] = [
  {
    id: "advice-code",
    label: "コードの書き方",
    text: "コードの書き方について、変数名や関数の分割など、もう少し工夫できると更に良くなります。",
  },
  {
    id: "advice-commit",
    label: "コミットメッセージ",
    text: "コミットメッセージは、何を変更したかが分かるように書くと、後から見返しやすくなります。",
  },
  {
    id: "advice-readme",
    label: "README",
    text: "READMEには、プロジェクトの概要や使い方を追記すると、より分かりやすくなります。",
  },
];

// LocalStorageキー
const STORAGE_KEYS = {
  requiredChecks: "feedback-required-checks",
  goodPoints: "feedback-good-points",
  adviceItems: "feedback-advice-items",
};

// 項目編集モーダル
function ItemEditorModal({
  open,
  onOpenChange,
  title,
  items,
  onSave,
  hasText = true,
  textLabel = "生成される文章",
  hasErrorText = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: CheckItem[];
  onSave: (items: CheckItem[]) => void;
  hasText?: boolean;
  textLabel?: string;
  hasErrorText?: boolean;
}) {
  const [editItems, setEditItems] = useState<CheckItem[]>(items);
  const [newLabel, setNewLabel] = useState("");
  const [newText, setNewText] = useState("");
  const [newErrorText, setNewErrorText] = useState("");

  useEffect(() => {
    setEditItems(items);
  }, [items, open]);

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    const newItem: CheckItem = {
      id: `custom-${Date.now()}`,
      label: newLabel.trim(),
      ...(hasText && { text: newText.trim() }),
      ...(hasErrorText && { errorText: newErrorText.trim() }),
    };
    setEditItems([...editItems, newItem]);
    setNewLabel("");
    setNewText("");
    setNewErrorText("");
  };

  const handleDelete = (id: string) => {
    setEditItems(editItems.filter((item) => item.id !== id));
  };

  const handleUpdateLabel = (id: string, label: string) => {
    setEditItems(
      editItems.map((item) => (item.id === id ? { ...item, label } : item)),
    );
  };

  const handleUpdateText = (id: string, text: string) => {
    setEditItems(
      editItems.map((item) => (item.id === id ? { ...item, text } : item)),
    );
  };

  const handleUpdateErrorText = (id: string, errorText: string) => {
    setEditItems(
      editItems.map((item) => (item.id === id ? { ...item, errorText } : item)),
    );
  };

  const handleSave = () => {
    onSave(editItems);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 既存項目の編集 */}
          <div className="space-y-3">
            {editItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border-2 border-muted bg-muted/30 p-4 space-y-3"
              >
                <div className="flex items-start gap-2">
                  <Input
                    value={item.label}
                    onChange={(e) => handleUpdateLabel(item.id, e.target.value)}
                    placeholder="ラベル"
                    className="flex-1 rounded-lg border-2"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="h-10 w-10 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {hasText && (
                  <Textarea
                    value={item.text || ""}
                    onChange={(e) => handleUpdateText(item.id, e.target.value)}
                    placeholder={textLabel}
                    rows={2}
                    className="resize-none rounded-lg border-2"
                  />
                )}
                {hasErrorText && (
                  <Textarea
                    value={item.errorText || ""}
                    onChange={(e) =>
                      handleUpdateErrorText(item.id, e.target.value)
                    }
                    placeholder="NGの場合に表示される文章"
                    rows={2}
                    className="resize-none rounded-lg border-2"
                  />
                )}
              </div>
            ))}
          </div>

          {/* 新規追加 */}
          <div className="rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-4 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              新しい項目を追加
            </p>
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="ラベル（例：コードが読みやすい）"
              className="rounded-lg border-2"
            />
            {hasText && (
              <Textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder={`${textLabel}（例：コードが読みやすく整理されています。）`}
                rows={2}
                className="resize-none rounded-lg border-2"
              />
            )}
            {hasErrorText && (
              <Textarea
                value={newErrorText}
                onChange={(e) => setNewErrorText(e.target.value)}
                placeholder="NGの場合に表示される文章"
                rows={2}
                className="resize-none rounded-lg border-2"
              />
            )}
            <Button
              onClick={handleAdd}
              disabled={!newLabel.trim()}
              className="w-full rounded-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              追加
            </Button>
          </div>

          {/* 保存ボタン */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl"
            >
              <X className="mr-2 h-4 w-4" />
              キャンセル
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 rounded-xl bg-purple-500 hover:bg-purple-600"
            >
              <Check className="mr-2 h-4 w-4" />
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FeedbackBuilder() {
  // 項目データ（localStorageから読み込み）
  const [requiredCheckItems, setRequiredCheckItems] = useState<CheckItem[]>(
    DEFAULT_REQUIRED_CHECKS,
  );
  const [goodPointItems, setGoodPointItems] =
    useState<CheckItem[]>(DEFAULT_GOOD_POINTS);
  const [adviceItemsList, setAdviceItemsList] =
    useState<CheckItem[]>(DEFAULT_ADVICE_ITEMS);

  // 編集モーダルの状態
  const [editingSection, setEditingSection] = useState<
    "required" | "good" | "advice" | null
  >(null);

  // 判定用チェック（すべてOKかどうか）
  const [requiredChecks, setRequiredChecks] = useState<Record<string, boolean>>(
    {},
  );

  // 良かった点
  const [goodPoints, setGoodPoints] = useState<Set<string>>(new Set());

  // アドバイス
  const [adviceItems, setAdviceItems] = useState<Set<string>>(new Set());

  // その他コメント
  const [otherComment, setOtherComment] = useState("");

  // コピー状態
  const [copied, setCopied] = useState(false);

  // localStorageから項目を読み込み
  useEffect(() => {
    const savedRequired = localStorage.getItem(STORAGE_KEYS.requiredChecks);
    const savedGood = localStorage.getItem(STORAGE_KEYS.goodPoints);
    const savedAdvice = localStorage.getItem(STORAGE_KEYS.adviceItems);

    if (savedRequired) {
      const items = JSON.parse(savedRequired);
      setRequiredCheckItems(items);
      setRequiredChecks(
        Object.fromEntries(items.map((item: CheckItem) => [item.id, false])),
      );
    } else {
      setRequiredChecks(
        Object.fromEntries(
          DEFAULT_REQUIRED_CHECKS.map((item) => [item.id, false]),
        ),
      );
    }
    if (savedGood) setGoodPointItems(JSON.parse(savedGood));
    if (savedAdvice) setAdviceItemsList(JSON.parse(savedAdvice));
  }, []);

  // 項目保存時の処理
  const handleSaveRequiredItems = (items: CheckItem[]) => {
    setRequiredCheckItems(items);
    localStorage.setItem(STORAGE_KEYS.requiredChecks, JSON.stringify(items));
    // チェック状態をリセット
    setRequiredChecks(
      Object.fromEntries(items.map((item) => [item.id, false])),
    );
  };

  const handleSaveGoodPoints = (items: CheckItem[]) => {
    setGoodPointItems(items);
    localStorage.setItem(STORAGE_KEYS.goodPoints, JSON.stringify(items));
    setGoodPoints(new Set());
  };

  const handleSaveAdviceItems = (items: CheckItem[]) => {
    setAdviceItemsList(items);
    localStorage.setItem(STORAGE_KEYS.adviceItems, JSON.stringify(items));
    setAdviceItems(new Set());
  };

  // すべての必須チェックがOKか判定
  const allRequiredPassed = useMemo(() => {
    return requiredCheckItems.every((item) => requiredChecks[item.id]);
  }, [requiredChecks, requiredCheckItems]);

  // 再提出が必要か
  const isResubmit = !allRequiredPassed;

  // 失敗している必須項目
  const failedRequirements = useMemo(() => {
    return requiredCheckItems.filter((item) => !requiredChecks[item.id]);
  }, [requiredChecks, requiredCheckItems]);

  // フィードバック文章の生成
  const generatedFeedback = useMemo(() => {
    const lines: string[] = [];
    const selectedGoodPoints = goodPointItems.filter((item) =>
      goodPoints.has(item.id),
    );
    const selectedAdvice = adviceItemsList.filter((item) =>
      adviceItems.has(item.id),
    );

    // 1. 提出してくれたお礼
    lines.push("提出ありがとうございます！ 🙇");
    lines.push("");

    // 2. 良かったところを自然な文章で褒める
    if (selectedGoodPoints.length > 0) {
      const goodTexts = selectedGoodPoints
        .map((item) => item.text)
        .filter(Boolean);
      lines.push(goodTexts.join(""));
      lines.push("素晴らしいですね！ ✨");
      lines.push("");
    }

    // 3. 再提出か課題クリアか
    if (isResubmit) {
      lines.push("ただ、今回は修正をお願いしたい点があります 🙏");
      lines.push("");

      failedRequirements.forEach((item) => {
        if (item.errorText) {
          lines.push(item.errorText);
        }
      });
      lines.push("");

      lines.push(
        "修正が完了したら、同じPull Requestに追加でコミット＆プッシュしてください。新しいPull Requestを作成する必要はありません 👍",
      );
      lines.push("");

      if (selectedAdvice.length > 0 || otherComment.trim()) {
        lines.push("また、今後に向けてのアドバイスです 💡");
        selectedAdvice.forEach((item) => {
          if (item.text) lines.push(item.text);
        });
        if (otherComment.trim()) {
          lines.push(otherComment.trim());
        }
        lines.push("");
      }

      lines.push("分からないことがあれば、遠慮なく質問してくださいね！");
    } else {
      lines.push("課題クリアです！おめでとうございます！ 🎉");
      lines.push("");

      if (selectedAdvice.length > 0 || otherComment.trim()) {
        lines.push("今後に向けて、少しだけアドバイスです 💡");
        selectedAdvice.forEach((item) => {
          if (item.text) lines.push(item.text);
        });
        if (otherComment.trim()) {
          lines.push(otherComment.trim());
        }
        lines.push("");
      }

      lines.push("この調子で次の課題も頑張ってください！ 🔥");
    }

    return lines.join("\n");
  }, [
    isResubmit,
    goodPoints,
    adviceItems,
    otherComment,
    failedRequirements,
    goodPointItems,
    adviceItemsList,
  ]);

  const handleRequiredCheck = (id: string, checked: boolean) => {
    setRequiredChecks((prev) => ({ ...prev, [id]: checked }));
  };

  const handleGoodPointToggle = (id: string) => {
    setGoodPoints((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAdviceToggle = (id: string) => {
    setAdviceItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedFeedback);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setRequiredChecks(
      Object.fromEntries(requiredCheckItems.map((item) => [item.id, false])),
    );
    setGoodPoints(new Set());
    setAdviceItems(new Set());
    setOtherComment("");
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Checklist */}
        <div className="space-y-5">
          {/* 1. 判定用チェック（必須） */}
          <Card
            className={cn(
              "overflow-hidden border-2 shadow-sm transition-all duration-300",
              allRequiredPassed
                ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50"
                : "border-pink-300 bg-gradient-to-br from-pink-50 to-rose-50",
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  {allRequiredPassed ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Sparkles className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                      <Star className="h-4 w-4" />
                    </span>
                  )}
                  判定用チェック
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingSection("required")}
                    className="h-8 w-8 rounded-full p-0 hover:bg-card/80"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-bold shadow-sm",
                      allRequiredPassed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-pink-100 text-pink-700",
                    )}
                  >
                    {allRequiredPassed ? "課題クリア!" : "再提出"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                NGが1つでもあれば再提出になります
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {requiredCheckItems.map((item) => (
                <label
                  key={item.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-card/80 p-4 transition-all duration-200 hover:scale-[1.01]",
                    requiredChecks[item.id]
                      ? "border-emerald-300 shadow-sm"
                      : "border-pink-200 hover:border-pink-300",
                  )}
                >
                  <Checkbox
                    checked={requiredChecks[item.id] || false}
                    onCheckedChange={(checked) =>
                      handleRequiredCheck(item.id, checked as boolean)
                    }
                    className="h-5 w-5 rounded-md border-2 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <span className="flex-1 text-sm font-medium">
                    {item.label}
                  </span>
                  {requiredChecks[item.id] ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      OK
                    </span>
                  ) : (
                    <span className="rounded-full bg-pink-100 px-2.5 py-1 text-xs font-bold text-pink-700">
                      NG
                    </span>
                  )}
                </label>
              ))}
            </CardContent>
          </Card>

          {/* 2. 良かった点 */}
          <Card className="overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <Heart className="h-4 w-4" />
                  </span>
                  良かった点
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingSection("good")}
                  className="h-8 w-8 rounded-full p-0 hover:bg-card/80"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                該当する項目にチェックを入れてね
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {goodPointItems.map((item) => (
                <label
                  key={item.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border-2 bg-card/80 p-4 transition-all duration-200 hover:scale-[1.01]",
                    goodPoints.has(item.id)
                      ? "border-purple-300 shadow-sm"
                      : "border-transparent hover:border-purple-200",
                  )}
                >
                  <Checkbox
                    checked={goodPoints.has(item.id)}
                    onCheckedChange={() => handleGoodPointToggle(item.id)}
                    className="mt-0.5 h-5 w-5 rounded-md border-2 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{item.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* 3. 今後に向けたアドバイス */}
          <Card className="overflow-hidden border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  今後に向けたアドバイス
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingSection("advice")}
                  className="h-8 w-8 rounded-full p-0 hover:bg-card/80"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                改善点があればチェックしてね
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {adviceItemsList.map((item) => (
                <label
                  key={item.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border-2 bg-card/80 p-4 transition-all duration-200 hover:scale-[1.01]",
                    adviceItems.has(item.id)
                      ? "border-sky-300 shadow-sm"
                      : "border-transparent hover:border-sky-200",
                  )}
                >
                  <Checkbox
                    checked={adviceItems.has(item.id)}
                    onCheckedChange={() => handleAdviceToggle(item.id)}
                    className="mt-0.5 h-5 w-5 rounded-md border-2 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{item.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </label>
              ))}

              {/* その他（自由記述） */}
              <div className="space-y-2 pt-2">
                <p className="text-sm font-bold text-sky-700">
                  その他（自由記述）
                </p>
                <Textarea
                  placeholder="テンプレートにない内容を自由に入力..."
                  value={otherComment}
                  onChange={(e) => setOtherComment(e.target.value)}
                  rows={3}
                  className="resize-none rounded-xl border-2 border-sky-200 bg-card/80 focus:border-sky-400"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Preview */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <Card
            className={cn(
              "overflow-hidden border-2 shadow-sm transition-all duration-300",
              isResubmit
                ? "border-pink-300 bg-gradient-to-br from-pink-50 to-rose-50"
                : "border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50",
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full",
                      isResubmit
                        ? "bg-pink-100 text-pink-600"
                        : "bg-emerald-100 text-emerald-600",
                    )}
                  >
                    <Sparkles className="h-4 w-4" />
                  </span>
                  フィードバック
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-bold",
                      isResubmit
                        ? "bg-pink-100 text-pink-700"
                        : "bg-emerald-100 text-emerald-700",
                    )}
                  >
                    {isResubmit ? "再提出" : "クリア!"}
                  </span>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  チェック内容に応じて自動生成されます
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="rounded-full border-2 bg-card/80 hover:bg-card"
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  リセット
                </Button>
                <Button
                  size="sm"
                  onClick={handleCopy}
                  className={cn(
                    "rounded-full shadow-sm transition-all",
                    isResubmit
                      ? "bg-pink-500 hover:bg-pink-600"
                      : "bg-emerald-500 hover:bg-emerald-600",
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      コピー完了!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      コピー
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border-2 border-dashed border-current/10 bg-card/60 p-5 backdrop-blur-sm">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                  {generatedFeedback}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 編集モーダル */}
      <ItemEditorModal
        open={editingSection === "required"}
        onOpenChange={(open) => !open && setEditingSection(null)}
        title="判定用チェック項目の編集"
        items={requiredCheckItems}
        onSave={handleSaveRequiredItems}
        hasText={false}
        hasErrorText={true}
      />
      <ItemEditorModal
        open={editingSection === "good"}
        onOpenChange={(open) => !open && setEditingSection(null)}
        title="良かった点の編集"
        items={goodPointItems}
        onSave={handleSaveGoodPoints}
        textLabel="生成される文章"
      />
      <ItemEditorModal
        open={editingSection === "advice"}
        onOpenChange={(open) => !open && setEditingSection(null)}
        title="アドバイス項目の編集"
        items={adviceItemsList}
        onSave={handleSaveAdviceItems}
        textLabel="生成される文章"
      />
    </>
  );
}
