import React, { Suspense } from 'react'
import { SettingsView } from '../../../modules/settings/settings.view'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SettingsView />
    </Suspense>
  )
}

export const metadata = {
  title: "Settings | Snappin App",
  description:
    "",
};
