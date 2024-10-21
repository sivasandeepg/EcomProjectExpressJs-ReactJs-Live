import React from 'react';
import '../../styles/FailurePage.css';

const FailurePage = () => {
    return (
        <div className="failure-page">
            <h1>Payment Failed</h1>
            <p>Sorry, your payment could not be processed. Please try again later.</p>
            <button onClick={() => window.location.href = '/checkout'}>Retry Payment</button>
        </div>
    );
};

export default FailurePage;
 