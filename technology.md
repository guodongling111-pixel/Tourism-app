# RouteCraft（行程织）技术栈说明

## 1️⃣ 前端

**技术栈：** React + TypeScript + TailwindCSS + Leaflet

**理由：**
- React：组件化开发，维护与迭代效率高
- TypeScript：类型约束，降低运行错误，适合中长期维护
- TailwindCSS：快速构建 UI，保证风格统一
- Leaflet：轻量级地图组件，用于地图展示与路线可视化
- ✅ 当前采用本地 Mock 数据驱动（ATTRACTIONS / FOOD_SPOTS / cityCoords）

---

## 2️⃣ 后端

**技术栈：** Python + FastAPI + Celery + Redis（规划中）

**理由：**
- FastAPI：高性能 REST API 框架，支持异步处理
- Celery + Redis：用于异步任务调度（如攻略解析、路线计算）
- 当前版本主要用于逻辑预留与后续扩展
- ✅ 当前 MVP 未完全启用后端服务（以 Mock 前端为主）

---

## 3️⃣ 数据存储

**技术栈：** 前端 Mock JSON（当前版本）

**理由：**
- 当前数据直接定义在前端代码中（src/App.jsx）
- 包括：
  - ATTRACTIONS（景点数据）
  - FOOD_SPOTS（餐饮数据）
  - cityCoords（城市坐标）
- 无数据库、无 API、无后端持久化存储
- ✅ 适用于 MVP 快速验证阶段

---

## 4️⃣ 地图与路线计算

**技术栈：** Leaflet（后续可接入高德 API）

**理由：**
- Leaflet：轻量级地图方案，快速实现可视化
- 支持基础路线展示与点位标记
- 后续可升级接入高德/Mapbox 提升路径规划能力
- ✅ 当前为前端本地计算 + 可视化展示

---

## 5️⃣ 数据处理 / 攻略解析

**技术栈：** 前端本地处理 + NLP/LLM（规划中）

**理由：**
- 当前采用用户输入文本解析（小红书攻略）
- 通过前端逻辑 + 结构化规则生成候选行程卡片
- 后续可升级为后端 NLP/LLM 服务
- ❌ 当前无爬虫、无外部数据抓取

---

## 6️⃣ 部署与运维

**技术栈：** Vercel + Serverless

**理由：**
- Vercel：前端一键部署，自动 CI/CD
- Serverless Functions：用于轻量 API（如未来扩展）
- CDN 自动加速静态资源
- ✅ 零运维，适合 MVP 快速上线与迭代

---

## 7️⃣ 技术选型原则

1. 优先 MVP 快速验证，降低后端复杂度  
2. 使用轻量技术栈，减少运维成本  
3. 所有复杂能力（爬虫 / 数据库 / AI）均预留扩展接口  
4. 以“前端驱动 + Mock 数据 + 可迭代架构”为核心  

---

## 8️⃣ 技术选型总结表

| 模块         | 技术栈 | 当前实现状态 |
|--------------|--------|--------------|
| 前端         | React + TypeScript + TailwindCSS + Leaflet | 已完成 |
| 后端         | FastAPI + Celery + Redis | 规划中（未完全启用） |
| 数据存储     | 前端 Mock JSON（src/App.jsx） | 已完成 |
| 地图/路线     | Leaflet | 已完成 |
| 攻略解析     | 前端规则 + NLP/LLM（逻辑层） | 部分实现 |
| 部署/运维     | Vercel + Serverless | 已完成 |