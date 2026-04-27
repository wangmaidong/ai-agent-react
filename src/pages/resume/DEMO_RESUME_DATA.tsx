import { iResumeFormData } from "./resume.utils";

export const DEFAULT_RESUME_PRIMARY = "#4816ff";
export const DEFAULT_RESUME_SECONDARY = "#ff1639";

export const DEMO_RESUME_DATA: iResumeFormData = {
  title: "高级AI全栈开发工程师",
  primary: "#4816ff",      // 主色调：科技蓝
  secondary: "#ff1639",    // 辅色调：深紫
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",

  basic: {
    title: "基本信息",
    data: [
      { label: "姓名", val: "李四", icon: "bi bi-person-fill" },
      { label: "年龄", val: "29", icon: "bi bi-calendar3" },
      { label: "工作年限", val: "7年", icon: "bi bi-briefcase-fill" },
      { label: "意向岗位", val: "AI全栈开发工程师 / 技术负责人", icon: "bi bi-code-square" },
      { label: "意向城市", val: "北京 / 上海 / 深圳 / 远程", icon: "bi bi-geo-alt-fill" },
      { label: "意向薪资", val: "50K-70K / 年薪80万+", icon: "bi bi-currency-yen" },
      { label: "入职时间", val: "随时到岗 / 2周内", icon: "bi bi-clock-fill" },
      { label: "电话号码", val: "138-1234-5678", icon: "bi bi-telephone-fill" },
      { label: "邮箱", val: "lisi.ai.dev@email.com", icon: "bi bi-envelope-fill" },
      { label: "最高学历", val: "硕士 · 计算机科学与技术", icon: "bi bi-mortarboard-fill" },
      { label: "GitHub", val: "github.com/lisi-ai", icon: "bi bi-github" },
      { label: "技术博客", val: "lisi-tech.blog", icon: "bi bi-globe" },
    ],
  },

  education: {
    title: "教育背景",
    data: [
      {
        time: "2017-09 ~ 2020-06",
        school: "浙江大学",
        program: "计算机科学与技术（硕士）",
        content: [
          "研究方向：深度学习与自然语言处理，发表CCF-A类论文2篇，B类论文3篇",
          "GPA：3.8/4.0，获得国家奖学金、优秀研究生称号",
          "主修课程：高级机器学习、分布式系统、计算机视觉、强化学习、大数据处理",
        ],
      },
      {
        time: "2013-09 ~ 2017-06",
        school: "华中科技大学",
        program: "软件工程（本科）",
        content: [
          "专业排名：前5%，保送浙江大学攻读硕士学位",
          "获得全国大学生数学建模竞赛一等奖、ACM区域赛银奖",
          "主修课程：数据结构与算法、操作系统、计算机网络、数据库系统、软件工程",
        ],
      },
    ],
  },

  experience: {
    title: "工作经历",
    data: [
      {
        time: "2022-03 ~ 至今",
        company: "字节跳动 · AI Lab",
        role: "高级AI全栈工程师",
        content: [
          "主导开发企业级AI智能客服系统，日处理对话量超500万条，响应延迟从800ms降至120ms，客户满意度提升35%",
          "设计并实现基于LLM的智能代码助手，支持20+编程语言，内部开发者效率提升40%，获公司技术创新奖",
          "搭建MLOps全流程平台，实现模型训练-部署-监控自动化，模型迭代周期从2周缩短至2天",
          "带领5人技术团队，负责AI中台架构设计与核心模块开发，推动团队技术栈从Python2迁移至Python3+TypeScript",
        ],
      },
      {
        time: "2020-07 ~ 2022-02",
        company: "阿里云 · 智能计算平台",
        role: "AI应用开发工程师",
        content: [
          "开发视觉智能分析平台，集成YOLO、ResNet等10+算法模型，服务电商、物流等5个行业客户，年营收超2000万",
          "优化TensorRT推理引擎，GPU利用率从45%提升至85%，单卡并发处理能力提升3倍",
          "构建低代码AI应用搭建平台，降低AI应用开发门槛，累计创建应用3000+，用户留存率65%",
          "参与开源项目PaddlePaddle前端可视化组件库开发，贡献代码2000+行，获社区突出贡献者认证",
        ],
      },
      {
        time: "2019-06 ~ 2020-06",
        company: "微软亚洲研究院 · 创新工程组",
        role: "研究工程师（实习）",
        content: [
          "参与多模态预训练模型UniLM的前端交互系统开发，支持文本、图像、语音多维度输入",
          "实现Web端实时语音识别与合成演示系统，延迟控制在200ms以内，获MSRA最佳实习生项目奖",
          "协助完成3篇顶会论文的实验验证与可视化展示工作",
        ],
      },
    ],
  },

  externals: [
    {
      title: "技术栈",
      content: [
        "AI/ML：PyTorch、TensorFlow、Transformers、LangChain、LlamaIndex、OpenAI API、Hugging Face",
        "后端：Python、Go、Node.js、FastAPI、Django、gRPC、Redis、Kafka、Elasticsearch",
        "前端：React、Vue3、TypeScript、Next.js、WebGL、Three.js、D3.js、TailwindCSS",
        "基础设施：Docker、Kubernetes、AWS/GCP/阿里云、Terraform、Prometheus、Grafana",
        "数据库：PostgreSQL、MongoDB、Milvus、Neo4j、ClickHouse",
        "大模型：GPT-4、Claude、Llama2/3、Stable Diffusion、Embedding模型微调与部署",
      ],
    },
    {
      title: "项目成果",
      content: [
        "开源项目AI-Chat-Frontend：GitHub Star 8.5k+，npm周下载量2万+，支持多模态对话与流式输出",
        "技术专栏《从0到1构建AI应用》：掘金小册销量3000+，知乎关注者2.5万",
        "专利：2项发明专利（智能对话系统、模型推理优化），1项实用新型专利",
        "演讲：QCon全球软件开发大会、AICon人工智能大会特邀讲师",
      ],
    },
    {
      title: "自我评价",
      content: [
        "7年AI工程化经验，具备从算法研究到产品落地的全栈能力，擅长将前沿AI技术转化为商业产品",
        "技术视野开阔，持续关注LLM、多模态、Agent等前沿方向，具备快速学习与技术选型能力",
        "具备团队管理经验，擅长跨部门协作与技术方案设计，推动技术方案高效落地",
        "开源社区活跃贡献者，热爱技术分享，致力于降低AI应用开发门槛",
      ],
    },
  ],
};
