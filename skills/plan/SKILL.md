---
name: plan
description: 'Lập kế hoạch triển khai trước khi code — scout codebase, chốt yêu cầu chính xác, thiết kế giải pháp, ghi plan.md + phase files trong plans/. Chạy trên Fable. Dùng khi việc chạm nhiều file, có rủi ro, hoặc chưa rõ cách làm.'
when_to_use: '"lên plan", "lập kế hoạch", "thiết kế cách làm", trước tính năng/refactor lớn. Subcommand: red-team, validate.'
argument-hint: "[--fast|--hard] <việc cần làm>  |  red-team <plan-dir>  |  validate <plan-dir>"
model: fable
effort: high
---

# /jk:plan

Đầu vào: $ARGUMENTS

Kết quả là **file plan**, không phải code. Không sửa code trong skill này.

## Chế độ
| Cờ | Research | Red-team | Dùng khi |
|---|---|---|---|
| `--fast` | bỏ | bỏ | việc nhỏ, vùng code đã quen |
| (mặc định) | scout | bỏ | đa số trường hợp |
| `--hard` | scout + docs/web khi cần | có (agent `jk:advisor`) | auth, thanh toán, dữ liệu, API công khai, hạ tầng, ảnh hưởng rộng |

Subcommand: `red-team <plan-dir>` → chỉ chạy bước 5. `validate <plan-dir>` → chỉ chạy bước 3 trên plan có sẵn rồi cập nhật plan.

## 1. Kiểm tra trước
- `ls plans/` — plan chưa xong nào trùng vùng code? Có → hỏi người dùng nối tiếp plan cũ hay tạo mới, và ghi `blockedBy` nếu phụ thuộc.
- Đọc CLAUDE.md, `docs/` liên quan.

## 2. Scout (bắt buộc, trừ khi đầu vào đã là plan)
Vùng code lạ hoặc > ~5 file → spawn `jk:scout` (haiku). Nhiều vùng độc lập → spawn song song nhiều scout trong một message. Vùng nhỏ đã biết → tự Grep/Read.

Nêu cho người dùng 3–6 gạch đầu dòng: stack, file liên quan, pattern hiện có cần theo, contract công khai có thể bị chạm.

## 3. Chốt yêu cầu chính xác
Trước khi viết plan phải trả lời được mỗi mục bằng một câu cụ thể:
1. **Đầu ra**: người dùng thấy gì khi xong (file, màn hình, endpoint + payload, lệnh).
2. **Nghiệm thu**: input → output, edge case bắt buộc chạy đúng.
3. **Ngoài phạm vi**: lần này KHÔNG làm gì.
4. **Ràng buộc cứng**: stack, vị trí file, tương thích ngược, hiệu năng.
5. **Điểm chạm**: file/module sửa; contract nào phải giữ nguyên.

Mục nào không tự suy ra được từ code → hỏi bằng AskUserQuestion (tối đa 4 câu, lựa chọn dựa trên kết quả scout, ghi "(Recommended)" cho lựa chọn đề xuất). Còn lại tự quyết và ghi lý do.

**Thách thức phạm vi**: có cách nhỏ hơn đạt cùng mục tiêu không? Có phần nào YAGNI không? Nói thẳng nếu có.

## 4. Viết plan
Thư mục `plans/<YYMMDD-HHmm>-<slug>/` (giờ lấy bằng `date +%y%m%d-%H%M`).

`plan.md` (≤ 80 dòng):
```md
---
title: <Tên việc>
status: pending          # pending | in-progress | completed
created: <YYYY-MM-DD>
branch: <nhánh>
blockedBy: []
---
# <Tên việc>
## Mục tiêu
## Yêu cầu đã chốt (đầu ra · nghiệm thu · ngoài phạm vi · ràng buộc)
## Quyết định (kèm lý do, phương án đã loại)
## Phases
| # | Phase | File sở hữu | Phụ thuộc | Status |
## Rủi ro / rollback
## Câu hỏi còn mở
```

`phase-NN-<tên>.md` mỗi phase (bỏ nếu `--fast` và chỉ 1 phase):
```md
---
phase: N
status: pending
dependencies: []
---
# Phase N: <Tên>
## Mục tiêu (1–2 câu)
## File: Tạo / Sửa / Xoá (đường dẫn cụ thể)
## Các bước
## Kiểm chứng (lệnh cụ thể + kết quả mong đợi)
## Rủi ro
```

Nguyên tắc chia phase: theo ranh giới file, hai phase không cùng sửa một file → cook chạy song song được. Đủ chi tiết để agent không thấy cuộc trò chuyện vẫn làm được.

## 5. Red-team (`--hard` hoặc subcommand)
Spawn `jk:advisor` (Fable) với đường dẫn plan, yêu cầu tìm: giả định sai, phase thiếu, thứ tự sai, rủi ro dữ liệu/bảo mật, nghiệm thu không kiểm được. Với mỗi phát hiện: chấp nhận → sửa plan; bác bỏ → ghi lý do vào "Quyết định".

Sau khi sửa: đọc lại **toàn bộ** plan.md + mọi phase, tìm chỗ còn mâu thuẫn, tên cũ, quyết định đã bị thay. Còn mâu thuẫn → báo, không đề xuất cook.

## 6. Kết thúc
Tóm tắt ≤ 10 dòng: phases, quyết định chính, rủi ro, câu hỏi còn mở. Bước tiếp theo đề xuất:
- Việc rủi ro, chưa chạy red-team → `/jk:plan red-team <dir>`
- Còn lại → `/jk:cook <dir>`
