import { icons, CircleHelp } from 'lucide-react';

// Render a Lucide icon by name, so mock data can reference icons as strings.
export default function Icon({ name, ...props }) {
  const Cmp = icons[name] || CircleHelp;
  return <Cmp {...props} />;
}
