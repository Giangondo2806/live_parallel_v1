import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Idle Resource Management | IRMS',
  description: 'Manage idle resources, search, filter, and track resource availability',
  keywords: 'idle resources, resource management, employee management, skills tracking'
};

export default function IdleResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
