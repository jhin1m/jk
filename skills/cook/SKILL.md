---
name: cook
description: 'Triển khai code theo plan có sẵn hoặc yêu cầu đã rõ — implement, kiểm chứng không side-effect, review bằng agent. Tự chia việc: session tự làm phần cần ngữ cảnh, phase độc lập giao agent sonnet chạy song song.'
when_to_use: '"làm đi", "implement", "code theo plan", "thực thi plan", "/jk:cook plans/...".'
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

Độ sâu kiểm chứng và việc gọi reviewer **tự co giãn theo mức việc S/M/L** (bước 4–5). Cờ chỉ để ghi đè khi muốn khác mặc định.

## 1. Nạp việc
- Đầu vào là plan → đọc `plan.md` + mọi phase file. Đặt `status: in-progress`.
- Đầu vào là mô tả: ước lượng mức việc (S/M/L) trước.
  - **S** → scout nhanh rồi làm. Không dựng plan file.
  - **M/L** mà chưa trả lời được "đầu ra / nghiệm thu / ngoài phạm vi" → dừng, đề nghị `/jk:plan`. Người dùng nói "cứ code đi" thì tôn trọng.
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

## 4. Kiểm chứng — không side-effect

Năm điểm đầy đủ:
1. Mọi tiêu chí nghiệm thu đạt.
2. Test pass — cả test ở module dùng chung file/contract với thay đổi.
3. Không vỡ logic ở điểm chạm: Grep nơi gọi các hàm/type đã đổi, đi qua từng chỗ.
4. Không có lỗi type/lint/build mới (lệnh lấy từ `package.json`/CLAUDE.md).
5. Contract công khai (signature export, response API, schema, env, config key) không đổi — hoặc đổi có chủ đích và nêu rõ.

Chạy bao nhiêu trong số đó là **theo mức việc**:

| Mức | Kiểm tối thiểu |
|---|---|
| Chỉ chữ/comment/docs/config không ảnh hưởng runtime | Đọc lại diff. Không chạy test |
| **S** | Điểm 1 + 5. Có test sẵn phủ file đã sửa → chạy đúng test đó; không có → type-check/lint |
| **M** | Điểm 1–5, nhưng giới hạn ở module chạm + nơi gọi — không chạy cả bộ test |
| **L** | Đủ 5 điểm, test toàn vùng ảnh hưởng, + reviewer ở bước 5 |

**Luật sắt**: không tuyên bố "xong / pass" khi chưa chạy lệnh và đọc output trong phiên này.

**Mặt kia của luật sắt**: đã chạy đúng lệnh đó trong phiên này và từ đó chỉ đổi thứ không ảnh hưởng tới nó → nêu lại kết quả cũ kèm thời điểm, **không chạy lại**. Chạy lại một lệnh mà đầu vào của nó không đổi thì không phải kiểm chứng, chỉ là tốn thời gian của người dùng.

Phát hiện side-effect/regression → DỪNG. Hỏi người dùng (AskUserQuestion) với: cái gì vỡ, vì sao, 2–4 lựa chọn (revert phần đó / cập nhật chỗ phụ thuộc / thêm lớp tương thích / chấp nhận vì hành vi cũ là bug). Không vá lặng lẽ.

## 5. Review

| Mức | Có spawn `jk:reviewer` không |
|---|---|
| Chỉ chữ/docs · **S** | Không. Tự đọc lại diff một lượt là đủ |
| **M** | Có, nếu chạm logic nghiệp vụ hoặc sửa ≥ 3 file. Còn lại tự đọc |
| **L** | Luôn có |

`--fast` bỏ reviewer ở mọi mức. Khi có spawn: `jk:reviewer` (opus) với: danh sách file đã sửa, tiêu chí nghiệm thu, tóm tắt scout/pattern. Yêu cầu kiểm 2 tầng: (a) đúng spec — thiếu gì, thừa gì; (b) chất lượng — bug, bảo mật, edge case.

Với mỗi phát hiện: kiểm lại trong code rồi mới sửa; phát hiện sai → ghi lý do bác bỏ. Critical/major phải sửa và kiểm chứng lại. Tối đa 3 vòng review, quá thì hỏi người dùng.

## 6. Finalize
- Plan: cập nhật `status` mọi phase + `plan.md` (completed nếu xong hết).
- Docs: chỉ cập nhật `docs/` nếu thay đổi hành vi người dùng thấy, lệnh, kiến trúc.
- Báo cáo: đã làm gì · lệnh kiểm chứng + kết quả thật · phát hiện review đã xử lý · việc còn lại / rủi ro.
- Không commit trừ khi được yêu cầu → gợi ý `/jk:git cm`.

## Chống làm quá

| Ý nghĩ | Thực tế |
|---|---|
| "Chạy cả bộ test cho chắc" | Test ngoài vùng ảnh hưởng pass thì không chứng minh gì. Chạy đúng vùng. |
| "Vừa chạy test xong nhưng chạy lại cho chắc" | Đầu vào không đổi thì kết quả không đổi. Nêu lại kết quả cũ. |
| "Spawn reviewer cho chắc" | Review một thay đổi 3 dòng tốn hơn giá trị nó mang lại. Mức S thì tự đọc. |
| "Việc nhỏ nhưng cứ lên plan cho đúng quy trình" | Plan cho việc ≤ 2 file là thủ tục, không phải kỷ luật. |
| "Người dùng prompt tiếp nên phải kiểm lại từ đầu" | Kiểm đúng phần vừa đổi. Phần đã chứng minh ở lượt trước vẫn còn giá trị. |

Bỏ bước vì lười là lỗi. Làm bước không cần thiết cũng là lỗi — nó dạy người dùng bỏ qua báo cáo của bạn.
