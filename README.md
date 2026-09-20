# jk — bộ workflow gọn cho Claude Code

10 skill, 5 agent, 2 hook. Chỉ gồm những quy trình dùng hằng ngày. Skill chạy theo model của session (thường là Opus); agent chia model theo việc: **Opus** review, **Sonnet** implement song song, **Haiku** việc vặt, **Fable** chỉ khi bị kẹt.

## Cài đặt

```text
/plugin marketplace add jhin1m/jk
/plugin install jk@jk
```

Cập nhật: `/plugin marketplace update jk`. Gỡ: `/plugin uninstall jk@jk`.

## Lệnh

| Lệnh | Việc | Model |
|---|---|---|
| `/jk:plan [--fast\|--hard] <việc>` | Scout → chốt yêu cầu → `plans/<ts>-<slug>/plan.md` + phases. `red-team`, `validate` | session; red-team → Fable |
| `/jk:cook [--fast\|--auto\|--no-test] <plan\|việc>` | Implement → kiểm chứng không side-effect → review | session; phase song song → Sonnet |
| `/jk:fix [--quick] <lỗi>` | Nguyên nhân gốc 6 điểm → sửa → chứng minh hết lỗi. 2 lần fail → hỏi Fable | session |
| `/jk:ask <câu hỏi>` | Phân tích dựa trên code thật, chỉ đọc | session |
| `/jk:brainstorm [--report] <vấn đề>` | Vấn đề trước giải pháp, 2–4 phương án, chốt 1 | session |
| `/jk:think <vấn đề>` | Kỷ luật suy luận: mục tiêu thật, ≥ 2 giả thuyết, phân loại khẳng định, tự phản biện | session |
| `/jk:review [--pending\|<commit>\|#PR\|branch]` | Review 2 tầng (đúng spec, chất lượng), tự xác minh lại phát hiện | Opus (agent) |
| `/jk:git cm\|cp\|pr\|merge` | Commit tách nhóm, quét secret, push, PR | Haiku (agent) |
| `/jk:scout <việc>` | Dò file song song, trả bản đồ | Haiku (agent) |
| `/jk:ui [review] <màn hình>` | Bám design system, accessibility, responsive, đủ trạng thái | session |

Luồng thường dùng: `/jk:plan` → `/jk:cook` → `/jk:review` → `/jk:git cp`.

## Mức việc

Các skill tự co giãn theo quy mô thay đổi, **không cần gõ cờ**. Mức suy ra từ chính diff:

| Mức | Dấu hiệu | Hệ quả |
|---|---|---|
| **S** | ≤ 2 file · không đổi contract công khai · không chạm auth/tiền/dữ liệu/migration | `plan` không tạo file, trả lời thẳng trong chat · `cook` chạy test phủ file đã sửa rồi dừng, không spawn reviewer · `review` tự đọc |
| **M** | 3–8 file, hoặc đổi contract nội bộ, hoặc chạm logic nghiệp vụ | Kiểm chứng giới hạn ở module chạm + nơi gọi · reviewer khi chạm logic nghiệp vụ |
| **L** | > 8 file, hoặc đổi contract công khai, hoặc chạm auth/thanh toán/dữ liệu người dùng/migration/hạ tầng | Đủ 5 điểm kiểm chứng · luôn spawn reviewer |

Một dòng sửa trong vùng L vẫn là L. Cờ (`--fast`, `--no-test`, `--quick`, `--hard`) chỉ để ghi đè khi muốn khác mặc định.

Quy tắc đi kèm: đã chạy một lệnh kiểm chứng trong phiên và từ đó chỉ đổi thứ không ảnh hưởng tới nó → nêu lại kết quả cũ, **không chạy lại**. `cook` có bảng "Chống làm quá" liệt kê các kiểu làm thừa hay gặp.

## Agent

| Agent | Model | Vai trò |
|---|---|---|
| `jk:scout` | haiku | Tìm file, chỉ đọc |
| `jk:committer` | haiku | Commit/push, quét secret |
| `jk:implementer` | sonnet | Thực thi một phase có spec rõ |
| `jk:reviewer` | opus | Review, chỉ đọc |
| `jk:advisor` | fable | Cố vấn khi kẹt / red-team plan, chỉ đọc |

## Model chạy thế nào

- Mọi skill **chạy trên model của session** (`/model`). Gặp vấn đề thật sự khó → `/model fable` rồi chạy `/jk:plan` / `/jk:think`; xong thì `/model opus`.
- Fable tự động chỉ dùng qua agent `jk:advisor`: `/jk:fix` hỏng 2 lần, `/jk:plan --hard` / `red-team`, `/jk:cook` gặp ngã rẽ thiết kế ngoài plan.
- Muốn một skill luôn chạy model cố định: thêm `model: <tên>` vào frontmatter — chỉ có hiệu lực trong lượt đó.
- **Agent** chạy model riêng ghi trong frontmatter, ngữ cảnh riêng, không thấy cuộc trò chuyện. Nên việc giao agent phải có prompt tự đủ.
- Tài khoản không có Fable → đổi `model: fable` thành `opus` trong `agents/advisor.md`.

## Hook

- **SessionStart**: in giờ, nhánh, quy ước đặt tên plan, các plan chưa xong và vài quy tắc cốt lõi vào context.
- **PreToolUse**: chặn đọc `.env*`, `*.pem`, `*.key`, `id_rsa`, `credentials.json` (vẫn cho đọc `.env.example`).

Cần Node ≥ 18.

## Tuỳ biến

Fork repo, sửa `skills/*/SKILL.md` hoặc `agents/*.md`, rồi `/plugin marketplace add <you>/jk`. Kiểm tra cấu trúc: `claude plugin validate .`.

## License

MIT
