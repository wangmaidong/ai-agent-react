export const FixContainer = (props: { children?: any, style?: any, visible?: boolean }) => {
  const visible = props.visible ?? true;
  return (
    <div style={{
      position: "absolute", inset: "0", overflow: "auto",
      opacity: visible ? 1 : 0,
      zIndex: visible ? 2 : 1,
      ...props.style,
    }}>
      {props.children}
    </div>
  );
};

export default FixContainer;
