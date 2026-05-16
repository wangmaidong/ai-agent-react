import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

const TestComponent = () => {
  return <div data-testid="test-component">Hello Vitest</div>
}

describe('TestComponent', () => {
  it('should render correctly', () => {
    render(<TestComponent />)
    expect(screen.getByTestId('test-component')).toBeInTheDocument() // 验证  data-testid="test-component" 渲染到文档流中
    expect(screen.getByText('Hello Vitest')).toBeInTheDocument()     // 验证 div#test-component 内部的文本是是这个"Hello Vitest“
  })
})

describe('Math operations', () => {
  it('should add correctly', () => {
    expect(1 + 1).toBe(2)
  })

  it('should multiply correctly', () => {
    expect(2 * 3).toBe(6)
  })
})
