import React from 'react';

const Connector = ({ isActive }) => {
    return (
        <div className={`w-1 h-8 md:w-12 md:h-1 ${isActive ? 'bg-black' : 'bg-gray-300'} self-center`}></div>
    );
}

export default Connector;
