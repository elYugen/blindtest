import React from 'react';
import './Loading.css';

function Loading() {
  return (
    <div className="loading"><img src="loading.gif" style={{width: "50px"}} alt="Chargement" /></div>
  );
};

export default Loading;