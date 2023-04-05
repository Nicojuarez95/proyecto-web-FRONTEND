import IndexLayout from '../layouts/IndexLayout'
import Index from './Index/Index'

import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <IndexLayout />,
        children: [
            { path: '/', element: <Index /> },
        ]
    },
])