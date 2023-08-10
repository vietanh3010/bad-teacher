import _ from "lodash"
import { Suspense, memo } from 'react'
import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom'
import AuthRoute from './AuthRoute'
import routes from './route-define'
import RouteLoading from "./RouteLoading"

const router = createBrowserRouter(
    routes.map((route) => ({
        ..._.omit(route, 'canGuard') as RouteObject,
        element: (
            <Suspense fallback={<RouteLoading/>}>
                <AuthRoute route={route}>{route.element}</AuthRoute>
            </Suspense>
        ),
    }))
)


const AppRouter = (): JSX.Element => {
    
    return <RouterProvider router={router} />
}
export default memo(AppRouter)
