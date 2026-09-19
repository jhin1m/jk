---
name: cook
description: Triển khai code theo plan có sẵn hoặc yêu cầu đã rõ — implement, kiểm chứng không side-effect, review bằng agent. Tự chia việc: session tự làm phần cần ngữ cảnh, phase độc lập giao agent sonnet chạy song song.
when_to_use: "làm đi", "implement", "code theo plan", "thực thi plan", "/jk:cook plans/...".
argument-hint: "[--fast|--auto|--no-test] <plan-dir | mô tả việc>"
---

# /jk:cook

Đầu vào: $ARGUMENTS

## Chế độ
| Cờ | Hành vi |
|---|---|
| (mặc định) | Dừng xin duyệt sau khi implement xong, trước khi finalize |
| `--auto` | Không dừng, trừ khi review/test phát hiện side-effect |
| `--fast` | Bỏ review agent; vẫn phải kiểm chứng |
| `--no-test` | Bỏ chạy test (vẫn type-check); nêu rõ rủi ro ở báo cáo cuối |

## 1. Nạp việc
- Đầu vào là plan → đọc `plan.md` + mọi phase file. Đặt `status: in-progress`.
- Đầu vào là mô tả:
  - Nhỏ, rõ (≤ ~3 file, biết chính xác làm gì) → scout nhanh rồi làm.
  - Lớn hoặc chưa trả lời được "đầu ra / nghiệm thu / ngoài phạm vi" → dừng, đề nghị `/jk:plan`. Người dùng nói "cứ code đi" thì tôn trọng.
- Đọc CLAUDE.md và code quanh chỗ sẽ sửa. Tìm pattern có sẵn trước khi viết cái mới.

## 2. Chia việc
| Tình huống | Ai làm |
|---|---|
| 1 phase, hoặc các phase phụ thuộc chặt | Session này tự làm |
| ≥ 2 phase độc lập, sở hữu file tách biệt | Mỗi phase một `jk:implementer` (sonnet), spawn song song trong CÙNG message |
| Phase cần hiểu sâu ngữ cảnh cuộc trò chuyện | Session tự làm |
| Gặp ngã rẽ thiết kế không có trong plan | Hỏi `jk:advisor` (Fable) hoặc người dùng — không tự đoán |

Prompt cho `jk:implementer` phải tự đủ: mục tiêu, file được phép sửa, các bước, lệnh kiểm chứng, tiêu chí xong, pattern cần theo (file mẫu). Agent không thấy cuộc trò chuyện. Đọc lại diff của agent — báo cáo DONE không phải bằng chứng.

## 3. Implement
- Viết giống code xung quanh (tên, comment, idiom). Không `any`, không data giả, không tắt test/lint.
- Giữ phạm vi. Thấy việc ngoài phạm vi → ghi vào báo cáo, không làm.
- Cập nhật `status` phase file khi xong mỗi phase.

## 4. Kiểm chứng — không side-effect (bắt buộc)
Chưa xong cho tới khi chứng minh được:
1. Mọi tiêu chí nghiệm thu đạt.
2. Test pass — cả test ở module dùng chung file/contract với thay đổi.
3. Không vỡ logic ở điểm chạm: Grep nơi gọi các hàm/type đã đổi, đi qua từng chỗ.
4. Không có lỗi type/lint/build mới (lệnh lấy từ `package.json`/CLAUDE.md).
5. Contract công khai (signature export, response API, schema, env, config key) không đổi — hoặc đổi có chủ đích và nêu rõ.

**Luật sắt**: không tuyên bố "xong / pass" khi chưa chạy lệnh và đọc output trong phiên này.

Phát hiện side-effect/regression → DỪNG. Hỏi người dùng (AskUserQuestion) với: cái gì vỡ, vì sao, 2–4 lựa chọn (revert phần đó / cập nhật chỗ phụ thuộc / thêm lớp tương thích / chấp nhận vì hành vi cũ là bug). Không vá lặng lẽ.

## 5. Review (trừ `--fast`)
Spawn `jk:reviewer` (opus) với: danh sách file đã sửa, tiêu chí nghiệm thu, tóm tắt scout/pattern. Yêu cầu kiểm 2 tầng: (a) đúng spec — thiếu gì, thừa gì; (b) chất lượng — bug, bảo mật, edge case.

Với mỗi phát hiện: kiểm lại trong code rồi mới sửa; phát hiện sai → ghi lý do bác bỏ. Critical/major phải sửa và kiểm chứng lại. Tối đa 3 vòng review, quá thì hỏi người dùng.

## 6. Finalize
- Plan: cập nhật `status` mọi phase + `plan.md` (completed nếu xong hết).
- Docs: chỉ cập nhật `docs/` nếu thay đổi hành vi người dùng thấy, lệnh, kiến trúc.
- Báo cáo: đã làm gì · lệnh kiểm chứng + kết quả thật · phát hiện review đã xử lý · việc còn lại / rủi ro.
- Không commit trừ khi được yêu cầu → gợi ý `/jk:git cm`.
