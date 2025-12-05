import { getSettings } from '@/app/actions/settings-actions';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { SettingsPageRoot } from './SettingsPageRoot';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/api/auth/signin');
  }

  const result = await getSettings();
  const settings = (result.success && result.settings) ? result.settings : null;
  const user = {
    id: session.user.id as string,
    name: session.user.name || '',
    email: session.user.email || '',
    image: session.user.image || null,
  };

  return <SettingsPageRoot initialSettings={settings} user={user} />;
}
