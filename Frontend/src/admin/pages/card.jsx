// src/admin/pages/card.js

import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg shadow p-4 bg-white ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`mt-2 ${className}`}>{children}</div>
);
