import { classnames } from "@peryl/utils/classnames";

import "./PageContainer.scss";

export const PageContainer = (props: {
  children: any,
  full?: boolean,
  noPadding?: boolean,
  darkerBackground?: boolean,
}) => {
  return (
    <div className={classnames([
      "aic-page-container", {
        "aic-page-container-full": props.full,
        "aic-page-container-no-padding": props.noPadding,
        "aic-page-container-darker-background": props.darkerBackground,
      },
    ])}>
      {props.children}
    </div>
  );
};
