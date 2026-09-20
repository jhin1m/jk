---
name: review
description: 'Review code bằng agent reviewer (opus) chạy ngữ cảnh riêng — thay đổi chưa commit, một commit, một PR, hoặc cả nhánh so với main. Tìm bug, regression, bảo mật, vi phạm quy ước, có kịch bản cụ thể.'
when_to_use: '"review", "xem lại code", "check trước khi merge", "review PR #12", "review commit abc123".'
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

## 2. Ai review

| Quy mô diff | Ai làm |
|---|---|
| ≤ 2 file và ≤ ~100 dòng đổi, không chạm auth/tiền/dữ liệu/contract công khai | Session tự review theo đúng 2 tầng bên dưới. Không spawn agent |
| Còn lại | Spawn `jk:reviewer` (opus) |
| > ~15 file, nhiều vùng độc lập (backend + frontend) | 2–3 `jk:reviewer` song song, mỗi cái một nhóm file |

Người dùng gõ `/jk:review` cho một diff nhỏ là muốn có người đọc lại, không phải muốn chờ một agent khởi động. Tự đọc rồi báo kết quả nhanh hơn và không kém chính xác ở quy mô đó.

Prompt cho `jk:reviewer` gồm:
- Lệnh lấy diff ở trên (để agent tự chạy, không dán diff dài).
- Mục tiêu thay đổi nếu biết (từ plan, PR description, cuộc trò chuyện) → để kiểm **đúng spec**: thiếu gì, thừa gì, lệch phạm vi.
- Quy ước repo cần kiểm (CLAUDE.md, docs).

## 3. Xác minh phát hiện
Chỉ áp dụng khi có spawn agent — reviewer có thể sai. Với mỗi phát hiện critical/major: tự mở code kiểm lại kịch bản. Giữ phát hiện đứng được, loại cái sai kèm lý do một dòng.

## 4. Báo cáo
```
Kết luận: OK để merge | Cần sửa | Chặn
1. [critical] file:line — vấn đề · kịch bản · gợi ý
2. ...
Đã loại: <phát hiện> — lý do
```
Không tự sửa code trừ khi người dùng yêu cầu. Muốn sửa → `/jk:fix` hoặc sửa trực tiếp theo gợi ý.
