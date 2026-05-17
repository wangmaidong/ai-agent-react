const columns = [
  { type: "image", title: "预览图", dataIndex: "pictureUrl", imgHeight: 50 },
  { type: "input", title: "商品名称", dataIndex: "name", width: 500 },
];

const CreateDefaultColumnConfig = {
  input: () => {},
  select: () => {},
  toggle: () => {},
};

// 在不考虑ts情况，不同的列，实现不同的渲染功能，我们唯一要做事，是不是给这个列设置默认值
const fillWithDefaultValueColumns = columns.map(col => {
  return {
    ...CreateDefaultColumnConfig[col.type](col),
    render: () => {
      if (A) {
        return col.inlineRender();
      } else {
        return col.inlineEditor();
      }
    },
  };
});

// 如何扩展列
CreateDefaultColumnConfig.image = () => {};
