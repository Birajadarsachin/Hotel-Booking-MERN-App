// ErrorPage.js
import React from 'react';

export default function ErrorPage({ message }) {
    return (
        <div className="error-page">
            <h1 className="text-4xl">Error</h1>
            <p className="text-red-500">{message}</p>
            <a href="/" className="underline">Go back to Home</a>
        </div>
    );
}
