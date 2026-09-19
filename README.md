# jk — bộ workflow gọn cho Claude Code

10 skill, 5 agent, 2 hook. Chỉ gồm những quy trình dùng hằng ngày, mỗi bước cho chạy đúng model hợp với việc đó: **Fable** lo phần suy nghĩ, **Opus** lo review, **Sonnet** lo implement song song, **Haiku** lo việc vặt.

## Cài đặt

```text
/plugin marketplace add jhin1m/jk
/plugin install jk@jk
```

Cập nhật: `/plugin marketplace update jk`. Gỡ: `/plugin uninstall jk@jk`.

## Lệnh

| Lệnh | Việc | Model |
|---|---|---|
| `/jk:plan [--fast\|--hard] <việc>` | Scout → chốt yêu cầu → `plans/<ts>-<slug>/plan.md` + phases. `red-team`, `validate` | **Fable** |
| `/jk:cook [--fast\|--auto\|--no-test] <plan\|việc>` | Implement → kiểm chứng không side-effect → review | session; phase song song → Sonnet |
| `/jk:fix [--quick] <lỗi>` | Nguyên nhân gốc 6 điểm → sửa → chứng minh hết lỗi. 2 lần fail → hỏi Fable | session |
| `/jk:ask <câu hỏi>` | Phân tích dựa trên code thật, chỉ đọc | session |
| `/jk:brainstorm [--report] <vấn đề>` | Vấn đề trước giải pháp, 2–4 phương án, chốt 1 | **Fable** |
| `/jk:think <vấn đề>` | Kỷ luật suy luận: mục tiêu thật, ≥ 2 giả thuyết, phân loại khẳng định, tự phản biện | **Fable** |
| `/jk:review [--pending\|<commit>\|#PR\|branch]` | Review 2 tầng (đúng spec, chất lượng), tự xác minh lại phát hiện | Opus (agent) |
| `/jk:git cm\|cp\|pr\|merge` | Commit tách nhóm, quét secret, push, PR | Haiku (agent) |
| `/jk:scout <việc>` | Dò file song song, trả bản đồ | Haiku (agent) |
| `/jk:ui [review] <màn hình>` | Bám design system, accessibility, responsive, đủ trạng thái | session |

Luồng thường dùng: `/jk:plan` → `/jk:cook` → `/jk:review` → `/jk:git cp`.

## Agent

| Agent | Model | Vai trò |
|---|---|---|
| `jk:scout` | haiku | Tìm file, chỉ đọc |
| `jk:committer` | haiku | Commit/push, quét secret |
| `jk:implementer` | sonnet | Thực thi một phase có spec rõ |
| `jk:reviewer` | opus | Review, chỉ đọc |
| `jk:advisor` | fable | Cố vấn khi kẹt / red-team plan, chỉ đọc |

## Model chạy thế nào

- Skill **mặc định chạy trên model của session** (`/model`). Skill có `model: fable` (plan, brainstorm, think) chỉ đổi model **trong lượt đó**; sang prompt sau session về lại model cũ.
- **Agent** chạy model riêng ghi trong frontmatter, ngữ cảnh riêng, không thấy cuộc trò chuyện. Nên việc giao agent phải có prompt tự đủ.
- Tài khoản không có Fable thì Claude Code giữ model hiện tại cho skill, còn agent `advisor` báo lỗi. Khi đó đổi `model: fable` thành `opus` trong các file tương ứng.

## Hook

- **SessionStart**: in giờ, nhánh, quy ước đặt tên plan, các plan chưa xong và vài quy tắc cốt lõi vào context.
- **PreToolUse**: chặn đọc `.env*`, `*.pem`, `*.key`, `id_rsa`, `credentials.json` (vẫn cho đọc `.env.example`).

Cần Node ≥ 18.

## Tuỳ biến

Fork repo, sửa `skills/*/SKILL.md` hoặc `agents/*.md`, rồi `/plugin marketplace add <you>/jk`. Kiểm tra cấu trúc: `claude plugin validate .`.

## License

MIT
