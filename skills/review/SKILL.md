---
name: review
description: Review code bằng agent reviewer (opus) chạy ngữ cảnh riêng — thay đổi chưa commit, một commit, một PR, hoặc cả nhánh so với main. Tìm bug, regression, bảo mật, vi phạm quy ước, có kịch bản cụ thể.
when_to_use: "review", "xem lại code", "check trước khi merge", "review PR #12", "review commit abc123".
argument-hint: "[--pending | <commit> | #<PR> | branch]"
---

# /jk:review

Đối tượng: $ARGUMENTS

## 1. Xác định phạm vi
| Đầu vào | Lấy diff bằng |
|---|---|
| trống / `--pending` | `git diff HEAD` + `git status --porcelain` (file untracked liên quan) |
| hash commit (≥ 7 ký tự hex) | `git show <hash>` |
| `#123` hoặc URL PR | `gh pr diff 123` + `gh pr view 123` |
| `branch` | `git diff $(git merge-base HEAD main)...HEAD` |

Không có thay đổi → báo và dừng.

## 2. Giao reviewer
Spawn `jk:reviewer` (opus). Prompt gồm:
- Lệnh lấy diff ở trên (để agent tự chạy, không dán diff dài).
- Mục tiêu thay đổi nếu biết (từ plan, PR description, cuộc trò chuyện) → để kiểm **đúng spec**: thiếu gì, thừa gì, lệch phạm vi.
- Quy ước repo cần kiểm (CLAUDE.md, docs).

Diff lớn (> ~15 file, nhiều vùng độc lập như backend + frontend) → spawn 2–3 reviewer song song, mỗi cái một nhóm file.

## 3. Xác minh phát hiện
Reviewer có thể sai. Với mỗi phát hiện critical/major: tự mở code kiểm lại kịch bản. Giữ phát hiện đứng được, loại cái sai kèm lý do một dòng.

## 4. Báo cáo
```
Kết luận: OK để merge | Cần sửa | Chặn
1. [critical] file:line — vấn đề · kịch bản · gợi ý
2. ...
Đã loại: <phát hiện> — lý do
```
Không tự sửa code trừ khi người dùng yêu cầu. Muốn sửa → `/jk:fix` hoặc sửa trực tiếp theo gợi ý.
