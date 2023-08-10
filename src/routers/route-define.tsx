import BreadCrumbLink from '@/components/BreadCrumbLink'
import { RouteExtends } from '@/types/types'
import { lazy } from 'react'
import NavigateRoute from './NavigateRoute'
import LayoutContainer from '@/layouts/LayoutContainer';

// main
const CallCredentialsModule = lazy(() => import('@/pages/admin/CallCredentials'));
const PublicCallModule = lazy(() => import('@/pages/public/PublicCall'));

const routes: RouteExtends[] = [
    {
        path: '/',
        element: <LayoutContainer />,
        canGuard: false,
        children: [
            {
                path: '',
                index: true,
                element: <NavigateRoute to="admin/call-credentials"/>,
                canGuard: false,
            },
            {
                path: 'public',
                element: <PublicCallModule/>,
                canGuard: false,
            },
        ]
    },
    {
        path: '/admin',
        element: (
            <LayoutContainer />
        ),
        canGuard: true,
        children: [
            {
                path: '',
                index: true,
                element: <NavigateRoute to="call-credentials"/>,
                canGuard: true,
            },
            {
                path: 'call-credentials',
                canGuard: true,
                children: [
                    {
                        path: '',
                        index: true,
                        element: <CallCredentialsModule/>,
                        canGuard: true,
                    },
                ],
                handle:{
                    crumb: () => <BreadCrumbLink linkTo={"call-credentials"}/>,
                }
            },
            {
                path: '404',
                element: <div>404</div>,
                canGuard: true,
                handle:{
                    crumb: () => <BreadCrumbLink linkTo={"404"}/>,
                },
            },
            {
                path: '*',
                element: <NavigateRoute to="/404" />,
                canGuard: true,
            },
        ],
    },
]

export default routes;
