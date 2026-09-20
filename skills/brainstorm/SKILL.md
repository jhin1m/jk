---
name: brainstorm
description: 'Brainstorm giải pháp với phân tích đánh đổi thẳng thắn. Kiểm tra vấn đề trước khi bàn giải pháp, phản biện ý tưởng của người dùng khi cần, chốt một hướng. Không sửa code.'
when_to_use: '"brainstorm", "bàn cách làm", "có nên", "nghĩ giúp phương án", "ý tưởng này ổn không", trước /jk:plan khi hướng đi chưa rõ.'
argument-hint: "[--report] <vấn đề | ý tưởng>"
effort: high
disallowed-tools: Edit NotebookEdit
---

# /jk:brainstorm

Chủ đề: $ARGUMENTS

Thẳng thắn quan trọng hơn dễ nghe. Ý tưởng có vấn đề → nói ngay, kèm lý do.

## 1. Vấn đề trước, giải pháp sau
- Người dùng đưa sẵn giải pháp ("thêm Redis", "chuyển sang GraphQL") → lùi lại: vấn đề thật là gì? đo được chưa? Có cách rẻ hơn giải quyết cùng vấn đề không?
- Chốt mục tiêu cuối + ràng buộc (thời gian, người làm, hạ tầng hiện có, chi phí).
- Scout code liên quan (`jk:scout` nếu rộng) — phương án phải khớp repo thật, không lý thuyết suông.

## 2. Hỏi đúng chỗ
Thiếu thông tin quyết định hướng đi (quy mô, ngân sách, ưu tiên UX vs tốc độ) → hỏi bằng AskUserQuestion, tối đa 3 câu mỗi lượt. Không hỏi thứ tự tra được.

## 3. Phương án
Câu hỏi thật ra chỉ có một đáp án đúng (repo đã có sẵn cách làm, hoặc thư viện đang dùng đã giải quyết) → nói thẳng đáp án đó và lý do, **không dựng phương án giả để có đủ bảng**. Ba phương án trong đó hai cái rõ ràng tệ hơn là trang trí, không phải phân tích.

Còn lại: 2–4 phương án thật sự khác nhau (không phải biến thể của cùng một ý). Mỗi cái:
- Cách hoạt động (1–2 câu)
- Được gì / mất gì · chi phí làm · chi phí vận hành · độ khó đảo ngược
- Rủi ro lớn nhất

Tra docs/web khi phương án dựa vào thư viện/dịch vụ có thể đã đổi.

## 4. Chốt
- **Một khuyến nghị**, lý do, và điều kiện nào thì nên đổi sang phương án khác.
- Tự phản biện khuyến nghị: điểm yếu nhất là gì?
- YAGNI: phần nào chưa cần làm bây giờ.

## 5. Kết thúc
`--report` → ghi `plans/reports/brainstorm-<YYMMDD-HHmm>-<slug>.md` (vấn đề · phương án · khuyến nghị · câu hỏi mở).
Gợi ý bước tiếp: `/jk:plan <hướng đã chốt>`.
