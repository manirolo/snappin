import React from 'react'

export default function Layout({ children } : {children: React.ReactNode}) {
    return (
        <div className="bg-card min-h-screen">{children}</div>
    )
}
