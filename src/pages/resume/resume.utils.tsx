import { iBaseRecord } from "../../utils/type.utils";
import { createWebEnums } from "../../utils/createWebEnums";

/*---------------------------------------iResumeFormData start-------------------------------------------*/

/*简历基本项信息数据类型*/
export interface iResumeBasicItem {
  /*名称，示例：姓名、年龄、工作年限、意向岗位、意向城市、意向薪资、入职时间、电话号码、邮箱、最高学历*/
  label?: string,
  /*值，示例：张三、18、1年、前端开发、上海、10K-15K、2023年1月、12345678901、1234567890@qq.com、本科*/
  val?: string,
  /*
  * 使用的 bootstrap-icons 图标
  * 资源地址：https://cdn.bootcdn.net/ajax/libs/bootstrap-icons/1.13.1/font/bootstrap-icons.min.css
  * 示例：
  * <i class="bi bi-search"></i>
  * <i class="bi bi-heart-fill"></i>
  */
  icon?: string
}

/*简历教育信息数据类型*/
export interface iResumeEducationItem {
  /*时间范围，示例 2019-07 ~ 2020-01*/
  time?: string,
  /*毕业院校，示例：中山大学*/
  school?: string,
  /*专业：工商管理(本科)*/
  program?: string,
  /*
  * 专业课内容，示例：
  * 1. 专业成绩：GPA 3.66/4 （专业前5%）
  * 2. 主修课程：基础会计学、货币银行学、统计学、经济法概论、财务会计学、管理学原理、组织行为学、市场营销学、国际贸易理论、国际贸易实务、人力资源开发与管理、财务管理学、企业经营战略概论、质量管理学、西方经济学等等。
  */
  content: string[]
}

/*工作经历信息数据类型*/
export interface iResumeExperienceItem {
  /*时间范围，示例 2022-03 ~ 至今*/
  time?: string,
  /*公司名称，示例：星耀科技发展有限公司*/
  company?: string,
  /*岗位角色：示例：AI 前端开发工程师*/
  role?: string,
  /*
  * 工作内容，示例：
  * 1. 主导基于 TensorFlow.js 的智能图像标注前端系统开发，实现模型实时预测与标注交互，提升标注效率 40%
  * 2. 运用 React+D3.js 搭建 AI 算法可视化分析平台，完成数据动态展示与模型训练过程可视化
  * 3. 优化 WebGL 三维渲染性能，实现 AI 生成 3D 场景的流畅交互，降低内存占用 35%
  */
  content: string[]
}

/*简历其他数据信息*/
export interface iResumeExternalItem {
  /*信息标题，示例：技能特长、兴趣爱好、自我评价、荣誉证书*/
  title: string,
  /*信息内容*/
  content: string[],
}

/*简历数据类型*/
export interface iResumeFormData {
  // 简历标题
  title: string,
  // 第一主题色
  primary: string,
  // 第二主题色
  secondary: string,
  // 职业照图片地址
  avatar: string,
  // 简历基本项信息数据
  basic: {
    title: string,
    data: iResumeBasicItem[],
  },
  // 简历教育信息数据
  education: {
    title: string,
    data: iResumeEducationItem[],
  },
  // 工作经历信息数据
  experience: {
    title: string,
    data: iResumeExperienceItem[],
  },
  // 简历其他数据信息
  externals: iResumeExternalItem[]
}

/*---------------------------------------iResumeFormData end-------------------------------------------*/

/*简历模板数据类型*/
export interface iResumeTemplateRecord extends iBaseRecord {
  thumbImage?: string,
  sourceCode?: string,
  defaultPrimary?: string,
  defaultSecondary?: string,
}

export const ResumeTempViewMode = createWebEnums({ preview: "预览", code: "编码" } as const);

/*用户简历数据类型*/
export interface iResumeUserRecord extends iBaseRecord {
  /*渲染组件源码*/
  sourceCode?: string,
  /*缩略展示图*/
  thumbImage?: string,
  /*简历json数据*/
  resumeJsonString: string,

  /*加载完数据之后，解析resume_json_string到这里，必须有值*/
  resumeJsonData: iResumeFormData,
}

export const ResumeUserViewMode = createWebEnums({ preview: "预览", code: "编码", data: "数据" } as const);
