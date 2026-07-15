# parallel-subagent-planner

[English](README.md) | [简体中文](README.zh-CN.md)

`parallel-subagent-planner` 是一个面向 Codex 的 skill，用来在轻量任务拆分和项目级模块规划之间选择，并为边界足够清楚的 lane 发送最小、非递归的 prompt。

它主要负责：

- 判断任务是否值得并行拆分
- 区分单一边界任务与完整的多模块软件目标
- 在项目级工作中发现模块依赖、共享契约和可启动的并行前沿
- 让默认判断路径保持足够短
- 规划 lane 归属，避免写入范围重叠
- 为每条 lane 建议 `agent type`、模型和 reasoning effort
- 出现强拆分信号时考虑 Codex 子智能体，然后只启动边界清楚的 lane
- 为暂不适合启动的 lane 生成可直接发送的 prompt

这个仓库保存的是该 skill 及其配套 prompt 资产的维护版本。

实际执行仍依赖 Codex 宿主会话、工具和子智能体启动能力。本仓库提供规划指令和 prompt 资产，不提供本地 runner、Python 包、CLI 或 session manager。

当前适用范围：

- 面向 Codex 及 Codex 子智能体工作流
- 文中的模型与 `agent type` 建议基于 Codex 当前支持的子智能体能力
- 目前不声明兼容 Claude 或其他 agent runtime，除非后续有明确文档说明

## 工作模式

| 模式 | 适用场景 | Planner 行为 |
|---|---|---|
| Task Mode | 一个边界清楚的改动、一个模块，或已经确认的具名 lane | 使用轻量拆分闸门，不做全仓重型发现 |
| Project Mode | 完整应用或已确认目标跨多个模块和共享契约 | 盘点完整执行范围，指定契约 owner，按依赖安全的 wave 调度 |

skill 加载后会自动选择模式。显式调用 `$parallel-subagent-planner` 可以保证 skill 被加载；不显式调用时，是否自动激活仍由 Codex 根据 skill description 与用户请求匹配决定。

## 组合边界

这个 skill 只调度实现工作，不决定产品战略，也不替代专门工作流。

| 工作流 | 负责什么 | 与 Planner 的关系 |
|---|---|---|
| 产品需求 / PRD | 做什么、为什么做 | 先确认范围，再把接受后的目标交给 planner |
| `autoplan` 和 plan-review skills | CEO、设计、工程和 DX 审查 | 先完成审查，planner 再调度接受后的实现 |
| OpenSpec | Proposal、design、spec、task 选择和状态 | `openspec-apply-change` 继续主导；planner 只在 pending tasks 内调度安全 lane |
| `coding-agents` | 外部 backend 选择和 session 路由 | backend 路由与 lane 调度分离；只有用户明确要求时才组合 |

禁止两个执行编排器同时写同一批 write scopes。

## Quick Example

输入：

```text
如果值得并行就拆分这个任务：
- 先验证当前导出行为
- 再统一导出流程行为
- 保持行为不变
- files: src/runtime/session-view-service.ts, src/extension.ts
```

默认 Compact 输出：

```text
Why parallel
这个任务包含一条只读行为确认 lane 和一条实现 lane，但实现依赖前者的调查结果。

Lane summary
- Export behavior audit：agent type explorer，model gpt-5.4，reasoning high，read_scope src/runtime/session-view-service.ts + src/extension.ts，write_scope none，deliverable 行为映射，can_launch yes，held_reason safe
- Export flow worker：agent type worker，model gpt-5.5，reasoning high，read_scope 同上再加 audit handoff，write_scope src/runtime/session-view-service.ts + src/extension.ts，deliverable 保持行为不变的重构，can_launch no，held_reason blocked

Launch status
- Launched：Export behavior audit
- Held：Export flow worker，因为它依赖 explorer 的调查结果

Integration note
先启动 audit，等当前行为和验收点清楚后，再启动或由主线程处理 worker。
```

Compact 默认不展示所有 Ready prompts，除非某条 lane 被 Held。需要完整可发送 prompt 时再要求 `Full`。

每条 lane 都会带上 `read_scope`、`write_scope`、`can_launch` 和 `held_reason`，方便 Codex 只启动值得启动且安全的 lane，同时 hold 住风险、依赖未满足或成本不划算的 lane。

## Benchmark Snapshots

历史本地运行记录在 `references/benchmarks.md`。

## 目录结构

```text
parallel-subagent-planner/
├─ SKILL.md
├─ agents/
│  └─ openai.yaml
├─ docs/
│  ├─ request-flow.md
│  └─ request-flow.zh-CN.md
├─ examples/
│  └─ fixtures.md
├─ references/
│  ├─ benchmarks.md
│  ├─ long-term-agents.md
│  ├─ maintenance.md
│  ├─ project-scale-planning.md
│  ├─ planner-details.md
│  └─ prompt-templates.md
└─ opsx-parallel.md
```

各文件作用：

- `SKILL.md`：核心规划逻辑、lane 拆分规则、模型与 reasoning 建议
- `agents/openai.yaml`：agent 元数据和默认入口提示
- `docs/request-flow.md`：说明该 skill 在 Codex 请求链路中的位置，以及 lane 返回后的处理流程
- `docs/request-flow.zh-CN.md`：中文请求链路说明
- `examples/fixtures.md`：固定 launch、hold、promotion 决策的预期行为样例
- `references/benchmarks.md`：历史 benchmark snapshots 和记录规则
- `references/long-term-agents.md`：可复用 agent promotion 的详细判断标准
- `references/maintenance.md`：source of truth、漂移检查和 benchmark 更新说明
- `references/project-scale-planning.md`：完整软件目标的模块图、共享契约 owner、并行前沿、wave 和动态重规划规则
- `references/prompt-templates.md`：可复用的 lane prompt 模板
- `references/planner-details.md`：详细 lane 规划规则，只在拆分不清时加载
- `opsx-parallel.md`：配套命令入口，用于轻量级并行规划和 prompt 生成

## 设计原则

- 追求最小必要 lane 数，而不是机械拆成固定数量
- 先判断规模：单任务保持轻量，多模块软件必须先盘点完整范围再并行
- 项目 wave 必须服从依赖图，不能把完整产品目标缩减成眼前第一个模块
- 发车成本感知：出现任一强拆分信号就考虑子智能体，但多个共享验收的小型写回应合并，而不是每个文件单独开 worker
- 子线程 prompt 必须禁止递归拆分：已分配的 lane 只在子线程本地执行，不再继续发车
- Task Mode 避免重型全仓发现；Project Mode 在执行图未知时只启动一个有界 discovery lane
- 必须尊重真实执行约束，只使用实际可用的 agent type
- 考虑子智能体不等于一定发车；只有目标、读写范围、交付物和验收都清楚的 lane 才启动
- 允许多个可写 worker，但 prompt 必须紧凑、写域必须分离，并且预期收益应能覆盖子线程上下文成本
- 每条 lane 可以分配 agent type、model 和 reasoning；默认不继承完整上下文，只有 compact lane brief 不足以安全描述任务时才继承 full history
- 单一全量测试套件是主线程集成验证，不应该让每个 worker 重复跑全量验证
- 当写域重叠、验收不清或 worker 依赖 explorer 未完成结果时，先 hold 住相关 lane
- 用户已经给出具体文件、测试、文档、台账时，优先引用这些具体信息
- 最终集成和统一收口仍由主线程负责，并且 worker 运行期间主线程不改它的写入范围
- 独立 Codex 子智能体仍会接收运行时基础上下文；这个 skill 优化的是少复制历史、避免递归规划、压缩 lane prompt，而不是声明多个 agent 能共享同一份 prompt context

## 维护工作流

1. 更新 skill 源文件和配套 prompt 资产。
2. 行为变化时同步更新 fixtures 或 references。
3. 从该仓库同步本地已安装 skill。
4. 检查 diff 并运行 `git diff --check`。
5. 提交并推送仓库变更。
