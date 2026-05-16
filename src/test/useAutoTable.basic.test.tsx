import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { createAutoTableUser } from "../components/AutoTable/createAutoTableUser.tsx";

const mockUsers = [
  { id: 1, username: "user1", fullName: "用户1" },
  { id: 2, username: "user2", fullName: "用户2" },
  { id: 3, username: "user3", fullName: "用户3" },
];

const mockHttp = {
  post: vi.fn().mockResolvedValue({
    data: {
      list: mockUsers,
      total: mockUsers.length,
    },
  }),
};

const AppServiceContext = React.createContext({ http: mockHttp });

vi.mock("../AppService/useAppService.tsx", () => ({
  useAppContext: () => React.useContext(AppServiceContext),
}));

const useAutoTable = createAutoTableUser({
  pageSize: 5,
  tableProps: {
    rowKey: "id",
  },
});

const TestProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppServiceContext.Provider value={{ http: mockHttp }}>
      {children}
    </AppServiceContext.Provider>
  );
};

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<TestProvider>{ui}</TestProvider>);
};

describe("useAutoTable基本功能测试", () => {
  beforeEach(() => {
    mockHttp.post.mockClear();
  });

  it("基本查询，初始化之后自动查询数据", async () => {
    function TestComponent() {
      const autoTable = useAutoTable({
        module: "user",
        columns: [{ title: "用户名", dataIndex: "username" }, { title: "用户昵称", dataIndex: "fullName" }],
      });
      return <div>{autoTable.content}</div>;
    }

    renderWithProvider(<TestComponent />);

    expect(screen.getByRole("table")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockHttp.post).toHaveBeenCalledWith(
        "/general/user/list",
        { page: 0, pageSize: 5, withCount: true }
      );
    });

    await waitFor(() => {
      mockUsers.forEach(user => {
        expect(screen.getByText(user.username)).toBeInTheDocument();
        expect(screen.getByText(user.fullName)).toBeInTheDocument();
      });
    });

    expect(screen.getByText(`共 ${mockUsers.length} 条`)).toBeInTheDocument();
  });

  it("基本查询，loadOnStart为false，不自动查询数据", async () => {
    function TestComponent() {
      const autoTable = useAutoTable({
        module: "user",
        loadOnStart: false,
        columns: [{ title: "用户名", dataIndex: "username" }, { title: "用户昵称", dataIndex: "fullName" }],
      });
      return (
        <div>
          <button data-testid="reload-btn" onClick={autoTable.reload}>
            手动加载
          </button>
          {autoTable.content}
        </div>
      );
    }

    renderWithProvider(<TestComponent />);

    expect(screen.getByRole("table")).toBeInTheDocument();

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockHttp.post).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("reload-btn"));

    await waitFor(() => {
      expect(mockHttp.post).toHaveBeenCalledWith(
        "/general/user/list",
        { page: 0, pageSize: 5, withCount: true }
      );
    });

    await waitFor(() => {
      mockUsers.forEach(user => {
        expect(screen.getByText(user.username)).toBeInTheDocument();
      });
    });
  });

  it("自定义pageSize配置生效", async () => {
    function TestComponent() {
      const autoTable = useAutoTable({
        module: "user",
        pageSize: 10,
        columns: [{ title: "用户名", dataIndex: "username" }],
      });
      return <div>{autoTable.content}</div>;
    }

    renderWithProvider(<TestComponent />);

    await waitFor(() => {
      expect(mockHttp.post).toHaveBeenCalledWith(
        "/general/user/list",
        { page: 0, pageSize: 10, withCount: true }
      );
    });
  });

  it("返回的data和reload方法可用", async () => {
    const tableRef = { current: null as any };

    function TestComponent() {
      const autoTable = useAutoTable({
        module: "user",
        columns: [{ title: "用户名", dataIndex: "username" }],
      });
      // eslint-disable-next-line react-hooks/immutability
      tableRef.current = autoTable;
      return <div>{autoTable.content}</div>;
    }

    renderWithProvider(<TestComponent />);

    await waitFor(() => {
      expect(tableRef.current).not.toBeNull();
      expect(typeof tableRef.current.reload).toBe("function");
    });

    await waitFor(() => {
      expect(tableRef.current.data).toEqual(mockUsers);
    });

    mockHttp.post.mockClear();
    await act(async () => {
      await tableRef.current.reload();
    });
    expect(mockHttp.post).toHaveBeenCalledTimes(1);
  });

  it("表格列头正确渲染", async () => {
    function TestComponent() {
      const autoTable = useAutoTable({
        module: "user",
        columns: [
          { title: "用户名", dataIndex: "username" },
          { title: "用户昵称", dataIndex: "fullName" }
        ],
      });
      return <div>{autoTable.content}</div>;
    }

    renderWithProvider(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByText("用户名")).toBeInTheDocument();
      expect(screen.getByText("用户昵称")).toBeInTheDocument();
    });
  });

  it("runningConfig包含正确的配置信息", async () => {
    const tableRef = { current: null as any };

    function TestComponent() {
      const autoTable = useAutoTable({
        module: "user",
        columns: [{ title: "用户名", dataIndex: "username" }],
      });
      // eslint-disable-next-line react-hooks/immutability
      tableRef.current = autoTable;
      return <div>{autoTable.content}</div>;
    }

    renderWithProvider(<TestComponent />);

    await waitFor(() => {
      expect(tableRef.current.runningConfig).toBeDefined();
      expect(tableRef.current.runningConfig.module).toBe("user");
      expect(tableRef.current.runningConfig.loadOnStart).toBe(true);
    });
  });

  it("setData可以手动修改表格数据", async () => {
    const tableRef = { current: null as any };
    const customData = [{ id: 99, username: "custom", fullName: "自定义用户" }];

    function TestComponent() {
      const autoTable = useAutoTable({
        module: "user",
        loadOnStart: false,
        columns: [{ title: "用户名", dataIndex: "username" }],
      });
      // eslint-disable-next-line react-hooks/immutability
      tableRef.current = autoTable;
      return <div>{autoTable.content}</div>;
    }

    renderWithProvider(<TestComponent />);

    act(() => {
      tableRef.current.setData(customData);
    });

    await waitFor(() => {
      expect(screen.getByText("custom")).toBeInTheDocument();
      expect(tableRef.current.data).toEqual(customData);
    });
  });

  it("点击页码的时候调用load函数发起请求加载对应页数据", async () => {
    const mockManyUsers = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      fullName: `用户${i + 1}`,
    }));

    mockHttp.post.mockResolvedValueOnce({
      data: {
        list: mockManyUsers.slice(0, 5),
        total: mockManyUsers.length,
      },
    });

    function TestComponent() {
      const autoTable = useAutoTable({
        module: "user",
        columns: [{ title: "用户名", dataIndex: "username" }],
      });
      return <div>{autoTable.content}</div>;
    }

    renderWithProvider(<TestComponent />);

    await waitFor(() => {
      expect(mockHttp.post).toHaveBeenCalledWith(
        "/general/user/list",
        { page: 0, pageSize: 5, withCount: true }
      );
    });

    mockHttp.post.mockClear();
    mockHttp.post.mockResolvedValueOnce({
      data: {
        list: mockManyUsers.slice(5, 10),
        total: mockManyUsers.length,
      },
    });

    const page2Button = screen.getByTitle("2");
    fireEvent.click(page2Button);

    await waitFor(() => {
      expect(mockHttp.post).toHaveBeenCalledWith(
        "/general/user/list",
        { page: 1, pageSize: 5, withCount: true }
      );
    });
  });

  it("点击前进后退的时候加载上一页下一页数据", async () => {
    const mockManyUsers = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      fullName: `用户${i + 1}`,
    }));

    mockHttp.post.mockResolvedValueOnce({
      data: {
        list: mockManyUsers.slice(0, 5),
        total: mockManyUsers.length,
      },
    });

    function TestComponent() {
      const autoTable = useAutoTable({
        module: "user",
        columns: [{ title: "用户名", dataIndex: "username" }],
      });
      return <div>{autoTable.content}</div>;
    }

    renderWithProvider(<TestComponent />);

    await waitFor(() => {
      expect(mockHttp.post).toHaveBeenCalledWith(
        "/general/user/list",
        { page: 0, pageSize: 5, withCount: true }
      );
    });

    mockHttp.post.mockClear();
    mockHttp.post.mockResolvedValueOnce({
      data: {
        list: mockManyUsers.slice(5, 10),
        total: mockManyUsers.length,
      },
    });

    const nextPageButton = screen.getByTitle("Next Page");
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(mockHttp.post).toHaveBeenCalledWith(
        "/general/user/list",
        { page: 1, pageSize: 5, withCount: true }
      );
    });

    mockHttp.post.mockClear();
    mockHttp.post.mockResolvedValueOnce({
      data: {
        list: mockManyUsers.slice(0, 5),
        total: mockManyUsers.length,
      },
    });

    const prevPageButton = screen.getByTitle("Previous Page");
    fireEvent.click(prevPageButton);

    await waitFor(() => {
      expect(mockHttp.post).toHaveBeenCalledWith(
        "/general/user/list",
        { page: 0, pageSize: 5, withCount: true }
      );
    });
  });

  it("切换页大小的时候重新加载对应页数的数据", async () => {
    const mockManyUsers = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      fullName: `用户${i + 1}`,
    }));

    mockHttp.post.mockResolvedValueOnce({
      data: {
        list: mockManyUsers.slice(0, 5),
        total: mockManyUsers.length,
      },
    });

    function TestComponent() {
      const autoTable = useAutoTable({
        module: "user",
        columns: [{ title: "用户名", dataIndex: "username" }],
      });
      return <div>{autoTable.content}</div>;
    }

    renderWithProvider(<TestComponent />);

    await waitFor(() => {
      expect(mockHttp.post).toHaveBeenCalledWith(
        "/general/user/list",
        { page: 0, pageSize: 5, withCount: true }
      );
    });

    mockHttp.post.mockClear();
    mockHttp.post.mockResolvedValueOnce({
      data: {
        list: mockManyUsers.slice(0, 10),
        total: mockManyUsers.length,
      },
    });

    const pageSizeSelect = screen.getByRole("combobox");
    fireEvent.mouseDown(pageSizeSelect);

    await waitFor(() => {
      const pageSizeOption = screen.getByText("10 / page");
      fireEvent.click(pageSizeOption);
    });

    await waitFor(() => {
      expect(mockHttp.post).toHaveBeenCalledWith(
        "/general/user/list",
        { page: 0, pageSize: 10, withCount: true }
      );
    });
  });
});
