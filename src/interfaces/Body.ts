export default interface Body {
  message?: string;
  // TODO: make toDTO() implementation
  toDTO?: () => Record<string, unknown>;
}
