#!/usr/bin/env node
// PreToolUse: chặn Claude đọc file chứa secret (.env*, khoá riêng, credentials).
// Exit code 2 = chặn tool call; stderr được gửi lại cho Claude làm lý do.
'use strict';

// File mẫu được phép đọc
const ALLOWED = /\.env\.(example|sample|template|dist)$/i;

// Tên file nhạy cảm
const SENSITIVE = [
  /(^|[\/\s'"=])\.env(\.[\w-]+)?($|[\s'"|;&)])/i, // .env, .env.local, .env.production
  /\.(pem|key|p12|pfx)($|[\s'"|;&)])/i,
  /(^|[\/\s'"])id_(rsa|ed25519|ecdsa)($|[\s'"|;&)])/i,
  /(^|[\/\s'"])credentials(\.json)?($|[\s'"|;&)])/i,
];

function isSensitive(text) {
  if (!text) return false;
  // Bỏ các file mẫu trước khi so khớp để `.env.example` không bị chặn nhầm
  const cleaned = text.replace(/\S*\.env\.(example|sample|template|dist)\b/gi, '');
  return SENSITIVE.some((re) => re.test(cleaned));
}

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0); // không parse được thì không can thiệp
  }
  const tool = input.tool_name || '';
  const ti = input.tool_input || {};

  let target = '';
  if (tool === 'Read' || tool === 'Edit' || tool === 'Write') target = ti.file_path || '';
  else if (tool === 'Grep') target = ti.path || '';
  else if (tool === 'Bash') target = ti.command || '';
  else process.exit(0);

  if (tool !== 'Bash' && ALLOWED.test(target)) process.exit(0);
  if (!isSensitive(target)) process.exit(0);

  process.stderr.write(
    `jk privacy-block: "${target.slice(0, 120)}" có thể chứa secret nên bị chặn.\n` +
      'Hãy hỏi người dùng giá trị cần dùng, hoặc đề nghị họ tự chạy lệnh bằng tiền tố `!` trong prompt.\n' +
      'Được phép đọc file mẫu: .env.example / .env.sample.\n'
  );
  process.exit(2);
});
