//import Scss
import '../scss/themes.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/dist/sweetalert2.min.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices";
import { GlobalVelzonToastContainer } from './Components/Common/VelzonToast';

let siteTitleSuffix = import.meta.env.VITE_APP_NAME || 'Laravel';

const store = configureStore({ reducer: rootReducer, devTools: true });
createInertiaApp({
    title: (title) => (title ? `${title} | ${siteTitleSuffix}` : siteTitleSuffix),
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const initialSiteTitle = (props.initialPage?.props as { site?: { title?: string } })?.site?.title;
        if (initialSiteTitle) {
            siteTitleSuffix = initialSiteTitle;
        }

        router.on('success', (event) => {
            const t = (event.detail.page.props as { site?: { title?: string } }).site?.title;
            if (t) {
                siteTitleSuffix = t;
            }
        });

        const root = createRoot(el);

        root.render(
            <Provider store={store}>
                <App {...props} />
                <GlobalVelzonToastContainer />
            </Provider>
        );
    },
    progress: {
        color: '#F54927',
    },
});