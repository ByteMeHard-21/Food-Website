import React from 'react';
import AuthenticatedSidebar from './ui/AuthenticatedSidebar';
import UserContextMenu from './ui/UserContextMenu';

export default function Workspace({ title, subtitle, children }) {
  return <div className="min-h-screen bg-background"><AuthenticatedSidebar /><div className="lg:ml-[280px]"><header className="workspace-header sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur px-6 py-3 flex items-center"><span className="text-sm font-medium text-muted-foreground hidden sm:block">Workspace <span className="mx-2">/</span> {title}</span><UserContextMenu /></header><main className="p-5 md:p-8 max-w-[1500px] mx-auto"><div className="mb-7"><p className="eyebrow">ORIGINBITE WORKSPACE</p><h1 className="text-3xl md:text-4xl mt-2">{title}</h1>{subtitle && <p className="text-muted-foreground mt-3">{subtitle}</p>}</div>{children}</main></div></div>;
}
