# RouteCraft（行程织）技术栈说明

## 1️⃣ 前端

**技术栈：** React + TypeScript + TailwindCSS + 高德/Mapbox JS SDK  

**理由：**
- React：组件化开发，社区大，维护和迭代方便
- TypeScript：类型检查，减少 bug，商用项目推荐
- TailwindCSS：快速布局，UI 风格统一，适合工具型产品
- 高德/Mapbox JS SDK：地图展示、路线可视化、景点标记
- ✅ 主流成熟，问题容易找到解决方案

---

## 2️⃣ 后端

**技术栈：** Python + FastAPI + Celery + Redis  

**理由：**
- FastAPI：快速开发 RESTful API，文档自动生成，支持异步
- Celery + Redis：处理异步任务（如小红书抓取、路线计算）
- ✅ Python 生态成熟，社区丰富，商用稳定

---

## 3️⃣ 数据库

**技术栈：** PostgreSQL + PostGIS  

**理由：**
- PostgreSQL：开源、稳定，商用可靠，社区活跃
- PostGIS：地理计算能力（距离、路线优化），减少算法实现成本
- ✅ 适合路线规划项目，成熟可靠

---

## 4️⃣ 地图与路线计算

**技术栈：** 高德地图 API / Mapbox  

**理由：**
- 路线可视化、距离计算、路径优化
- 文档完善，社区多案例
- ✅ 成熟、易用，匹配中小型行程规划项目

---

## 5️⃣ 数据抓取（小红书/攻略导入）

**技术栈：** Selenium + Requests/BeautifulSoup + Asyncio  

**理由：**
- Selenium：处理动态网页
- Requests/BeautifulSoup：处理静态网页，快速解析
- Asyncio / aiohttp：提高并发抓取效率
- ✅ 成熟方案，问题容易解决，支持中小规模商用爬取

---

## 6️⃣ 部署与运维

**技术栈：** Docker + Nginx + Gunicorn + 云服务器（AWS/阿里云）  

**理由：**
- Docker：环境一致性，方便部署
- Nginx：反向代理，静态资源服务
- Gunicorn：FastAPI 生产环境部署
- 云服务器：按需扩容，支持未来多城市扩展
- ✅ 标准商用方案，成熟稳定，坑少

---

## 7️⃣ 技术选型原则

1. 技术主流、社区活跃 → 遇到问题容易解决  
2. 工具成熟、坑少 → 商用稳定性高  
3. 匹配项目规模 → MVP 快速开发，未来可迭代扩展  

---

## 8️⃣ 技术选型总结表

| 模块           | 技术栈                     | 选择理由 |
|----------------|----------------------------|---------|
| 前端           | React + TypeScript + TailwindCSS + 高德/Mapbox | 组件化开发、社区大、易维护、易扩展 |
| 后端           | Python + FastAPI + Celery + Redis | 快速开发 API、异步任务成熟、社区支持好 |
| 数据库         | PostgreSQL + PostGIS       | 商用稳定、地理计算成熟、社区活跃 |
| 地图/路线       | 高德/Mapbox API           | 路线可视化、文档完善、匹配项目规模 |
| 爬虫/数据抓取   | Selenium + Requests/BeautifulSoup + Asyncio | 成熟方案、问题容易解决、支持动态网页 |
| 部署/运维       | Docker + Nginx + Gunicorn + 云服务器 | 商用标准方案、易扩展、坑少 |