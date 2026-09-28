import { Redirect } from 'expo-router';
import { useStore } from '../src/store';

export default function Index() {
  const { s } = useStore();
  return <Redirect href={s.onboarded ? '/(tabs)/tonight' : '/onboarding'} />;
}
