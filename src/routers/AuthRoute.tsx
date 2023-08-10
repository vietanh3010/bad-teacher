import { RouteExtends } from '@/types/types'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import NavigateRoute from './NavigateRoute'
import RouteLoading from './RouteLoading'

type ResolvedRouteProps = {
    // userInfo: UserInfo,
    route: RouteExtends,
    children: React.ReactNode
}
const ResolvedRoute = memo(({
    // userInfo,
    route,
    children
}: ResolvedRouteProps): JSX.Element => {
    const navigate = useNavigate();
   
    return <>{children}</>

    // return (
    //     <Navigate to={'/404'}/>
    // )
})

type ResolvedDataType = any;

type AwaitRouteProps = {
    resolve: Promise<any>,
    errorElement: React.ReactNode,
    children: (resolvedData: any) => React.ReactNode,
}

const AwaitRoute = memo(({
    resolve, 
    errorElement, 
    children,
}: AwaitRouteProps): JSX.Element => {
    const [routeState, setRouteState] = useState<'loading' | 'error' | ResolvedDataType>('loading');

    useEffect(() => {
        async function runPromise() {
            await resolve
            .then(res => {
                setRouteState(res);
            })
            .catch(e => {
                setRouteState('error');
            })
        }
        runPromise();
    }, [resolve])

    const renderByState = () => {
        switch(routeState) {
            case 'loading': {
                return (
                    <RouteLoading/>
                )
            }
            case 'error': {
                return errorElement;
            }
            default: {
                return children(routeState);
            }
        }
    }

    return (
        <>
            {renderByState()}
        </>
    )
})

type AuthRouteProps = {
    children: React.ReactNode
    route: RouteExtends
}

const AuthRoute = ({ children, route }: AuthRouteProps): JSX.Element => {
    const loaderData = useLoaderData()// as RouteLoaderType;

    return (
        <Suspense
            fallback={<RouteLoading/>}>
            {
                // route.canGuard ?
                // (
                //     loaderData &&
                //     <AwaitRoute
                //         resolve={loaderData.userInfo}
                //         errorElement={<NavigateRoute to="/login"/>}
                //         children={(resolvedData) => (
                //             <ResolvedRoute route={route} userInfo={resolvedData}>
                //                 {children}
                //             </ResolvedRoute>
                //         )}/>
                // )
                // :
                children
            }
        </Suspense>
    )
}

export default memo(AuthRoute)
