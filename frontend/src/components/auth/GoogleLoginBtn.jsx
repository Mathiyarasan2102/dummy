import React, { useEffect, useCallback } from 'react';
import { useGoogleLoginMutation } from '../../store/usersApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

const GOOGLE_SCRIPT_ID = 'google-identity-script';

const loadGoogleScript = (onLoad) => {
    if (document.getElementById(GOOGLE_SCRIPT_ID)) {
        // already present
        onLoad();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.id = GOOGLE_SCRIPT_ID;
    script.onload = onLoad;
    script.onerror = () => console.error('Failed to load Google Identity script');
    document.head.appendChild(script);
};

const GoogleLoginBtn = ({ divId = 'google-signin' }) => {
    const [googleLogin] = useGoogleLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // stable callback
    const handleGoogleResponse = useCallback(
        async (response) => {
            if (!response || !response.credential) {
                console.error('No credential received from Google', response);
                return;
            }
            try {
                // send credential to backend (your RTK mutation)
                const res = await googleLogin({ credential: response.credential }).unwrap();
                dispatch(setCredentials({
                    user: {
                        _id: res._id,
                        name: res.name,
                        email: res.email,
                        role: res.role,
                        avatar: res.avatar
                    },
                    token: res.token
                }));
                navigate('/');
            } catch (err) {
                console.error('Google login failed', err);
            }
        },
        [googleLogin, dispatch, navigate]
    );

    useEffect(() => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        // If Google Client ID is not configured, don't show errors
        if (!clientId || clientId === 'your_google_client_id') {
            console.warn('Google Sign-In is not configured. Set VITE_GOOGLE_CLIENT_ID in .env file to enable.');
            // Hide the button container if no client ID
            const targetDiv = document.getElementById(divId);
            if (targetDiv) {
                targetDiv.style.display = 'none';
            }
            return;
        }

        // callback when script loaded (or immediate if already present)
        const initGoogle = () => {
            if (!window.google?.accounts?.id) {
                console.error('Google Identity SDK not available on window.google.accounts.id');
                return;
            }

            try {
                // initialize only once - calling initialize multiple times is tolerated but we guard re-render
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleGoogleResponse
                });

                const targetDiv = document.getElementById(divId);
                if (!targetDiv) {
                    console.warn(`Google button target div not found: ${divId}`);
                    return;
                }

                // prevent duplicate buttons
                targetDiv.innerHTML = '';

                window.google.accounts.id.renderButton(
                    targetDiv,
                    { theme: 'outline', size: 'large', type: 'standard', text: 'continue_with' }
                );

                // optionally show One Tap (commented out; enable with care)
                // window.google.accounts.id.prompt();
            } catch (err) {
                console.error('Error initializing Google Identity', err);
            }
        };

        // Load script if required, then init
        loadGoogleScript(initGoogle);

        // cleanup: remove button content on unmount (do not remove script)
        return () => {
            const targetDiv = document.getElementById(divId);
            if (targetDiv) targetDiv.innerHTML = '';
        };
    }, [divId, handleGoogleResponse]);

    return <div id={divId} className="w-full flex justify-center mt-4"></div>;
};

export default GoogleLoginBtn;
