'use client' // Required only in App Router.

import dynamic from 'next/dynamic';

const ClientSideCustomEditor = dynamic( () => import( '@/Components/CustomEditor' ), { ssr: false } );

export default ClientSideCustomEditor;