import { Logo } from '../logo'
import { DashboardOrLogin, DashboardOrLoginResource, NavigationLinks } from './navbar.client'

export const HomeNavbar = ({ isUserLoggedIn }: DashboardOrLoginResource) => {
    return (
        <div className='sticky top-0 border-b border-base-content bg-base-300 px-4 xl:px-0'>
            <div className='h-14 flex items-center justify-between max-w-7xl mx-auto'>
                <Logo />
                <NavigationLinks />
                <DashboardOrLogin isUserLoggedIn={isUserLoggedIn} />
            </div>
        </div>
    )
}
