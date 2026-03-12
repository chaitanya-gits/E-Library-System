import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageTransitionContext } from './pageTransitionContext';
import {
    getTransitionMessage,
    MANUAL_NAVIGATION_DELAY_MS,
    MIN_ROUTE_LOADING_MS,
} from '../utils/pageTransition';

function PageTransitionOverlay({ visible, message }) {
    return (
        <div className={`page-transition-overlay${visible ? ' is-visible' : ''}`} aria-hidden={!visible}>
            <div className="page-transition-card" role="status" aria-live="polite">
                <div className="page-transition-spinner-shell">
                    <div className="page-transition-spinner-ring"></div>
                    <img src="/book-icon.svg" alt="" className="page-transition-logo" />
                </div>
                <p className="page-transition-brand">StacXlabs Library</p>
                <p className="page-transition-message">{message}</p>
            </div>
        </div>
    );
}

export function PageTransitionProvider({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [transitionState, setTransitionState] = useState({
        visible: true,
        message: getTransitionMessage(location.pathname),
    });

    const initialLoadRef = useRef(true);
    const manualTransitionRef = useRef(false);
    const transitionStartedAtRef = useRef(Date.now());
    const hideTimerRef = useRef(null);

    const clearHideTimer = useCallback(() => {
        if (hideTimerRef.current) {
            window.clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
    }, []);

    const finishTransition = useCallback((startedAt) => {
        clearHideTimer();

        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(MIN_ROUTE_LOADING_MS - elapsed, 0);

        hideTimerRef.current = window.setTimeout(() => {
            setTransitionState((currentState) => ({
                ...currentState,
                visible: false,
            }));
            manualTransitionRef.current = false;
            transitionStartedAtRef.current = 0;
        }, remaining);
    }, [clearHideTimer]);

    const beginTransition = useCallback((message = getTransitionMessage(location.pathname)) => {
        clearHideTimer();
        manualTransitionRef.current = true;
        transitionStartedAtRef.current = Date.now();
        setTransitionState({
            visible: true,
            message,
        });
    }, [clearHideTimer, location.pathname]);

    const navigateWithTransition = useCallback((to, options = {}, message = getTransitionMessage(typeof to === 'string' ? to : location.pathname)) => {
        beginTransition(message);
        window.setTimeout(() => {
            navigate(to, options);
        }, MANUAL_NAVIGATION_DELAY_MS);
    }, [beginTransition, location.pathname, navigate]);

    useEffect(() => {
        const message = getTransitionMessage(location.pathname);
        const startedAt = manualTransitionRef.current && transitionStartedAtRef.current
            ? transitionStartedAtRef.current
            : Date.now();

        transitionStartedAtRef.current = startedAt;

        if (initialLoadRef.current) {
            initialLoadRef.current = false;
        } else if (!manualTransitionRef.current) {
            setTransitionState({
                visible: true,
                message,
            });
        } else {
            setTransitionState((currentState) => ({
                ...currentState,
                message: currentState.message || message,
            }));
        }

        finishTransition(startedAt);

        return clearHideTimer;
    }, [location.pathname, location.search, clearHideTimer, finishTransition]);

    const contextValue = useMemo(() => ({
        beginTransition,
        navigateWithTransition,
    }), [beginTransition, navigateWithTransition]);

    return (
        <PageTransitionContext.Provider value={contextValue}>
            {children}
            <PageTransitionOverlay visible={transitionState.visible} message={transitionState.message} />
        </PageTransitionContext.Provider>
    );
}
