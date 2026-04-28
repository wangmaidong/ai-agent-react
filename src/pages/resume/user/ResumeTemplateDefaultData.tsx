import { DEMO_RESUME_DATA } from "../DEMO_RESUME_DATA";

const DefaultSourceCode = `
import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

// 类型定义 (假设存在，保持代码完整性)
interface iResumeFormData {
  primary: string;
  secondary: string;
  avatar: string;
  title: string;
  basic: {
    title: string;
    data: { label: string; val: string; icon?: string }[];
  };
  education: {
    title: string;
    data: { time: string; school: string; program: string; content: string[] }[];
  };
  experience: {
    title: string;
    data: { time: string; company: string; role: string; content: string[] }[];
  };
  externals: {
    title: string;
    content: string[];
  }[];
}

const Resume = ({ data }: { data: iResumeFormData }) => {
  const { primary, secondary, avatar, title, basic, education, experience, externals } = data;

  // 辅助函数：根据标签名称智能匹配图标，如果原数据没带图标的话
  const getIconForLabel = (label: string, providedIcon?: string) => {
    if (providedIcon) return providedIcon;
    if (label.includes('姓名')) return 'bi bi-person-fill';
    if (label.includes('年龄')) return 'bi bi-calendar-date';
    if (label.includes('年限') || label.includes('经验')) return 'bi bi-briefcase-fill';
    if (label.includes('岗位')) return 'bi bi-code-square';
    if (label.includes('城市')) return 'bi bi-geo-alt-fill';
    if (label.includes('薪资')) return 'bi bi-currency-yen';
    if (label.includes('时间') || label.includes('入职')) return 'bi bi-clock-fill';
    if (label.includes('电话') || label.includes('手机')) return 'bi bi-telephone-fill';
    if (label.includes('邮箱') || label.includes('Email')) return 'bi bi-envelope-fill';
    return 'bi bi-dot'; // 默认图标
  };

  return (
    <PageContainer>
      {/* Header Section */}
      <Header primary={primary}>
        <AvatarWrapper>
          <Avatar src={avatar} alt="avatar" />
        </AvatarWrapper>
        <HeaderInfo>
          <MainTitle>{title}</MainTitle>
          <Slogan>
            {externals.find(e => e.title === '自我评价')?.content[0] || '追求卓越的技术解决方案'}
          </Slogan>
        </HeaderInfo>
      </Header>

      {/* Sub Header / Intent Bar */}
      <IntentBar secondary={secondary}>
        <IntentItem>
          <i className="bi bi-briefcase"></i> {basic.data.find(d => d.label === '意向岗位')?.val || '职位待定'}
        </IntentItem>
        <IntentItem>
          <i className="bi bi-geo-alt"></i> {basic.data.find(d => d.label === '意向城市')?.val || '城市'}
        </IntentItem>
        <IntentItem>
          <i className="bi bi-currency-yen"></i> {basic.data.find(d => d.label === '意向薪资')?.val || '面议'}
        </IntentItem>
        <IntentItem>
          <i className="bi bi-clock"></i> {basic.data.find(d => d.label === '入职时间')?.val || '随时'}
        </IntentItem>
      </IntentBar>

      <MainContent>
        {/* Left Column */}
        <LeftColumn>
          <Section>
            <SectionTitle primary={primary}>{basic.title}</SectionTitle>

            {/* New Table-like Layout for Basic Info */}
            <BasicInfoTable>
              {basic.data.map((item, idx) => (
                <BasicInfoRow key={idx}>
                  <BasicInfoLabel>
                    <i className={getIconForLabel(item.label, item.icon)}></i>
                    <span>{item.label}</span>
                  </BasicInfoLabel>
                  <BasicInfoValue>
                    {item.val}
                  </BasicInfoValue>
                </BasicInfoRow>
              ))}
            </BasicInfoTable>
          </Section>

          {externals.map((ext, idx) => {
            if (ext.title === '自我评价') return null;
            return (
              <Section key={idx}>
                <SectionTitle primary={primary}>{ext.title}</SectionTitle>
                <SkillList>
                  {ext.content.map((text, sIdx) => (
                    <SkillItem key={sIdx}>
                      <SkillName>{text.split('：')[0]}</SkillName>
                      <ProgressBar>
                        <ProgressFill primary={primary} width={sIdx % 2 === 0 ? '85%' : '92%'} />
                      </ProgressBar>
                    </SkillItem>
                  ))}
                </SkillList>
              </Section>
            );
          })}
        </LeftColumn>

        {/* Timeline Divider */}
        <TimelineDivider>
          <Line />
          {Array.from({ length: 12 }).map((_, i) => (
            <Node key={i} primary={primary} style={{ top: \`\${(i + 1) * 8}%\` }} />
          ))}
        </TimelineDivider>

        {/* Right Column */}
        <RightColumn>
          {/* Education */}
          {education?.data?.length > 0 && (
            <Section>
              <SectionTitle primary={primary}>{education.title}</SectionTitle>
              {education.data.map((edu, idx) => (
                <Block key={idx}>
                  <BlockHeader>
                    <BlockTime>{edu.time}</BlockTime>
                    <BlockName>{edu.school}</BlockName>
                  </BlockHeader>
                  <BlockSub>{edu.program}</BlockSub>
                  <BlockContent>
                    {edu.content.map((c, cIdx) => (
                      <li key={cIdx}>{c}</li>
                    ))}
                  </BlockContent>
                </Block>
              ))}
            </Section>
          )}

          {/* Experience */}
          {experience?.data?.length > 0 && (
            <Section>
              <SectionTitle primary={primary}>{experience.title}</SectionTitle>
              {experience.data.map((exp, idx) => (
                <Block key={idx}>
                  <BlockHeader>
                    <BlockTime>{exp.time}</BlockTime>
                    <BlockName>{exp.company}</BlockName>
                  </BlockHeader>
                  <BlockSub>{exp.role}</BlockSub>
                  <BlockContent>
                    {exp.content.map((c, cIdx) => (
                      <li key={cIdx}>{c}</li>
                    ))}
                  </BlockContent>
                </Block>
              ))}
            </Section>
          )}

          {/* Self Evaluation (Mapped to bottom right) */}
          {externals.find(e => e.title === '自我评价') && (
            <Section>
              <SectionTitle primary={primary}>自我评价</SectionTitle>
              <BlockContent>
                {externals.find(e => e.title === '自我评价')?.content.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </BlockContent>
            </Section>
          )}
        </RightColumn>
      </MainContent>
    </PageContainer>
  );
};

// --- Emotion Styles ---

const PageContainer = styled.div\`
  width: 210mm; /* A4 Width */
  min-height: 297mm;
  background: #fff;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #333;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
\`;

const Header = styled.div<{ primary: string }>\`
  background: \${props => props.primary};
  height: 120px;
  display: flex;
  align-items: center;
  padding: 0 40px;
  color: white;
  position: relative;
\`;

const AvatarWrapper = styled.div\`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 4px solid white;
  overflow: hidden;
  position: absolute;
  bottom: -20px;
  left: 60px;
  background: #eee;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
\`;

const Avatar = styled.img\`
  width: 100%;
  height: 100%;
  object-fit: cover;
\`;

const HeaderInfo = styled.div\`
  margin-left: 160px;
\`;

const MainTitle = styled.h1\`
  font-size: 28px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 2px;
\`;

const Slogan = styled.p\`
  font-size: 13px;
  margin-top: 8px;
  opacity: 0.9;
  font-weight: 300;
\`;

const IntentBar = styled.div<{ secondary: string }>\`
  background: \${props => props.secondary};
  height: 60px;
  display: flex;
  align-items: center;
  padding-left: 200px;
  gap: 30px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
\`;

const IntentItem = styled.div\`
  display: flex;
  align-items: center;
  text-align: center;
  gap: 5px;
  max-width: 120px;
  font-size: 12px;
  i { font-size: 12px; }
\`;

const MainContent = styled.div\`
  display: flex;
  padding: 40px 30px;
  flex: 1;
\`;

const LeftColumn = styled.div\`
  width: 280px; /* Slightly wider to accommodate the new table layout comfortably */
  padding-right: 20px;
\`;

const RightColumn = styled.div\`
  flex: 1;
  padding-left: 40px;
\`;

const TimelineDivider = styled.div\`
  width: 1px;
  position: relative;
  display: flex;
  justify-content: center;
\`;

const Line = styled.div\`
  width: 1px;
  height: 100%;
  background: #e0e0e0;
\`;

const Node = styled.div<{ primary: string }>\`
  position: absolute;
  width: 30px;
  height: 8px;
  background: #fff;
  left: -15px;
  &::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: \${props => props.primary};
    border-radius: 50%;
    left: 12px;
    top: 1px;
  }
\`;

const Section = styled.section\`
  margin-bottom: 25px;
\`;

const SectionTitle = styled.h2<{ primary: string }>\`
  font-size: 18px;
  color: \${props => props.primary};
  margin-bottom: 15px;
  font-weight: bold;
  display: flex;
  align-items: center;
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 18px;
    background: \${props => props.primary};
    margin-right: 8px;
    border-radius: 2px;
  }
\`;

/* --- NEW STYLES FOR BASIC INFO TABLE LAYOUT --- */

const BasicInfoTable = styled.div\`
  display: flex;
  flex-direction: column;
  width: 100%;
\`;

const BasicInfoRow = styled.div\`
  display: grid;
  grid-template-columns: 80px 1fr; /* Fixed width for Label+Icon, rest for Value */
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
\`;

const BasicInfoLabel = styled.div\`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;

  i {
    font-size: 16px;
    color: #555;
  }
\`;

const BasicInfoValue = styled.div\`
  color: #333;
  font-size: 12px;
  font-weight: 600;
  padding-left: 8px;
  word-break: break-all; /* Prevent long emails/urls from breaking layout */
\`;

/* --- END NEW STYLES --- */

const SkillList = styled.div\`
  display: flex;
  flex-direction: column;
  gap: 15px;
\`;

const SkillItem = styled.div\`
  display: flex;
  flex-direction: column;
  gap: 5px;
\`;

const SkillName = styled.span\`
  font-size: 13px;
  font-weight: 500;
\`;

const ProgressBar = styled.div\`
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
\`;

const ProgressFill = styled.div<{ primary: string; width: string }>\`
  height: 100%;
  width: \${props => props.width};
  background: \${props => props.primary};
\`;

const Block = styled.div\`
  margin-bottom: 20px;
\`;

const BlockHeader = styled.div\`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
\`;

const BlockTime = styled.span\`
  font-size: 13px;
  color: #333;
  font-weight: 600;
\`;

const BlockName = styled.span\`
  font-size: 14px;
  font-weight: bold;
\`;

const BlockSub = styled.div\`
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
\`;

const BlockContent = styled.ul\`
  padding-left: 18px;
  margin: 0;
  list-style-type: disc;
  li {
    font-size: 12.5px;
    line-height: 1.6;
    color: #444;
    margin-bottom: 4px;
  }
\`;

export default Resume;

`.trim();

export const ResumeTemplateDefaultData = {
  sourceCode: DefaultSourceCode,
  thumbImage: "/web/upload_file/20260405095830_f1eb8944-3092-11f1-8268-0242ac110002/temp_file_1.jpeg",
  resumeJsonString: JSON.stringify({ ...DEMO_RESUME_DATA, primary: "#4828b9", secondary: "#a48aff" }),
};
