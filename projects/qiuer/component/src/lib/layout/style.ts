// 拟改为 style
export interface StyleMarginPadding {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
}

// flex,width,minWidth,height,minHeight 不带单位默认为 %
export interface StyleMedia {
  flex?: string;
  width?: string;
  minWidth?: string;
  height?: string;
  minHeight?: string;
  color?: string;
  backgroundColor?: string;
  margin?: string | StyleMarginPadding;
  padding?: string | StyleMarginPadding;
}
export interface Style extends StyleMedia {
  sm?: StyleMedia;
  xs?: StyleMedia;
  md?: StyleMedia;
  gt_md?: StyleMedia;
}
