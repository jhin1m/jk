#!/usr/bin/env node
// SessionStart: in ra một khối ngữ cảnh ngắn (giờ, nhánh, quy ước đặt tên plan, plan đang dở)
// Stdout của hook SessionStart được Claude Code đưa vào context của session.
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const cwd = process.cwd();
const pad = (n) => String(n).padStart(2, '0');
const now = new Date();
const stamp = `${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;

function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
}

// Status coi là đã xong. Chấp nhận nhiều cách ghi: `status: completed`, `**Status:** done`, `Hoàn thành`
const FINISHED = /^(completed?|done|hoàn thành|cancell?ed|archived|huỷ|hủy)/i;

// Plan chưa xong: đọc dòng status ở đầu plans/*/plan.md (frontmatter hoặc dòng in đậm)
function unfinishedPlans() {
  const dir = path.join(cwd, 'plans');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'reports')
    .map((d) => {
      const file = path.join(dir, d.name, 'plan.md');
      if (!fs.existsSync(file)) return null;
      const head = fs.readFileSync(file, 'utf8').slice(0, 1200);
      const m = head.match(/^\**status\**\s*:\s*\**\s*([^\n·|]+)/im);
      const status = m ? m[1].replace(/\*+/g, '').trim() : 'không rõ';
      return FINISHED.test(status) ? null : `plans/${d.name} (${status.slice(0, 30)})`;
    })
    .filter(Boolean)
    .sort()
    .slice(-5);
}

const branch = git('branch --show-current') || '(không phải git repo)';
const plans = unfinishedPlans();
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

const lines = [
  '## jk session',
  `- Thời gian: ${now.toLocaleString('vi-VN', { hour12: false })} (${tz})`,
  `- Nhánh: ${branch}`,
  `- Thư mục plan mới: plans/${stamp}-<slug>/  ·  Báo cáo: plans/reports/<loại>-${stamp}-<slug>.md`,
  `- Plan chưa xong: ${plans.length ? plans.join(', ') : 'không có'}`,
  '',
  '## jk quy tắc',
  '- YAGNI > KISS > DRY. Giữ đúng phạm vi yêu cầu; việc ngoài phạm vi chỉ ghi chú, không làm.',
  '- Đọc code xung quanh trước khi viết; viết giống code hiện có. Không data giả/mock để qua check.',
  '- Không tuyên bố "xong/pass" khi chưa chạy lệnh kiểm chứng và đọc output trong phiên này.',
  '- Không tắt/nới test, lint, type để qua. Không đưa secret vào code hay commit.',
  '- Commit: Conventional Commits, không nhắc AI, không mã plan/phase trong code hay message.',
  '- Workflow: /jk:plan → /jk:cook → /jk:review → /jk:git. Lỗi: /jk:fix. Hỏi: /jk:ask. Bàn hướng: /jk:brainstorm.',
];

process.stdout.write(lines.join('\n') + '\n');
