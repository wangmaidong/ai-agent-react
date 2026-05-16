declare module "./AutoColumn.utils.tsx" {
  export interface iAutoColumnExpander {
    select: { options: ({ label: string, value: string } | string)[], multiple?: boolean };
  }
}
