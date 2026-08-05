# parallel-subagent-planner (v3.0.0)

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` 是一个轻量级的 **Agent Planning Harness Skill**，帮助 Codex 在编码任务中决策何时使用子 Agent、构建安全的文件作用域边界、安排依赖先后顺序、生成干练的子 Agent 提示词，并发现可复用的长期 Agent 角色。

---

## 核心功能

- **拆分决策**：评估并行子 Agent 是否能真正节省时间，或是否需要先行只读探索降低风险，否则优先主线程直接执行。
- **文件隔离**：保证并行子 Agent 修改完全独立的文件范围 (`write(A) ∩ write(B) = ∅`)，绝不相互覆盖代码。
- **执行先后顺序**：指定共享契约文件由唯一所有者（主线程或某个子 Agent）优先完成修改，再解锁依赖它的下游只读消费。
- **干练提示词**：生成包含目标、文件读写边界、忽略范围和客观验证命令的子 Agent Prompt。
- **主线程整合**：由主线程合并子 Agent 产物并执行工作区全局集成测试。
- **长期 Agent 沉淀**：当存在显式重复使用证据时，提示用户并在获得批准后保存为 `.codex/agents/<name>.toml`。

---

## 核心循环

```text
Decide ➔ Split ➔ Isolate ➔ Order ➔ Prompt ➔ Integrate
```

---

## 目录结构

```text
parallel-subagent-planner/
├─ SKILL.md                          # 核心 Skill 指令正文 (~50 行)
├─ agents/
│  └─ openai.yaml                    # Codex 元数据配置
├─ references/
│  ├─ lane-decomposition.md          # 任务切分、文件隔离与执行先后顺序
│  └─ child-prompts.md               # 子 Agent Prompt 模板与自定义 Agent 保存建议
├─ README.md                         # 英文说明文档
├─ README.zh-CN.md                   # 中文说明文档
├─ CHANGELOG.md                      # Release 版本历史
└─ LICENSE                           # MIT 开源协议
```

---

## 安装方式

### 个人技能安装 (Personal Skill Installation)

```bash
mkdir -p "$HOME/.agents/skills"
git clone --depth 1 \
  https://github.com/manhua-man/codex-parallel-subagent-planner.git \
  "$HOME/.agents/skills/parallel-subagent-planner"
```

### 项目 Workspace 安装 (Project Workspace Installation)

复制仓库内容至目标项目：

```text
<target-repo>/.agents/skills/parallel-subagent-planner/
```

---

## 开源协议

[MIT License](LICENSE) © 2026 manhua-man
