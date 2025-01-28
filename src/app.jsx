import 'src/global.css';

// ----------------------------------------------------------------------

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { LocalizationProvider } from 'src/locales';
import ReduxProvider from 'src/redux/redux-provider';
import { I18nProvider } from 'src/locales/i18n-provider';
import { ThemeProvider } from 'src/theme/theme-provider';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from './auth/context/auth-jwt';
// ----------------------------------------------------------------------

export default function App() {
    useScrollToTop();

    return (
        <I18nProvider>
            <LocalizationProvider>
                <AuthProvider>
                    <ReduxProvider>
                        <SettingsProvider settings={defaultSettings}>
                            <ThemeProvider>
                                <MotionLazy>
                                    <Snackbar />
                                    <ProgressBar />
                                    <SettingsDrawer />
                                    <Router />
                                </MotionLazy>
                            </ThemeProvider>
                        </SettingsProvider>
                    </ReduxProvider>
                </AuthProvider>
            </LocalizationProvider>
        </I18nProvider>
    );
}
