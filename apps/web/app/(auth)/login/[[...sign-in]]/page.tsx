{/* 
* Authentication handled by Clerk
* There are no sign in page both sign in and sign up are handled in the same page by Clerk
* There two separate container one is occupied for sign in and another for product demo tour or may customer reviews
*/}

import { Layout } from '../../_components/layout'
import { Client as SignInClient } from './login.client'

export default function Page() {
    return (
        <Layout>
            <SignInClient />
        </Layout>
    )
}

export const metadata = {
    title: 'Sign in to Snappin',
    description: 'Sign in to your Snappin account to extract your invoices from mails',
}