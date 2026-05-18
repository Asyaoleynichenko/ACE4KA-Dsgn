import HalftoneButton from './HalftoneButton.jsx';

/** Glossy fintech swap CTA — preset label «Swap». */
export default function SwapHalftoneButton({ children = 'Swap', ...props }) {
  return <HalftoneButton {...props}>{children}</HalftoneButton>;
}
