import * as React from 'react';

interface Props {
  className?: string,
}

const SymbolicIcon = ({ children, className }: React.PropsWithChildren<Props>) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 16 16">
    {children}
  </svg>
);

export const AdwaitaTrashIcon = ({ className }: Props) => (
  <SymbolicIcon className={className}>
    {/* Adwaita: user-trash-symbolic */}
    <path d="M6.5 0A2.5 2.5 0 0 0 4 2.5V3H1a1 1 0 0 0 0 2h1v8a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5h1a1 1 0 0 0 0-2h-3.023v-.5A2.5 2.5 0 0 0 9.477 0Zm0 2h2.977a.48.48 0 0 1 .5.5V3H6v-.5a.48.48 0 0 1 .5-.5ZM4 5h8v8a.98.98 0 0 1-1 1H5a.98.98 0 0 1-1-1Zm2 2v5a.5.5 0 0 0 1 0V7a.5.5 0 0 0-1 0Zm3 0v5a.5.5 0 0 0 1 0V7a.5.5 0 0 0-1 0Z" />
  </SymbolicIcon>
);

export const AdwaitaCloseIcon = ({ className }: Props) => (
  <SymbolicIcon className={className}>
    {/* Adwaita: window-close-symbolic */}
    <path d="M4 4h1c.254.012.512.129.719.313L8 6.593l2.313-2.28c.265-.231.445-.305.687-.313h1v1c0 .285-.035.55-.25.75L9.47 8.031l2.25 2.25c.187.188.281.453.281.719v1h-1c-.266 0-.531-.094-.719-.281L8 9.437l-2.281 2.282A1.02 1.02 0 0 1 5 12H4v-1c0-.266.094-.531.281-.719l2.282-2.25L4.28 5.75A.94.94 0 0 1 4 5Z" />
  </SymbolicIcon>
);

export const AdwaitaPlusIcon = ({ className }: Props) => (
  <SymbolicIcon className={className}>
    {/* Adwaita: list-add-symbolic */}
    <path d="M7 1v6H1v2h6v6h2V9h6V7H9V1Z" />
  </SymbolicIcon>
);
