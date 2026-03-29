export const LayoutPublic = (props: { children: any }) => {
  return (
    <div>
      <h1>Public 路由</h1>
      {props.children}
    </div>
  );
};
